-- Insert demo parent user
INSERT INTO users (id, name, email, password, role, image) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo Parent', 'parent@example.com', 'password123', 'parent', '/placeholder.svg?height=40&width=40')
ON CONFLICT (email) DO NOTHING;

-- Insert demo children
INSERT INTO users (id, name, password, role, parent_id, image) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Alex', 'alex123', 'child', '550e8400-e29b-41d4-a716-446655440000', '/placeholder.svg?height=40&width=40'),
('550e8400-e29b-41d4-a716-446655440002', 'Jamie', 'jamie123', 'child', '550e8400-e29b-41d4-a716-446655440000', '/placeholder.svg?height=40&width=40')
ON CONFLICT (id) DO NOTHING;

-- Insert user stats for children
INSERT INTO user_stats (user_id, total_coins, total_xp, level, streak_days) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 275, 340, 5, 3),
('550e8400-e29b-41d4-a716-446655440002', 120, 180, 3, 1)
ON CONFLICT (user_id) DO NOTHING;

-- Insert demo chores
INSERT INTO chores (id, title, description, difficulty, coins, xp, status, assigned_to, created_by, due_date) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'Clean your room', 'Make your bed and organize your toys', 'easy', 50, 20, 'pending', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE),
('650e8400-e29b-41d4-a716-446655440002', 'Take out the trash', 'Empty all trash bins and take to the curb', 'easy', 30, 15, 'pending', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE),
('650e8400-e29b-41d4-a716-446655440003', 'Do the dishes', 'Wash all dishes and put them away', 'medium', 40, 25, 'pending', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE + INTERVAL '1 day'),
('650e8400-e29b-41d4-a716-446655440004', 'Water the plants', 'Water all indoor and outdoor plants', 'easy', 25, 10, 'completed', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert demo rewards
INSERT INTO rewards (id, title, description, cost, status, available_to, created_by) VALUES 
('750e8400-e29b-41d4-a716-446655440001', 'Game Time', '30 minutes of video game time', 100, 'available', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('750e8400-e29b-41d4-a716-446655440002', 'Movie Night', 'Pick a movie for family night', 200, 'available', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('750e8400-e29b-41d4-a716-446655440003', 'Special Treat', 'A special dessert of your choice', 150, 'available', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

-- Insert demo goals
INSERT INTO goals (id, title, description, target_amount, current_amount, target_date, user_id) VALUES 
('850e8400-e29b-41d4-a716-446655440001', 'New Bike', 'Save up for a new mountain bike', 500, 275, CURRENT_DATE + INTERVAL '3 months', '550e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440002', 'Art Supplies', 'Buy professional art supplies', 200, 120, CURRENT_DATE + INTERVAL '1 month', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert demo transactions
INSERT INTO transactions (user_id, type, amount, description, reference_type) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'earned', 25, 'Completed: Water the plants', 'chore'),
('550e8400-e29b-41d4-a716-446655440001', 'earned', 50, 'Weekly bonus for good behavior', 'bonus'),
('550e8400-e29b-41d4-a716-446655440002', 'earned', 30, 'Completed daily chores', 'chore');

-- Insert demo game progress
INSERT INTO game_progress (user_id, game_type, level, score, progress_data) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'money_maze', 3, 450, '{"mazes_completed": 2, "questions_answered": 15, "accuracy": 0.8}'),
('550e8400-e29b-41d4-a716-446655440001', 'budget_battle', 2, 320, '{"games_played": 5, "high_score": 850, "average_score": 640}'),
('550e8400-e29b-41d4-a716-446655440002', 'goal_better', 1, 150, '{"goals_created": 2, "goals_completed": 0, "total_saved": 120}');
