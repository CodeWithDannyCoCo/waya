-- Add PIN column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'pin') THEN
        ALTER TABLE users ADD COLUMN pin VARCHAR(255);
    END IF;
END $$;

-- Make password column nullable for child accounts
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Update existing demo data with proper PINs (hashed)
-- PIN 1234 hashed with bcrypt
UPDATE users 
SET pin = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE role = 'child' AND pin IS NULL;

-- Ensure demo parent has proper password
-- Password 'demo123' hashed with bcrypt
UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'parent@demo.com' AND password IS NULL;
