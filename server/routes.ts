import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateCaptcha } from "./captcha";
import adminRoutes from "./admin-routes";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs/promises";

// Extend session interface for captcha
declare module 'express-session' {
  interface SessionData {
    captchaCode?: string;
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'client/public/assets/game_logo_pay_proof');

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

const storage_multer = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  // using blueprint: javascript_auth_all_persistance
  setupAuth(app);

  // Admin routes - set up early to avoid conflicts
  app.use('/api/admin', adminRoutes);

  // Test endpoint for debugging
  app.get("/api/test-captcha", async (req, res) => {
    try {
      console.log('Testing captcha generation...');
      const captcha = generateCaptcha();
      console.log('Captcha generated:', { code: captcha.code, imageSize: captcha.image.length });
      
      const isSVG = captcha.image.toString('utf-8').startsWith('<svg');
      console.log('Is SVG:', isSVG);
      
      res.json({
        success: true,
        code: captcha.code, // Only for testing - remove in production
        imageSize: captcha.image.length,
        isSVG,
        preview: isSVG ? captcha.image.toString('utf-8').substring(0, 100) + '...' : 'PNG binary data'
      });
    } catch (error) {
      console.error('Test captcha error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Captcha generation endpoint
  app.get("/api/captcha", async (req, res) => {
    try {
      const captcha = generateCaptcha();
      
      // Determine if it's SVG or PNG based on buffer content
      const isSVG = captcha.image.toString('utf-8').startsWith('<svg');
      const mimeType = isSVG ? 'image/svg+xml' : 'image/png';
      
      let imageDataUrl;
      if (isSVG) {
        // For SVG, convert to base64 for better compatibility
        const base64Data = captcha.image.toString('base64');
        imageDataUrl = `data:image/svg+xml;base64,${base64Data}`;
      } else {
        // For PNG, use base64 encoding
        const base64Data = captcha.image.toString('base64');
        imageDataUrl = `data:image/png;base64,${base64Data}`;
      }
      
      // Store captcha in database if using MySQL storage
      if ('createCaptchaSession' in storage) {
        const sessionId = await (storage as any).createCaptchaSession(captcha.code);
        res.json({
          sessionId,
          image: imageDataUrl
        });
      } else {
        // Fallback for memory storage - store in session
        req.session.captchaCode = captcha.code;
        res.json({
          sessionId: 'session',
          image: imageDataUrl
        });
      }
    } catch (error) {
      console.error('Error generating captcha:', error);
      res.status(500).json({ error: "Failed to generate captcha" });
    }
  });

  // Captcha verification endpoint
  app.post("/api/verify-captcha", async (req, res) => {
    try {
      const { sessionId, code } = req.body;

      if (!sessionId || !code) {
        return res.status(400).json({ error: "Session ID and code are required" });
      }

      let isValid = false;

      if ('verifyCaptcha' in storage) {
        isValid = await (storage as any).verifyCaptcha(sessionId, code);
      } else {
        // Fallback for memory storage
        isValid = req.session.captchaCode === code;
        if (isValid) {
          delete req.session.captchaCode;
        }
      }

      res.json({ valid: isValid });
    } catch (error) {
      console.error('Error verifying captcha:', error);
      res.status(500).json({ error: "Failed to verify captcha" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the relative path for database storage
    const relativePath = `/assets/game_logo_pay_proof/${req.file.filename}`;
    res.json({ 
      filename: req.file.filename,
      path: relativePath,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });

  // Order management routes
  app.post("/api/orders", upload.fields([
    { name: 'gameLogo', maxCount: 1 },
    { name: 'transactionScreenshot', maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const orderData = JSON.parse(req.body.orderData || '{}');

      // Add file paths to order data
      if (files.gameLogo && files.gameLogo[0]) {
        orderData.gameLogo = `/assets/game_logo_pay_proof/${files.gameLogo[0].filename}`;
      }
      if (files.transactionScreenshot && files.transactionScreenshot[0]) {
        orderData.transactionScreenshot = `/assets/game_logo_pay_proof/${files.transactionScreenshot[0].filename}`;
      }

      const completeOrderData = {
        userId: req.user!.id,
        ...orderData
      };

      // If using MySQL storage, create order
      if ('createOrder' in storage) {
        const orderId = await (storage as any).createOrder(completeOrderData);
        res.status(201).json({ orderId, message: "Order created successfully" });
      } else {
        // Fallback for memory storage
        console.log('Order submitted:', completeOrderData);
        res.status(201).json({ message: "Order submitted successfully" });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // If using MySQL storage, get user orders
      if ('getUserOrders' in storage) {
        const orders = await (storage as any).getUserOrders(req.user!.id);
        res.json(orders);
      } else {
        // Fallback for memory storage
        res.json([]);
      }
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Add endpoint for admin to update order milestones
  app.put("/api/orders/:orderId/milestone", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Check if user is admin (you can implement your own admin check logic)
      const isAdmin = req.user!.username === 'admin' || req.user!.id === 1; // Example admin check
      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { orderId } = req.params;
      const { status, milestone } = req.body;

      if ('updateOrderMilestone' in storage) {
        await (storage as any).updateOrderMilestone(orderId, status, milestone);
        res.json({ message: "Order milestone updated successfully" });
      } else {
        res.status(501).json({ error: "Milestone updates not supported" });
      }
    } catch (error) {
      console.error('Error updating order milestone:', error);
      res.status(500).json({ error: "Failed to update order milestone" });
    }
  });

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Check database connectivity
      let dbStatus = 'unknown';
      if ('pool' in storage) {
        try {
          await (storage as any).pool.execute('SELECT 1');
          dbStatus = 'connected';
        } catch (dbError) {
          dbStatus = 'disconnected';
        }
      }
      
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        database: dbStatus
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: (error as Error).message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
