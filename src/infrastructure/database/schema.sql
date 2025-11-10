-- Khmer Calendar Database Schema

-- Drop tables if they exist
DROP TABLE IF EXISTS calculated_lunar_dates CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;

-- Create holidays table
CREATE TABLE holidays (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL,
  day INTEGER NOT NULL,
  name_kh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'public',
  is_public_holiday BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  year INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create calculated_lunar_dates table for caching lunar calculations
CREATE TABLE calculated_lunar_dates (
  id SERIAL PRIMARY KEY,
  gregorian_date DATE NOT NULL UNIQUE,
  sak VARCHAR(10) NOT NULL,
  sak_kh VARCHAR(50) NOT NULL,
  animal_year VARCHAR(10) NOT NULL,
  animal_year_kh VARCHAR(50) NOT NULL,
  buddhist_era INTEGER NOT NULL,
  lunar_month VARCHAR(10) NOT NULL,
  lunar_month_kh VARCHAR(50) NOT NULL,
  moon_phase VARCHAR(10) NOT NULL,
  moon_phase_kh VARCHAR(50) NOT NULL,
  lunar_day INTEGER NOT NULL,
  lunar_day_kh VARCHAR(10) NOT NULL,
  is_holy_day BOOLEAN NOT NULL DEFAULT false,
  code VARCHAR(50) NOT NULL,
  full_description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_holidays_date ON holidays(month, day);
CREATE INDEX idx_holidays_year ON holidays(year);
CREATE INDEX idx_holidays_type ON holidays(type);
CREATE INDEX idx_calculated_lunar_dates_gregorian ON calculated_lunar_dates(gregorian_date);
CREATE INDEX idx_calculated_lunar_dates_buddhist_era ON calculated_lunar_dates(buddhist_era);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for holidays table
CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON holidays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

