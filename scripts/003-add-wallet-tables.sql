-- Enable UUID extension first
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add wallet balance to user_stats if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_stats' AND column_name='wallet_balance') THEN
        ALTER TABLE user_stats ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00;
    END IF;
END $$;

-- Update transactions table to allow new transaction types
DO $$
BEGIN
    -- Drop the existing check constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'transactions_type_check') THEN
        ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
    END IF;
    
    -- Add the updated check constraint with new types
    ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
    CHECK (type IN ('earned', 'spent', 'bonus', 'funding', 'transfer', 'conversion', 'withdrawal'));
END $$;

-- Create wallet_pins table for secure PIN storage
CREATE TABLE IF NOT EXISTS wallet_pins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pin_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create conversion_requests table for coin to money conversions
CREATE TABLE IF NOT EXISTS conversion_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coin_amount INTEGER NOT NULL,
    money_amount DECIMAL(10,2) NOT NULL,
    conversion_rate DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    note TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    urgent BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Add additional columns to transactions table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='coin_amount') THEN
        ALTER TABLE transactions ADD COLUMN coin_amount INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='status') THEN
        ALTER TABLE transactions ADD COLUMN status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallet_pins_user_id ON wallet_pins(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_requests_child_id ON conversion_requests(child_id);
CREATE INDEX IF NOT EXISTS idx_conversion_requests_status ON conversion_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create trigger for wallet_pins updated_at
CREATE TRIGGER update_wallet_pins_updated_at BEFORE UPDATE ON wallet_pins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
