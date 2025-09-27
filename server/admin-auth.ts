import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash } from 'crypto';
import { storage } from './storage';

// Hash password function using MD5
export function hashPassword(password: string): string {
  return createHash('md5').update(password).digest('hex');
}

// Compare password function for MD5
export function comparePasswords(password: string, hash: string): boolean {
  try {
    const passwordHash = createHash('md5').update(password).digest('hex');
    return passwordHash === hash;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

// Admin Local Strategy
passport.use('admin-local', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username: string, password: string, done) => {
    try {
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin) {
        return done(null, false, { message: 'Admin not found' });
      }

      if (!admin.is_active) {
        return done(null, false, { message: 'Admin account is disabled' });
      }

      const isValidPassword = comparePasswords(password, admin.password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid password' });
      }

      // Update last login
      await storage.updateAdminLastLogin(admin.id);

      return done(null, admin);
    } catch (error) {
      console.error('Admin authentication error:', error);
      return done(error);
    }
  }
));

// Note: Passport serialization is handled in auth.ts to avoid conflicts

// Admin middleware to check if user is authenticated admin
export function requireAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user && req.user.role) {
    return next();
  }
  
  return res.status(401).json({ error: 'Admin authentication required' });
}

// Admin middleware to check specific roles
export function requireAdminRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user && roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Insufficient admin privileges' });
  };
}
