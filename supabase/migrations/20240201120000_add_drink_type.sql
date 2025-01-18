-- Add drink_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'water_logs' 
    AND column_name = 'drink_type'
  ) THEN
    ALTER TABLE water_logs
    ADD COLUMN drink_type TEXT DEFAULT 'water';
  END IF;
END $$;

-- Update existing rows to have default value
UPDATE water_logs
SET drink_type = 'water'
WHERE drink_type IS NULL;

-- Create index for drink_type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_water_logs_drink_type'
    AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_water_logs_drink_type ON water_logs(drink_type);
  END IF;
END $$;
