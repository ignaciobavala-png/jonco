-- Add country column to testimonios table
ALTER TABLE testimonios ADD COLUMN country VARCHAR(2);

-- Optional: Add index for better performance
CREATE INDEX idx_testimonios_country ON testimonios(country);

-- Optional: Update existing testimonials with default country based on location patterns
-- This is just an example - you may want to update manually
UPDATE testimonios SET country = 'US' WHERE location ILIKE '%USA%' OR location ILIKE '%US%';
UPDATE testimonios SET country = 'AU' WHERE location ILIKE '%AUS%' OR location ILIKE '%AU%';
UPDATE testimonios SET country = 'AR' WHERE location ILIKE '%ARGENTINA%' OR location ILIKE '%AR%';
