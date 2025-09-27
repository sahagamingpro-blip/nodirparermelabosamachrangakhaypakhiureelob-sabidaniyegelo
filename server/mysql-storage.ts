import { type User, type InsertUser } from "@shared/schema";
import { randomUUID, scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import session from "express-session";
import mysql from "mysql2/promise";
import MySQLStore from "express-mysql-session";
import { IStorage } from "./storage";

const scryptAsync = promisify(scrypt);

const MySQLSessionStore = MySQLStore(session);

export class MySQLStorage implements IStorage {
  private pool: mysql.Pool;
  sessionStore: session.Store & { destroy?: (sid: string, callback?: (err?: any) => void) => void };

  constructor() {
    // Create MySQL connection pool with your cPanel credentials
    this.pool = mysql.createPool({
      host: '103.124.172.12',
      port: 3306,
      user: 'sahawebtech_yono_developer',
      password: 'sahawebtech_yono_developer',
      database: 'sahawebtech_yono_developer',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+05:30', // IST timezone (UTC+5:30)
      ssl: false // Set to true if your cPanel supports SSL
    });

    // Create MySQL session store
    this.sessionStore = new MySQLSessionStore({
      host: '103.124.172.12',
      port: 3306,
      user: 'sahawebtech_yono_developer',
      password: 'sahawebtech_yono_developer',
      database: 'sahawebtech_yono_developer',
      timezone: '+05:30', // IST timezone (UTC+5:30)
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    });

    // Test connection and initialize
    this.testConnection();
  }

  private async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      
      // Set timezone to IST for this connection
      await connection.execute("SET time_zone = '+05:30'");
      
      // Test timezone setting
      const [rows] = await connection.execute('SELECT NOW() as current_db_time, @@session.time_zone as timezone');
      const result = rows as any[];
      
          console.log('✅ MySQL connection established successfully');
      
      connection.release();
    } catch (error) {
      console.error('❌ MySQL connection failed:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      const users = rows as any[];
      if (users.length === 0) return undefined;
      
      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.date_of_birth || '',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
      );
      
      const users = rows as any[];
      if (users.length === 0) return undefined;
      
      const user = users[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.date_of_birth || '',
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  // Check for duplicates before creating user
  async checkDuplicates(username: string, email: string, phone: string): Promise<string[]> {
    const errors: string[] = [];
    
    try {
      // Normalize phone number for checking
      const normalizedPhone = phone.replace(/\D/g, '');
      const phonePattern1 = `+91${normalizedPhone.slice(-10)}`; // +91xxxxxxxxxx
      const phonePattern2 = normalizedPhone.slice(-10); // xxxxxxxxxx
      const phonePattern3 = `91${normalizedPhone.slice(-10)}`; // 91xxxxxxxxxx
      
      // Check username
      const [usernameRows] = await this.pool.execute(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      if ((usernameRows as any[]).length > 0) {
        errors.push('Username already exists');
      }
      
      // Check email
      const [emailRows] = await this.pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if ((emailRows as any[]).length > 0) {
        errors.push('Email already exists');
      }
      
      // Check phone (multiple formats)
      const [phoneRows] = await this.pool.execute(
        'SELECT id FROM users WHERE phone IN (?, ?, ?)',
        [phonePattern1, phonePattern2, phonePattern3]
      );
      if ((phoneRows as any[]).length > 0) {
        errors.push('Phone number already exists');
      }
      
    } catch (error) {
      errors.push('Error validating user data');
    }
    
    return errors;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Check for duplicates first
      const duplicateErrors = await this.checkDuplicates(insertUser.username, insertUser.email, insertUser.phone);
      if (duplicateErrors.length > 0) {
        throw new Error(duplicateErrors.join(', '));
      }
      
      // Password is already hashed by auth.ts, so use it directly
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
      ) as any;

      const userId = result.insertId;
      
      const user = await this.getUser(userId);
      if (user) {
        return user;
      }
      throw new Error('Failed to retrieve created user');
    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new Error('Username or email already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  // Captcha methods
  async createCaptchaSession(captchaCode: string): Promise<string> {
    try {
      const id = randomUUID();
      // Create expiry time in IST (10 minutes from now)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
      
      
      await this.pool.execute(
        'INSERT INTO captcha_sessions (id, captcha_code, expires_at) VALUES (?, ?, ?)',
        [id, captchaCode, expiresAt]
      );

      return id;
    } catch (error) {
      console.error('Error creating captcha session:', error);
      throw new Error('Failed to create captcha session');
    }
  }

  async verifyCaptcha(sessionId: string, userCode: string): Promise<boolean> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT captcha_code FROM captcha_sessions WHERE id = ? AND expires_at > NOW() AND used = FALSE',
        [sessionId]
      );

      const sessions = rows as any[];
      if (sessions.length === 0) return false;

      const isValid = sessions[0].captcha_code === userCode;

      if (isValid) {
        // Mark captcha as used
        await this.pool.execute(
          'UPDATE captcha_sessions SET used = TRUE WHERE id = ?',
          [sessionId]
        );
      }

      return isValid;
    } catch (error) {
      console.error('Error verifying captcha:', error);
      return false;
    }
  }

  // Order management methods
  async createOrder(orderData: any): Promise<string> {
    try {
      const orderId = randomUUID();
      const now = new Date();
      
      // Helper function to convert undefined to null
      const nullIfUndefined = (value: any) => value === undefined ? null : value;
      
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
          'pending',
          nullIfUndefined(orderData.amount),
          nullIfUndefined(orderData.usdtAmount),
          nullIfUndefined(orderData.transactionId),
          nullIfUndefined(orderData.transactionScreenshot),
          nullIfUndefined(orderData.termsAccepted)
        ]
      );

      console.log(`✅ Order created successfully in IST: ${orderId} at ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
      return orderId;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      return rows as any[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  async updateOrderMilestone(orderId: string, status: string, milestone?: string, downloadFile?: string): Promise<void> {
    try {
      let query = 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP';
      let params: any[] = [status];

      if (milestone) {
        query += ', milestone = ?';
        params.push(milestone);
      }

      if (downloadFile !== undefined) {
        query += ', download_file = ?';
        params.push(downloadFile || null);
      }

      query += ' WHERE id = ?';
      params.push(orderId);

      console.log('🔧 Updating order with query:', query);
      console.log('🔧 Parameters:', params);
      console.log('🔧 Download file value:', downloadFile);

      await this.pool.execute(query, params);
      
      console.log('✅ Order updated successfully');
    } catch (error) {
      console.error('❌ Error updating order milestone:', error);
      throw new Error('Failed to update order milestone');
    }
  }

  // Cleanup method for expired captcha sessions
  async cleanupExpiredCaptcha(): Promise<void> {
    try {
      await this.pool.execute(
        'DELETE FROM captcha_sessions WHERE expires_at < NOW() OR used = TRUE'
      );
    } catch (error) {
      console.error('Error cleaning up expired captcha:', error);
    }
  }

  // Admin management methods
  async getAdminById(id: number): Promise<any> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT id, username, full_name, email, role, is_active, last_login, created_at FROM admin_users WHERE id = ? AND is_active = TRUE',
        [id]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Error getting admin by ID:', error);
      throw new Error('Failed to get admin');
    }
  }

  async getAdminByUsername(username: string): Promise<any> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT id, username, password, full_name, email, role, is_active, last_login FROM admin_users WHERE username = ?',
        [username]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Error getting admin by username:', error);
      throw new Error('Failed to get admin');
    }
  }

  async updateAdminLastLogin(id: number): Promise<void> {
    try {
      await this.pool.execute(
        'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error updating admin last login:', error);
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: any[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await this.pool.execute('SELECT COUNT(*) as total FROM users');
      const total = (countResult as any[])[0].total;
      
      // Get users with pagination
      const [rows] = await this.pool.execute(
        'SELECT id, username, full_name, email, phone, date_of_birth, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return { users: rows as any[], total };
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10): Promise<{ orders: any[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders');
      const total = (countResult as any[])[0].total;
      
      // Get orders with pagination
      const [rows] = await this.pool.execute(
        `SELECT o.*, u.username, u.full_name as user_full_name 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      return { orders: rows as any[], total };
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw new Error('Failed to get orders');
    }
  }

  async getAllCaptchaSessions(page: number = 1, limit: number = 10): Promise<{ sessions: any[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await this.pool.execute('SELECT COUNT(*) as total FROM captcha_sessions');
      const total = (countResult as any[])[0].total;
      
      // Get captcha sessions with pagination
      const [rows] = await this.pool.execute(
        'SELECT id, captcha_code, used, expires_at, created_at FROM captcha_sessions ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return { sessions: rows as any[], total };
    } catch (error) {
      console.error('Error getting captcha sessions:', error);
      throw new Error('Failed to get captcha sessions');
    }
  }

  async getAllSessions(page: number = 1, limit: number = 10): Promise<{ sessions: any[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const [countResult] = await this.pool.execute('SELECT COUNT(*) as total FROM sessions');
      const total = (countResult as any[])[0].total;
      
      // Get sessions with pagination
      const [rows] = await this.pool.execute(
        'SELECT session_id, expires, LEFT(data, 100) as data_preview, FROM_UNIXTIME(expires) as expires_date FROM sessions ORDER BY expires DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return { sessions: rows as any[], total };
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw new Error('Failed to get sessions');
    }
  }

  // Website settings methods
  async getWebsiteSettings(): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT setting_key, setting_value, setting_type, description, category, is_public FROM website_settings ORDER BY category, setting_key'
      );
      return rows as any[];
    } catch (error) {
      console.error('Error getting website settings:', error);
      throw new Error('Failed to get website settings');
    }
  }

  async getPublicSettings(): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT setting_key, setting_value, setting_type FROM website_settings WHERE is_public = TRUE'
      );
      return rows as any[];
    } catch (error) {
      console.error('Error getting public settings:', error);
      throw new Error('Failed to get public settings');
    }
  }

  async updateWebsiteSetting(key: string, value: string): Promise<void> {
    try {
      await this.pool.execute(
        'UPDATE website_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [value, key]
      );
    } catch (error) {
      console.error('Error updating website setting:', error);
      throw new Error('Failed to update website setting');
    }
  }

  async updateUser(id: number, userData: any): Promise<void> {
    try {
      const { username, full_name, email, phone, date_of_birth } = userData;
      
      await this.pool.execute(
        'UPDATE users SET username = ?, full_name = ?, email = ?, phone = ?, date_of_birth = ?, updated_at = NOW() WHERE id = ?',
        [username, full_name, email, phone, date_of_birth, id]
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.pool.execute('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await this.pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<any> {
    try {
      // Get total users
      const [usersResult] = await this.pool.execute('SELECT COUNT(*) as total FROM users');
      const totalUsers = (usersResult as any[])[0].total;

      // Get total orders
      const [ordersResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders');
      const totalOrders = (ordersResult as any[])[0].total;

      // Get pending orders
      const [pendingResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders WHERE status = "pending"');
      const pendingOrders = (pendingResult as any[])[0].total;

      // Get completed orders
      const [completedResult] = await this.pool.execute('SELECT COUNT(*) as total FROM orders WHERE status = "completed"');
      const completedOrders = (completedResult as any[])[0].total;

      // Get total revenue from completed orders
      const [revenueResult] = await this.pool.execute('SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = "completed"');
      const totalRevenue = (revenueResult as any[])[0].total;

      return {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: parseInt(totalRevenue) || 0
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  // Website settings methods
  async getWebsiteSettings(): Promise<any> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT setting_key, setting_value FROM website_settings WHERE is_public = TRUE'
      );
      
      const settings: any = {};
      (rows as any[]).forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
      
      console.log('🔧 Fetched website settings:', settings);
      return settings;
    } catch (error) {
      console.error('❌ Error getting website settings:', error);
      // Return default values if table doesn't exist
      return {
        usdt_address: 'TRC20_USDT_ADDRESS_HERE',
        usdt_qr_code_path: '/assets/usdt_qr.png',
        game_price_inr: '130000',
        usdt_rate_inr: '89'
      };
    }
  }

  async updateWebsiteSetting(key: string, value: string): Promise<void> {
    try {
      await this.pool.execute(
        `INSERT INTO website_settings (setting_key, setting_value, is_public) 
         VALUES (?, ?, TRUE) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
        [key, value]
      );
      
      console.log(`✅ Updated setting: ${key} = ${value}`);
    } catch (error) {
      console.error(`❌ Error updating setting ${key}:`, error);
      throw new Error(`Failed to update setting: ${key}`);
    }
  }

  async getPublicSettings(): Promise<any> {
    try {
      const [rows] = await this.pool.execute(
        'SELECT setting_key, setting_value FROM website_settings WHERE is_public = TRUE'
      );
      
      const settings: any = {};
      (rows as any[]).forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
      
      return settings;
    } catch (error) {
      console.error('❌ Error getting public settings:', error);
      // Return default values if table doesn't exist
      return {
        usdt_address: 'TRC20_USDT_ADDRESS_HERE',
        usdt_qr_code_path: '/assets/usdt_qr.png',
        game_price_inr: '130000',
        usdt_rate_inr: '89'
      };
    }
  }
}
