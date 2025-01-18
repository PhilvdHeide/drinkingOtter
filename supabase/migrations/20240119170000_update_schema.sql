-- Create water_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  drink_type TEXT NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_water_logs_user_id'
    AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_water_logs_user_id ON water_logs(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_water_logs_logged_at'
    AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_water_logs_logged_at ON water_logs(logged_at);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own water logs"
ON water_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs"
ON water_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water logs"
ON water_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs"
ON water_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
