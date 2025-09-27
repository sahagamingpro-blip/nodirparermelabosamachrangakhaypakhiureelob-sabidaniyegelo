-- Complete Orders Table Schema with Milestone Column
-- Run this in your MySQL database

-- First, check if milestone column exists
DESCRIBE orders;

-- If milestone column is missing, add it:
ALTER TABLE orders ADD COLUMN milestone TEXT COMMENT 'Project milestone updates and progress notes';

-- Complete orders table structure should look like this:
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
    amount DECIMAL(10, 2) NOT NULL,
    usdt_amount DECIMAL(10, 4) NOT NULL,
    -- Payment Information
    transaction_id VARCHAR(255),
    transaction_screenshot VARCHAR(500),
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) COMMENT='Game development orders with complete form data and IST timezone';

-- Verify the milestone column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'milestone';
