-- Remove the positive check constraint
ALTER TABLE water_logs DROP CONSTRAINT water_logs_amount_ml_check;

-- Add drink_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'water_logs' 
    AND column_name = 'drink_type'
  ) THEN
    ALTER TABLE water_logs ADD COLUMN drink_type TEXT;
  END IF;
END $$;

-- Update existing rows to have a default drink type
UPDATE water_logs SET drink_type = 'water' WHERE drink_type IS NULL;

-- Make drink_type NOT NULL after setting defaults
ALTER TABLE water_logs ALTER COLUMN drink_type SET NOT NULL;
