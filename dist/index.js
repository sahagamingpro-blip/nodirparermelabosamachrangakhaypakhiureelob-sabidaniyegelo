var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session2 from "express-session";
import createMemoryStore from "memorystore";

// server/mysql-storage.ts
import { randomUUID, scrypt } from "crypto";
import { promisify } from "util";
import session from "express-session";
import mysql from "mysql2/promise";
import MySQLStore from "express-mysql-session";
var scryptAsync = promisify(scrypt);
var MySQLSessionStore = MySQLStore(session);
var MySQLStorage = class {
  pool;
  sessionStore;
  constructor() {
    this.pool = mysql.createPool({
      host: "103.124.172.12",
      port: 3306,
      user: "sahawebtech_yono_developer",
      password: "sahawebtech_yono_developer",
      database: "sahawebtech_yono_developer",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: "+05:30",
      // IST timezone (UTC+5:30)
      ssl: false
      // Set to true if your cPanel supports SSL
    });
    this.sessionStore = new MySQLSessionStore({
      host: "103.124.172.12",
      port: 3306,
      user: "sahawebtech_yono_developer",
      password: "sahawebtech_yono_developer",
      database: "sahawebtech_yono_developer",
      timezone: "+05:30",
      // IST timezone (UTC+5:30)
      createDatabaseTable: true,
      schema: {
        tableName: "sessions",
        columnNames: {
          session_id: "session_id",
          expires: "expires",
          data: "data"
        }
      }
    });
    this.testConnection();
  }
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.execute("SET time_zone = '+05:30'");
      const [rows] = await connection.execute("SELECT NOW() as current_db_time, @@session.time_zone as timezone");
      const result = rows;
      console.log("\u2705 MySQL connection established successfully");
      connection.release();
    } catch (error) {
      console.error("\u274C MySQL connection failed:", error);
    }
  }
  async getUser(id) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      const users = rows;
      if (users.length === 0) return void 0;
      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || "",
        dateOfBirth: user.date_of_birth || "",
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [username, username]
      );
      const users = rows;
      if (users.length === 0) return void 0;
      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || "",
        dateOfBirth: user.date_of_birth || "",
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  // Check for duplicates before creating user
  async checkDuplicates(username, email, phone) {
    const errors = [];
    try {
      const normalizedPhone = phone.replace(/\D/g, "");
      const phonePattern1 = `+91${normalizedPhone.slice(-10)}`;
      const phonePattern2 = normalizedPhone.slice(-10);
      const phonePattern3 = `91${normalizedPhone.slice(-10)}`;
      const [usernameRows] = await this.pool.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      if (usernameRows.length > 0) {
        errors.push("Username already exists");
      }
      const [emailRows] = await this.pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (emailRows.length > 0) {
        errors.push("Email already exists");
      }
      const [phoneRows] = await this.pool.execute(
        "SELECT id FROM users WHERE phone IN (?, ?, ?)",
        [phonePattern1, phonePattern2, phonePattern3]
      );
      if (phoneRows.length > 0) {
        errors.push("Phone number already exists");
      }
    } catch (error) {
      errors.push("Error validating user data");
    }
    return errors;
  }
  async createUser(insertUser) {
    try {
      const duplicateErrors = await this.checkDuplicates(insertUser.username, insertUser.email, insertUser.phone);
      if (duplicateErrors.length > 0) {
        throw new Error(duplicateErrors.join(", "));
      }
      const hashedPassword = insertUser.password;
      const [result] = await this.pool.execute(
        `INSERT INTO users (username, password, full_name, email, phone, date_of_birth) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          insertUser.username,
          hashedPassword,
          insertUser.fullName,
          insertUser.email,
          insertUser.phone,
          insertUser.dateOfBirth
        ]
      );
      const userId = result.insertId;
      const user = await this.getUser(userId);
      if (user) {
        return user;
      }
      throw new Error("Failed to retrieve created user");
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Username or email already exists");
      }
      throw new Error("Failed to create user");
    }
  }
  // Captcha methods
  async createCaptchaSession(captchaCode) {
    try {
      const id = randomUUID();
      const now = /* @__PURE__ */ new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1e3);
      await this.pool.execute(
        "INSERT INTO captcha_sessions (id, captcha_code, expires_at) VALUES (?, ?, ?)",
        [id, captchaCode, expiresAt]
      );
      return id;
    } catch (error) {
      console.error("Error creating captcha session:", error);
      throw new Error("Failed to create captcha session");
    }
  }
  async verifyCaptcha(sessionId, userCode) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT captcha_code FROM captcha_sessions WHERE id = ? AND expires_at > NOW() AND used = FALSE",
        [sessionId]
      );
      const sessions = rows;
      if (sessions.length === 0) return false;
      const isValid = sessions[0].captcha_code === userCode;
      if (isValid) {
        await this.pool.execute(
          "UPDATE captcha_sessions SET used = TRUE WHERE id = ?",
          [sessionId]
        );
      }
      return isValid;
    } catch (error) {
      console.error("Error verifying captcha:", error);
      return false;
    }
  }
  // Order management methods
  async createOrder(orderData) {
    try {
      const orderId = randomUUID();
      const now = /* @__PURE__ */ new Date();
      const nullIfUndefined = (value) => value === void 0 ? null : value;
      await this.pool.execute(
        `INSERT INTO orders (
          id, user_id, name, email, phone, company, country,
          game_type, target_platform, budget, timeline,
          game_name, game_logo, game_support_email, telegram_id, whatsapp_number,
          additional_requirements, status, amount, usdt_amount,
          transaction_id, transaction_screenshot, terms_accepted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderData.userId,
          nullIfUndefined(orderData.name),
          nullIfUndefined(orderData.email),
          nullIfUndefined(orderData.phone),
          nullIfUndefined(orderData.company),
          nullIfUndefined(orderData.country),
          nullIfUndefined(orderData.gameType),
          nullIfUndefined(orderData.targetPlatform),
          nullIfUndefined(orderData.budget),
          nullIfUndefined(orderData.timeline),
          nullIfUndefined(orderData.gameName),
          nullIfUndefined(orderData.gameLogo),
          nullIfUndefined(orderData.gameSupportEmail),
          nullIfUndefined(orderData.telegramId),
          nullIfUndefined(orderData.whatsappNumber),
          nullIfUndefined(orderData.additionalRequirements),
          "pending",
          nullIfUndefined(orderData.amount),
          nullIfUndefined(orderData.usdtAmount),
          nullIfUndefined(orderData.transactionId),
          nullIfUndefined(orderData.transactionScreenshot),
          nullIfUndefined(orderData.termsAccepted)
        ]
      );
      console.log(`\u2705 Order created successfully in IST: ${orderId} at ${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
      return orderId;
    } catch (error) {
      console.error("\u274C Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }
  async getUserOrders(userId) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      return rows;
    } catch (error) {
      console.error("Error getting user orders:", error);
      return [];
    }
  }
  async updateOrderMilestone(orderId, status, milestone, downloadFile) {
    try {
      let query = "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP";
      let params = [status];
      if (milestone) {
        query += ", milestone = ?";
        params.push(milestone);
      }
      if (downloadFile !== void 0) {
        query += ", download_file = ?";
        params.push(downloadFile || null);
      }
      query += " WHERE id = ?";
      params.push(orderId);
      console.log("\u{1F527} Updating order with query:", query);
      console.log("\u{1F527} Parameters:", params);
      console.log("\u{1F527} Download file value:", downloadFile);
      await this.pool.execute(query, params);
      console.log("\u2705 Order updated successfully");
    } catch (error) {
      console.error("\u274C Error updating order milestone:", error);
      throw new Error("Failed to update order milestone");
    }
  }
  // Cleanup method for expired captcha sessions
  async cleanupExpiredCaptcha() {
    try {
      await this.pool.execute(
        "DELETE FROM captcha_sessions WHERE expires_at < NOW() OR used = TRUE"
      );
    } catch (error) {
      console.error("Error cleaning up expired captcha:", error);
    }
  }
  // Admin management methods
  async getAdminById(id) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT id, username, full_name, email, role, is_active, last_login, created_at FROM admin_users WHERE id = ? AND is_active = TRUE",
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error getting admin by ID:", error);
      throw new Error("Failed to get admin");
    }
  }
  async getAdminByUsername(username) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT id, username, password, full_name, email, role, is_active, last_login FROM admin_users WHERE username = ?",
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error getting admin by username:", error);
      throw new Error("Failed to get admin");
    }
  }
  async updateAdminLastLogin(id) {
    try {
      await this.pool.execute(
        "UPDATE admin_users SET last_login = NOW() WHERE id = ?",
        [id]
      );
    } catch (error) {
      console.error("Error updating admin last login:", error);
    }
  }
  async getAllUsers(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [countResult] = await this.pool.execute("SELECT COUNT(*) as total FROM users");
      const total = countResult[0].total;
      const [rows] = await this.pool.execute(
        "SELECT id, username, full_name, email, phone, date_of_birth, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );
      return { users: rows, total };
    } catch (error) {
      console.error("Error getting all users:", error);
      throw new Error("Failed to get users");
    }
  }
  async getAllOrders(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [countResult] = await this.pool.execute("SELECT COUNT(*) as total FROM orders");
      const total = countResult[0].total;
      const [rows] = await this.pool.execute(
        `SELECT o.*, u.username, u.full_name as user_full_name 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return { orders: rows, total };
    } catch (error) {
      console.error("Error getting all orders:", error);
      throw new Error("Failed to get orders");
    }
  }
  async getAllCaptchaSessions(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [countResult] = await this.pool.execute("SELECT COUNT(*) as total FROM captcha_sessions");
      const total = countResult[0].total;
      const [rows] = await this.pool.execute(
        "SELECT id, captcha_code, used, expires_at, created_at FROM captcha_sessions ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );
      return { sessions: rows, total };
    } catch (error) {
      console.error("Error getting captcha sessions:", error);
      throw new Error("Failed to get captcha sessions");
    }
  }
  async getAllSessions(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const [countResult] = await this.pool.execute("SELECT COUNT(*) as total FROM sessions");
      const total = countResult[0].total;
      const [rows] = await this.pool.execute(
        "SELECT session_id, expires, LEFT(data, 100) as data_preview, FROM_UNIXTIME(expires) as expires_date FROM sessions ORDER BY expires DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );
      return { sessions: rows, total };
    } catch (error) {
      console.error("Error getting sessions:", error);
      throw new Error("Failed to get sessions");
    }
  }
  // Website settings methods
  async getWebsiteSettings() {
    try {
      const [rows] = await this.pool.execute(
        "SELECT setting_key, setting_value, setting_type, description, category, is_public FROM website_settings ORDER BY category, setting_key"
      );
      return rows;
    } catch (error) {
      console.error("Error getting website settings:", error);
      throw new Error("Failed to get website settings");
    }
  }
  async getPublicSettings() {
    try {
      const [rows] = await this.pool.execute(
        "SELECT setting_key, setting_value, setting_type FROM website_settings WHERE is_public = TRUE"
      );
      return rows;
    } catch (error) {
      console.error("Error getting public settings:", error);
      throw new Error("Failed to get public settings");
    }
  }
  async updateWebsiteSetting(key, value) {
    try {
      await this.pool.execute(
        "UPDATE website_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?",
        [value, key]
      );
    } catch (error) {
      console.error("Error updating website setting:", error);
      throw new Error("Failed to update website setting");
    }
  }
  async updateUser(id, userData) {
    try {
      const { username, full_name, email, phone, date_of_birth } = userData;
      await this.pool.execute(
        "UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, date_of_birth = ?, updated_at = NOW() WHERE id = ?",
        [username, full_name, email, phone, date_of_birth, id]
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }
  async deleteUser(id) {
    try {
      await this.pool.execute("DELETE FROM users WHERE id = ?", [id]);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }
  async deleteOrder(id) {
    try {
      await this.pool.execute("DELETE FROM orders WHERE id = ?", [id]);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error("Failed to delete order");
    }
  }
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [usersResult] = await this.pool.execute("SELECT COUNT(*) as total FROM users");
      const totalUsers = usersResult[0].total;
      const [ordersResult] = await this.pool.execute("SELECT COUNT(*) as total FROM orders");
      const totalOrders = ordersResult[0].total;
      const [pendingResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders WHERE status = "pending"');
      const pendingOrders = pendingResult[0].total;
      const [completedResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders WHERE status = "completed"');
      const completedOrders = completedResult[0].total;
      const [revenueResult] = await this.pool.execute('SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = "completed"');
      const totalRevenue = revenueResult[0].total;
      return {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: parseInt(totalRevenue) || 0
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      throw new Error("Failed to get dashboard stats");
    }
  }
  // Website settings methods
  async getWebsiteSettings() {
    try {
      const [rows] = await this.pool.execute(
        "SELECT setting_key, setting_value FROM website_settings WHERE is_public = TRUE"
      );
      const settings = {};
      rows.forEach((row) => {
        settings[row.setting_key] = row.setting_value;
      });
      console.log("\u{1F527} Fetched website settings:", settings);
      return settings;
    } catch (error) {
      console.error("\u274C Error getting website settings:", error);
      return {
        usdt_address: "TRC20_USDT_ADDRESS_HERE",
        usdt_qr_code_path: "/assets/usdt_qr.png",
        game_price_inr: "130000",
        usdt_rate_inr: "89"
      };
    }
  }
  async updateWebsiteSetting(key, value) {
    try {
      await this.pool.execute(
        `INSERT INTO website_settings (setting_key, setting_value, is_public) 
         VALUES (?, ?, TRUE) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [key, value]
      );
      console.log(`\u2705 Updated setting: ${key} = ${value}`);
    } catch (error) {
      console.error(`\u274C Error updating setting ${key}:`, error);
      throw new Error(`Failed to update setting: ${key}`);
    }
  }
  async getPublicSettings() {
    try {
      const [rows] = await this.pool.execute(
        "SELECT setting_key, setting_value FROM website_settings WHERE is_public = TRUE"
      );
      const settings = {};
      rows.forEach((row) => {
        settings[row.setting_key] = row.setting_value;
      });
      return settings;
    } catch (error) {
      console.error("\u274C Error getting public settings:", error);
      return {
        usdt_address: "TRC20_USDT_ADDRESS_HERE",
        usdt_qr_code_path: "/assets/usdt_qr.png",
        game_price_inr: "130000",
        usdt_rate_inr: "89"
      };
    }
  }
};

// server/storage.ts
var MemoryStore = createMemoryStore(session2);
var storage = process.env.NODE_ENV === "production" ? new MySQLStorage() : new MySQLStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session3 from "express-session";
import { scrypt as scrypt2, randomBytes as randomBytes2, timingSafeEqual } from "crypto";
import { promisify as promisify2 } from "util";
var scryptAsync2 = promisify2(scrypt2);
async function hashPassword(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    if (!stored.includes(".")) {
      return false;
    }
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      return false;
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync2(supplied, salt, 64);
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "fallback-secret-for-development",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session3(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Username not found" });
        }
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    if (user.role) {
      done(null, { id: user.id, type: "admin" });
    } else {
      done(null, { id: user.id, type: "user" });
    }
  });
  passport.deserializeUser(async (obj, done) => {
    try {
      if (typeof obj === "number") {
        const user = await storage.getUser(obj);
        done(null, user);
      } else if (obj.type === "admin") {
        const admin = await storage.getAdminById(obj.id);
        done(null, admin);
      } else if (obj.type === "user") {
        const user = await storage.getUser(obj.id);
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      res.status(400).send(error.message || "Registration failed");
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/captcha.ts
import { randomInt } from "crypto";
function generateSVGCaptcha(code) {
  const width = 160;
  const height = 40;
  const colors = ["#2563eb", "#dc2626", "#059669", "#7c3aed", "#ea580c"];
  const bgColor = "#f3f4f6";
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="100%" height="100%" fill="${bgColor}"/>`;
  for (let i = 0; i < 3; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.3"/>`;
  }
  for (let i = 0; i < code.length; i++) {
    const x = 15 + i * 22;
    const y = 25;
    const rotation = (Math.random() - 0.5) * 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    svg += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${color}" transform="rotate(${rotation} ${x} ${y})">${code[i]}</text>`;
  }
  svg += "</svg>";
  return svg;
}
function generateCaptcha() {
  const code = Math.floor(1e5 + Math.random() * 9e5).toString();
  try {
    const { createCanvas } = __require("canvas");
    const width = 160;
    const height = 40;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${randomInt(360)}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(randomInt(width), randomInt(height));
      ctx.lineTo(randomInt(width), randomInt(height));
      ctx.stroke();
    }
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${randomInt(360)}, 50%, 60%)`;
      ctx.beginPath();
      ctx.arc(randomInt(width), randomInt(height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < code.length; i++) {
      const x = 20 + i * 25;
      const y = height / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillStyle = `hsl(${randomInt(360)}, 70%, 30%)`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
    const buffer = canvas.toBuffer("image/png");
    return {
      code,
      image: buffer
    };
  } catch (error) {
    console.warn("Canvas not available, using SVG fallback:", error.message);
    const svgString = generateSVGCaptcha(code);
    const buffer = Buffer.from(svgString, "utf-8");
    return {
      code,
      image: buffer
    };
  }
}

// server/admin-routes.ts
import express from "express";
import passport3 from "passport";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// server/admin-auth.ts
import passport2 from "passport";
import { Strategy as LocalStrategy2 } from "passport-local";
import { createHash } from "crypto";
function hashPassword2(password) {
  return createHash("md5").update(password).digest("hex");
}
function comparePasswords2(password, hash) {
  try {
    const passwordHash = createHash("md5").update(password).digest("hex");
    return passwordHash === hash;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}
passport2.use("admin-local", new LocalStrategy2(
  {
    usernameField: "username",
    passwordField: "password"
  },
  async (username, password, done) => {
    try {
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return done(null, false, { message: "Admin not found" });
      }
      if (!admin.is_active) {
        return done(null, false, { message: "Admin account is disabled" });
      }
      const isValidPassword = comparePasswords2(password, admin.password);
      if (!isValidPassword) {
        return done(null, false, { message: "Invalid password" });
      }
      await storage.updateAdminLastLogin(admin.id);
      return done(null, admin);
    } catch (error) {
      console.error("Admin authentication error:", error);
      return done(error);
    }
  }
));
function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role) {
    return next();
  }
  return res.status(401).json({ error: "Admin authentication required" });
}
function requireAdminRole(roles) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: "Insufficient admin privileges" });
  };
}

// server/admin-routes.ts
var router = express.Router();
var qrUploadDir = path.join(process.cwd(), "client/public/assets");
var ensureQrUploadDir = async () => {
  try {
    await fs.access(qrUploadDir);
  } catch {
    await fs.mkdir(qrUploadDir, { recursive: true });
  }
};
var qrStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureQrUploadDir();
    cb(null, qrUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, "usdt_qr.png");
  }
});
var qrUpload = multer({
  storage: qrStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
router.post("/hash-password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const hashedPassword = hashPassword2(password);
    res.json({
      password,
      hashedPassword,
      instructions: [
        "1. Copy the hashedPassword value below",
        "2. Go to phpMyAdmin \u2192 admin_users table",
        "3. Edit the admin user row",
        "4. Replace the password field with the hashedPassword",
        "5. Save the changes"
      ],
      sqlQuery: `UPDATE admin_users SET password = '${hashedPassword}' WHERE username = 'admin';`
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({
      error: "Failed to hash password",
      details: error.message
    });
  }
});
router.post("/reset-admin", async (req, res) => {
  try {
    const hashedPassword = hashPassword2("admin123");
    const updateResult = await storage.pool.execute(
      `UPDATE admin_users SET password = ?, updated_at = NOW() WHERE username = 'admin'`,
      [hashedPassword]
    );
    if (updateResult[0].affectedRows === 0) {
      await storage.pool.execute(
        `INSERT INTO admin_users (username, password, full_name, email, role, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        ["admin", hashedPassword, "System Administrator", "admin@a2z.dog", "super_admin", true]
      );
    }
    res.json({
      message: "Admin user password reset successfully!",
      username: "admin",
      password: "admin123",
      email: "admin@a2z.dog",
      role: "super_admin",
      loginUrl: "/admin-rs",
      note: "Password has been set to admin123"
    });
  } catch (error) {
    console.error("Error resetting admin user:", error);
    res.status(500).json({
      error: "Failed to reset admin user",
      details: error.message
    });
  }
});
router.post("/init", async (req, res) => {
  try {
    const existingAdmin = await storage.getAdminByUsername("admin");
    if (existingAdmin) {
      return res.json({
        message: "Admin user already exists",
        username: "admin",
        note: "Use /api/admin/reset-admin to reset password to admin123"
      });
    }
    const hashedPassword = hashPassword2("admin123");
    await storage.pool.execute(
      `INSERT INTO admin_users (username, password, full_name, email, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["admin", hashedPassword, "System Administrator", "admin@a2z.dog", "super_admin", true]
    );
    res.json({
      message: "Admin user created successfully!",
      username: "admin",
      password: "admin123",
      email: "admin@a2z.dog",
      role: "super_admin",
      loginUrl: "/admin-rs"
    });
  } catch (error) {
    console.error("Error initializing admin user:", error);
    res.status(500).json({
      error: "Failed to initialize admin user",
      details: error.message
    });
  }
});
router.post("/login", (req, res, next) => {
  passport3.authenticate("admin-local", (err, admin, info) => {
    if (err) {
      return res.status(500).json({ error: "Authentication error" });
    }
    if (!admin) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }
    req.logIn(admin, (err2) => {
      if (err2) {
        return res.status(500).json({ error: "Login error" });
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
router.post("/logout", requireAdmin, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout error" });
    }
    res.json({ message: "Logged out successfully" });
  });
});
router.get("/user", requireAdmin, (req, res) => {
  const admin = req.user;
  res.json({
    id: admin.id,
    username: admin.username,
    fullName: admin.full_name,
    email: admin.email,
    role: admin.role,
    lastLogin: admin.last_login
  });
});
router.get("/dashboard/stats", requireAdmin, async (req, res) => {
  try {
    const [usersResult] = await storage.pool.execute("SELECT COUNT(*) as count FROM users");
    const [ordersResult] = await storage.pool.execute("SELECT COUNT(*) as count FROM orders");
    const [pendingOrdersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const [completedOrdersResult] = await storage.pool.execute('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
    const [revenueResult] = await storage.pool.execute('SELECT SUM(amount) as total FROM orders WHERE status = "completed"');
    res.json({
      totalUsers: usersResult[0].count,
      totalOrders: ordersResult[0].count,
      pendingOrders: pendingOrdersResult[0].count,
      completedOrders: completedOrdersResult[0].count,
      totalRevenue: revenueResult[0].total || 0
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await storage.getAllUsers(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});
router.delete("/users/:id", requireAdminRole(["super_admin", "admin"]), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await storage.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await storage.getAllOrders(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});
router.put("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    await storage.pool.execute(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, orderId]
    );
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});
router.put("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    await storage.updateOrderMilestone(orderId, status, null);
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});
router.put("/orders/:id/milestone", requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, milestone, download_file } = req.body;
    console.log("\u{1F527} Admin updating order:", orderId);
    console.log("\u{1F527} Request body:", req.body);
    console.log("\u{1F527} Status:", status);
    console.log("\u{1F527} Milestone:", milestone);
    console.log("\u{1F527} Download file:", download_file);
    await storage.updateOrderMilestone(orderId, status, milestone, download_file);
    res.json({ message: "Order milestone updated successfully" });
  } catch (error) {
    console.error("\u274C Error updating order milestone:", error);
    res.status(500).json({ error: "Failed to update order milestone" });
  }
});
router.delete("/orders/:id", requireAdminRole(["super_admin", "admin"]), async (req, res) => {
  try {
    const orderId = req.params.id;
    await storage.deleteOrder(orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});
router.put("/users/:id", requireAdminRole(["super_admin", "admin"]), async (req, res) => {
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
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
router.delete("/users/:id", requireAdminRole(["super_admin", "admin"]), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await storage.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
router.get("/captcha-sessions", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await storage.getAllCaptchaSessions(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error getting captcha sessions:", error);
    res.status(500).json({ error: "Failed to get captcha sessions" });
  }
});
router.get("/sessions", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await storage.getAllSessions(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error getting sessions:", error);
    res.status(500).json({ error: "Failed to get sessions" });
  }
});
router.get("/settings", requireAdmin, async (req, res) => {
  try {
    const settings = await storage.getWebsiteSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error getting website settings:", error);
    res.status(500).json({ error: "Failed to get website settings" });
  }
});
router.put("/settings/:key", requireAdminRole(["super_admin", "admin"]), async (req, res) => {
  try {
    const key = req.params.key;
    const { value } = req.body;
    await storage.updateWebsiteSetting(key, value);
    res.json({ message: "Setting updated successfully" });
  } catch (error) {
    console.error("Error updating website setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});
router.get("/public-settings", async (req, res) => {
  try {
    const settings = await storage.getPublicSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error getting public settings:", error);
    res.status(500).json({ error: "Failed to get public settings" });
  }
});
router.get("/settings", requireAdmin, async (req, res) => {
  try {
    const settings = await storage.getWebsiteSettings();
    console.log("\u{1F527} Fetched settings:", settings);
    res.json({
      usdt_address: settings.usdt_address || "TRC20_USDT_ADDRESS_HERE",
      usdt_qr_code_path: settings.usdt_qr_code_path || "/assets/usdt_qr.png",
      game_price_inr: settings.game_price_inr || "130000",
      usdt_rate_inr: settings.usdt_rate_inr || "89"
    });
  } catch (error) {
    console.error("\u274C Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});
router.put("/settings", requireAdmin, qrUpload.single("qr_code"), async (req, res) => {
  try {
    const { usdt_address, game_price_inr, usdt_rate_inr } = req.body;
    console.log("\u{1F527} Updating settings:", {
      usdt_address,
      game_price_inr,
      usdt_rate_inr,
      hasQrFile: !!req.file
    });
    if (usdt_address) {
      await storage.updateWebsiteSetting("usdt_address", usdt_address);
    }
    if (game_price_inr) {
      await storage.updateWebsiteSetting("game_price_inr", game_price_inr);
    }
    if (usdt_rate_inr) {
      await storage.updateWebsiteSetting("usdt_rate_inr", usdt_rate_inr);
    }
    if (req.file) {
      const qrPath = "/assets/usdt_qr.png";
      await storage.updateWebsiteSetting("usdt_qr_code_path", qrPath);
      console.log("\u2705 QR code uploaded and path updated:", qrPath);
    }
    console.log("\u2705 Settings updated successfully");
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("\u274C Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});
var admin_routes_default = router;

// server/routes.ts
import multer2 from "multer";
import path2 from "path";
import { randomUUID as randomUUID2 } from "crypto";
import fs2 from "fs/promises";
var uploadDir = path2.join(process.cwd(), "client/public/assets/game_logo_pay_proof");
var ensureUploadDir = async () => {
  try {
    await fs2.access(uploadDir);
  } catch {
    await fs2.mkdir(uploadDir, { recursive: true });
  }
};
var storage_multer = multer2.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID2()}-${Date.now()}${path2.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
var upload = multer2({
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path2.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (JPEG, JPG, PNG, GIF)"));
    }
  }
});
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.use("/api/admin", admin_routes_default);
  app2.get("/api/test-captcha", async (req, res) => {
    try {
      console.log("Testing captcha generation...");
      const captcha = generateCaptcha();
      console.log("Captcha generated:", { code: captcha.code, imageSize: captcha.image.length });
      const isSVG = captcha.image.toString("utf-8").startsWith("<svg");
      console.log("Is SVG:", isSVG);
      res.json({
        success: true,
        code: captcha.code,
        // Only for testing - remove in production
        imageSize: captcha.image.length,
        isSVG,
        preview: isSVG ? captcha.image.toString("utf-8").substring(0, 100) + "..." : "PNG binary data"
      });
    } catch (error) {
      console.error("Test captcha error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/captcha", async (req, res) => {
    try {
      const captcha = generateCaptcha();
      const isSVG = captcha.image.toString("utf-8").startsWith("<svg");
      const mimeType = isSVG ? "image/svg+xml" : "image/png";
      let imageDataUrl;
      if (isSVG) {
        const base64Data = captcha.image.toString("base64");
        imageDataUrl = `data:image/svg+xml;base64,${base64Data}`;
      } else {
        const base64Data = captcha.image.toString("base64");
        imageDataUrl = `data:image/png;base64,${base64Data}`;
      }
      if ("createCaptchaSession" in storage) {
        const sessionId = await storage.createCaptchaSession(captcha.code);
        res.json({
          sessionId,
          image: imageDataUrl
        });
      } else {
        req.session.captchaCode = captcha.code;
        res.json({
          sessionId: "session",
          image: imageDataUrl
        });
      }
    } catch (error) {
      console.error("Error generating captcha:", error);
      res.status(500).json({ error: "Failed to generate captcha" });
    }
  });
  app2.post("/api/verify-captcha", async (req, res) => {
    try {
      const { sessionId, code } = req.body;
      if (!sessionId || !code) {
        return res.status(400).json({ error: "Session ID and code are required" });
      }
      let isValid = false;
      if ("verifyCaptcha" in storage) {
        isValid = await storage.verifyCaptcha(sessionId, code);
      } else {
        isValid = req.session.captchaCode === code;
        if (isValid) {
          delete req.session.captchaCode;
        }
      }
      res.json({ valid: isValid });
    } catch (error) {
      console.error("Error verifying captcha:", error);
      res.status(500).json({ error: "Failed to verify captcha" });
    }
  });
  app2.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const relativePath = `/assets/game_logo_pay_proof/${req.file.filename}`;
    res.json({
      filename: req.file.filename,
      path: relativePath,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
  app2.post("/api/orders", upload.fields([
    { name: "gameLogo", maxCount: 1 },
    { name: "transactionScreenshot", maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const files = req.files;
      const orderData = JSON.parse(req.body.orderData || "{}");
      if (files.gameLogo && files.gameLogo[0]) {
        orderData.gameLogo = `/assets/game_logo_pay_proof/${files.gameLogo[0].filename}`;
      }
      if (files.transactionScreenshot && files.transactionScreenshot[0]) {
        orderData.transactionScreenshot = `/assets/game_logo_pay_proof/${files.transactionScreenshot[0].filename}`;
      }
      const completeOrderData = {
        userId: req.user.id,
        ...orderData
      };
      if ("createOrder" in storage) {
        const orderId = await storage.createOrder(completeOrderData);
        res.status(201).json({ orderId, message: "Order created successfully" });
      } else {
        console.log("Order submitted:", completeOrderData);
        res.status(201).json({ message: "Order submitted successfully" });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      if ("getUserOrders" in storage) {
        const orders = await storage.getUserOrders(req.user.id);
        res.json(orders);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });
  app2.put("/api/orders/:orderId/milestone", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const isAdmin = req.user.username === "admin" || req.user.id === 1;
      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      const { orderId } = req.params;
      const { status, milestone } = req.body;
      if ("updateOrderMilestone" in storage) {
        await storage.updateOrderMilestone(orderId, status, milestone);
        res.json({ message: "Order milestone updated successfully" });
      } else {
        res.status(501).json({ error: "Milestone updates not supported" });
      }
    } catch (error) {
      console.error("Error updating order milestone:", error);
      res.status(500).json({ error: "Failed to update order milestone" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
