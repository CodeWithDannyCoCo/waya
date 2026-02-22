-- Add wallet balances to existing user stats
UPDATE user_stats SET wallet_balance = 2500.00 WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE user_stats SET wallet_balance = 1800.00 WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

-- Insert sample wallet transactions
INSERT INTO transactions (user_id, type, amount, description, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'funding', 10000.00, 'Initial wallet funding', 'completed'),
('550e8400-e29b-41d4-a716-446655440000', 'transfer', -2500.00, 'Transfer to Alex', 'completed'),
('550e8400-e29b-41d4-a716-446655440001', 'transfer', 2500.00, 'Received from parent', 'completed'),
('550e8400-e29b-41d4-a716-446655440000', 'transfer', -1800.00, 'Transfer to Jamie', 'completed'),
('550e8400-e29b-41d4-a716-446655440002', 'transfer', 1800.00, 'Received from parent', 'completed');

-- Insert sample conversion requests
INSERT INTO conversion_requests (child_id, coin_amount, money_amount, conversion_rate, status, note) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 50, 250.00, 5.00, 'pending', 'Want to save for new toy'),
('550e8400-e29b-41d4-a716-446655440002', 30, 150.00, 5.00, 'pending', 'Saving for art supplies');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, urgent, read) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Chore Completed', 'Alex completed "Clean your room"', 'chore_completed', true, false),
('550e8400-e29b-41d4-a716-446655440000', 'Coin Conversion Request', 'Alex wants to convert 50 coins to ₦250', 'coin_conversion', true, false),
('550e8400-e29b-41d4-a716-446655440001', 'New Chore Assigned', 'You have a new chore: "Do the dishes"', 'chore_assigned', true, false),
('550e8400-e29b-41d4-a716-446655440002', 'Achievement Unlocked', 'You earned the "Streak Master" achievement!', 'achievement', false, false);
