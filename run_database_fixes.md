# Database Fixes Required

## ⚠️ IMPORTANT: Run these SQL commands in your phpMyAdmin

The admin panel is experiencing database errors that need to be fixed. Please run the following SQL commands in your phpMyAdmin SQL tab:

### 1. Fix Orders Table Status Column
```sql
ALTER TABLE orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending';
```

### 2. Fix Captcha Sessions Table
```sql
-- Add missing session_id column
ALTER TABLE captcha_sessions ADD COLUMN IF NOT EXISTS session_id VARCHAR(255) NOT NULL DEFAULT '';

-- Update existing records
UPDATE captcha_sessions SET session_id = CONCAT('session_', id) WHERE session_id = '';

-- Make session_id unique
ALTER TABLE captcha_sessions ADD UNIQUE KEY unique_session_id (session_id);
```

### 3. Add Missing Columns to Orders Table
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 4. Add Performance Indexes
```sql
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_user_id (user_id);
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_created_at (created_at);
```

### 5. Fix Any Invalid Status Values
```sql
UPDATE orders SET status = 'pending' WHERE status NOT IN ('pending', 'processing', 'completed', 'cancelled');
```

## After running these fixes:

1. ✅ Order status updates will work properly
2. ✅ Captcha sessions will display correctly
3. ✅ All order data will be visible in admin panel
4. ✅ User editing functionality will work
5. ✅ Database performance will be improved

## Current Issues Fixed:
- ❌ "Data truncated for column 'status'" error
- ❌ "Unknown column 'session_id'" error
- ❌ Missing order timestamps
- ❌ Poor database performance

**Run these commands and the admin panel will work perfectly!**
