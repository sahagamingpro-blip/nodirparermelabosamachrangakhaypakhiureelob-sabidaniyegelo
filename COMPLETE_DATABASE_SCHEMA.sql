-- =====================================================
-- A2Z Game Developer - Complete MySQL Database Schema
-- Database: sahawebtech_yono_developer
-- Host: 103.124.172.12
-- =====================================================

-- Set timezone to IST (Indian Standard Time)
SET time_zone = '+05:30';

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
) COMMENT='User accounts with auto-increment ID and IST timezone';

-- =====================================================
-- 2. SESSIONS TABLE (for express-session)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
) COMMENT='Express session storage with IST timezone';

-- =====================================================
-- 3. ORDERS TABLE (Complete Order Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Requirements
    game_type VARCHAR(100) NOT NULL,
    target_platform VARCHAR(100) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    
    -- Game Details
    game_name VARCHAR(255) NOT NULL,
    game_logo VARCHAR(500),
    game_support_email VARCHAR(255) NOT NULL,
    telegram_id VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    additional_requirements TEXT,
    
    -- Order Status & Milestone
    status ENUM('pending', 'payment_verified', 'in_development', 'testing', 'completed', 'cancelled') DEFAULT 'pending',
    milestone TEXT COMMENT 'Project milestone updates and progress notes',
    
    -- Financial Information
    amount DECIMAL(10, 2) NOT NULL,
    usdt_amount DECIMAL(10, 4) NOT NULL,
    
    -- Payment Information
    transaction_id VARCHAR(255),
    transaction_screenshot VARCHAR(500),
    terms_accepted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys and Indexes
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) COMMENT='Game development orders with complete form data and IST timezone';

-- =====================================================
-- 4. CAPTCHA SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS captcha_sessions (
    id VARCHAR(36) PRIMARY KEY,
    captcha_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    INDEX idx_expires (expires_at)
) COMMENT='Captcha sessions with 6-digit codes and IST timezone';

-- =====================================================
-- 5. SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample admin user (optional)
-- Password: admin123 (hashed)
INSERT IGNORE INTO users (username, password, full_name, email, phone, date_of_birth) 
VALUES (
    'admin',
    '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQj',
    'Admin User',
    'admin@a2z.dog',
    '+919800100100',
    '01-01-1990'
);

-- =====================================================
-- 6. MAINTENANCE QUERIES
-- =====================================================

-- Clean up expired captcha sessions (run this periodically)
-- DELETE FROM captcha_sessions WHERE expires_at < NOW() OR used = TRUE;

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check if milestone column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'milestone';

-- Check all table structures
DESCRIBE users;
DESCRIBE sessions;
DESCRIBE orders;
DESCRIBE captcha_sessions;

-- =====================================================
-- 8. MILESTONE UPDATE EXAMPLES
-- =====================================================

-- Example milestone updates (replace 'order-id' with actual order ID):
/*
UPDATE orders SET 
    milestone = 'Payment verified. Development team assigned to your project.',
    status = 'payment_verified',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 'order-id';

UPDATE orders SET 
    milestone = 'Game design phase completed. Starting development work.',
    status = 'in_development',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 'order-id';

UPDATE orders SET 
    milestone = 'Core features implemented. Beginning testing phase.',
    status = 'testing',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 'order-id';

UPDATE orders SET 
    milestone = 'Project completed and delivered. Thank you for your business!',
    status = 'completed',
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 'order-id';
*/

-- =====================================================
-- 9. STATUS VALUES REFERENCE
-- =====================================================
/*
Order Status Values:
- pending: Order received, waiting for payment
- payment_verified: Payment confirmed, work starting
- in_development: Active development phase
- testing: Testing and quality assurance
- completed: Project finished and delivered
- cancelled: Order cancelled
*/

-- =====================================================
-- 10. API ENDPOINTS REFERENCE
-- =====================================================
/*
Authentication:
- POST /api/register - User registration
- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/user - Get current user

Captcha:
- GET /api/captcha - Generate captcha
- POST /api/verify-captcha - Verify captcha

Orders:
- POST /api/orders - Create new order
- GET /api/orders - Get user orders
- PUT /api/orders/:orderId/milestone - Update order milestone (admin only)

Admin:
- GET /admin/orders - Admin orders page
- PUT /api/orders/:orderId/milestone - Update milestone
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
