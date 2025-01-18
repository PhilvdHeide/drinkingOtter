-- Remove the positive check constraint
ALTER TABLE water_logs DROP CONSTRAINT water_logs_amount_ml_check;

-- Add drink_type column
ALTER TABLE water_logs ADD COLUMN drink_type TEXT;

-- Update existing rows to have a default drink type
UPDATE water_logs SET drink_type = 'water' WHERE drink_type IS NULL;

-- Make drink_type NOT NULL after setting defaults
ALTER TABLE water_logs ALTER COLUMN drink_type SET NOT NULL;
