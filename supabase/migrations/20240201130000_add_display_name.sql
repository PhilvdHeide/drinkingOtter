-- Add display_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'display_name'
  ) THEN
    ALTER TABLE users
    ADD COLUMN display_name TEXT;
  END IF;
END $$;
