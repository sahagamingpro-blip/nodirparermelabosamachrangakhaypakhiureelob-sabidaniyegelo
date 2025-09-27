import express from 'express';
import passport from 'passport';
import { storage } from './storage';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { requireAdmin, requireAdminRole, hashPassword } from './admin-auth';

const router = express.Router();

// Setup multer for QR code upload
const qrUploadDir = path.join(process.cwd(), 'client/public/assets');

const ensureQrUploadDir = async () => {
  try {
    await fs.access(qrUploadDir);
  } catch {
    await fs.mkdir(qrUploadDir, { recursive: true });
  }
};

const qrStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureQrUploadDir();
    cb(null, qrUploadDir);
  },
  filename: (req, file, cb) => {
    // Always save as usdt_qr.png regardless of original filename
    cb(null, 'usdt_qr.png');
  }
});

const qrUpload = multer({
  storage: qrStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Generate password hash (for manual database updates)
router.post('/hash-password', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const hashedPassword = hashPassword(password);
    
    res.json({
      password: password,
      hashedPassword: hashedPassword,
      instructions: [
        '1. Copy the hashedPassword value below',
        '2. Go to phpMyAdmin → admin_users table',
        '3. Edit the admin user row',
        '4. Replace the password field with the hashedPassword',
        '5. Save the changes'
      ],
      sqlQuery: `UPDATE admin_users SET password = '${hashedPassword}' WHERE username = 'admin';`
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ 
      error: 'Failed to hash password',
      details: error.message 
    });
  }
});

// Reset admin user password (public endpoint for setup)
router.post('/reset-admin', async (req, res) => {
  try {
    // Create admin user with hashed password (will update if exists)
    const hashedPassword = hashPassword('admin123');
    
    // First try to update existing admin
    const updateResult = await storage.pool.execute(
      `UPDATE admin_users SET password = ?, updated_at = NOW() WHERE username = 'admin'`,
      [hashedPassword]
    );
    
    // If no rows were affected, create new admin
    if ((updateResult as any)[0].affectedRows === 0) {
      await storage.pool.execute(
        `INSERT INTO admin_users (username, password, full_name, email, role, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin', hashedPassword, 'System Administrator', 'admin@a2z.dog', 'super_admin', true]
      );
    }

    res.json({
      message: 'Admin user password reset successfully!',
      username: 'admin',
      password: 'admin123',
      email: 'admin@a2z.dog',
      role: 'super_admin',
      loginUrl: '/admin-rs',
      note: 'Password has been set to admin123'
    });
  } catch (error) {
    console.error('Error resetting admin user:', error);
    res.status(500).json({ 
      error: 'Failed to reset admin user',
      details: error.message 
    });
  }
});

// Initialize admin user (public endpoint for setup)
router.post('/init', async (req, res) => {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getAdminByUsername('admin');
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        username: 'admin',
        note: 'Use /api/admin/reset-admin to reset password to admin123'
      });
    }

    // Create admin user with hashed password
    const hashedPassword = hashPassword('admin123');
    
    await storage.pool.execute(
      `INSERT INTO admin_users (username, password, full_name, email, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['admin', hashedPassword, 'System Administrator', 'admin@a2z.dog', 'super_admin', true]
    );

    res.json({
      message: 'Admin user created successfully!',
      username: 'admin',
      password: 'admin123',
      email: 'admin@a2z.dog',
      role: 'super_admin',
      loginUrl: '/admin-rs'
    });
  } catch (error) {
    console.error('Error initializing admin user:', error);
    res.status(500).json({ 
      error: 'Failed to initialize admin user',
      details: error.message 
    });
  }
});

// Admin login
router.post('/login', (req, res, next) => {
  passport.authenticate('admin-local', (err: any, admin: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!admin) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    }
    
    req.logIn(admin, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }
      
      return res.json({
        id: admin.id,
        username: admin.username,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role
      });
    });
  })(req, res, next);
});

// Admin logout
router.post('/logout', requireAdmin, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current admin user
router.get('/user', requireAdmin, (req, res) => {
  const admin = req.user as any;
  res.json({
    id: admin.id,
    username: admin.username,
    fullName: admin.full_name,
    email: admin.email,
    role: admin.role,
    lastLogin: admin.last_login
  });
});

// Dashboard stats
router.get('/dashboard/stats', requireAdmin, async (req, res) => {
  try {
    const [usersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM users');
    const [ordersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM orders');
    const [pendingOrdersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const [completedOrdersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    const [revenueResult] = await storage.pool.execute('SELECT SUM(amount) as total FROM orders WHERE status = "completed"');
    
    res.json({
      totalUsers: (usersResult as any[])[0].count,
      totalOrders: (ordersResult as any[])[0].count,
      pendingOrders: (pendingOrdersResult as any[])[0].count,
      completedOrders: (completedOrdersResult as any[])[0].count,
      totalRevenue: (revenueResult as any[])[0].total || 0
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Users management
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await storage.getAllUsers(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

router.delete('/users/:id', requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await storage.deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Orders management
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await storage.getAllOrders(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.put('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    await storage.pool.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.put('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    await storage.updateOrderMilestone(orderId, status, null);
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

router.put('/orders/:id/milestone', requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, milestone, download_file } = req.body;
    
    console.log('🔧 Admin updating order:', orderId);
    console.log('🔧 Request body:', req.body);
    console.log('🔧 Status:', status);
    console.log('🔧 Milestone:', milestone);
    console.log('🔧 Download file:', download_file);
    
    await storage.updateOrderMilestone(orderId, status, milestone, download_file);
    res.json({ message: 'Order milestone updated successfully' });
  } catch (error) {
    console.error('❌ Error updating order milestone:', error);
    res.status(500).json({ error: 'Failed to update order milestone' });
  }
});

router.delete('/orders/:id', requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const orderId = req.params.id;
    await storage.deleteOrder(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// User management
router.put('/users/:id', requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, full_name, email, phone, date_of_birth } = req.body;
    
    await storage.updateUser(userId, {
      username,
      full_name,
      email,
      phone,
      date_of_birth
    });
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await storage.deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Captcha sessions management
router.get('/captcha-sessions', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await storage.getAllCaptchaSessions(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting captcha sessions:', error);
    res.status(500).json({ error: 'Failed to get captcha sessions' });
  }
});

// Sessions management
router.get('/sessions', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await storage.getAllSessions(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Website settings management
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await storage.getWebsiteSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error getting website settings:', error);
    res.status(500).json({ error: 'Failed to get website settings' });
  }
});

router.put('/settings/:key', requireAdminRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const key = req.params.key;
    const { value } = req.body;
    
    await storage.updateWebsiteSetting(key, value);
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating website setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Public settings endpoint (for frontend)
router.get('/public-settings', async (req, res) => {
  try {
    const settings = await storage.getPublicSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error getting public settings:', error);
    res.status(500).json({ error: 'Failed to get public settings' });
  }
});

// Get website settings
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await storage.getWebsiteSettings();
    
    console.log('🔧 Fetched settings:', settings);
    
    res.json({
      usdt_address: settings.usdt_address || 'TRC20_USDT_ADDRESS_HERE',
      usdt_qr_code_path: settings.usdt_qr_code_path || '/assets/usdt_qr.png',
      game_price_inr: settings.game_price_inr || '130000',
      usdt_rate_inr: settings.usdt_rate_inr || '89'
    });
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update website settings
router.put('/settings', requireAdmin, qrUpload.single('qr_code'), async (req, res) => {
  try {
    const { usdt_address, game_price_inr, usdt_rate_inr } = req.body;
    
    console.log('🔧 Updating settings:', {
      usdt_address,
      game_price_inr,
      usdt_rate_inr,
      hasQrFile: !!req.file
    });
    
    // Update USDT address
    if (usdt_address) {
      await storage.updateWebsiteSetting('usdt_address', usdt_address);
    }
    
    // Update game price
    if (game_price_inr) {
      await storage.updateWebsiteSetting('game_price_inr', game_price_inr);
    }
    
    // Update USDT rate
    if (usdt_rate_inr) {
      await storage.updateWebsiteSetting('usdt_rate_inr', usdt_rate_inr);
    }
    
    // Update QR code path if file was uploaded
    if (req.file) {
      const qrPath = '/assets/usdt_qr.png';
      await storage.updateWebsiteSetting('usdt_qr_code_path', qrPath);
      console.log('✅ QR code uploaded and path updated:', qrPath);
    }
    
    console.log('✅ Settings updated successfully');
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
