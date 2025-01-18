-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create water logs table
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX idx_water_logs_logged_at ON water_logs(logged_at);

-- Enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can manage their own data" ON users
FOR ALL
TO authenticated
USING (auth.uid() = id);

-- Create policies for water_logs table
CREATE POLICY "Users can manage their own water logs" ON water_logs
FOR ALL
TO authenticated
USING (auth.uid() = user_id);
