-- Add Gelato fulfillment tracking columns to the orders table
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS gelato_status      TEXT,
  ADD COLUMN IF NOT EXISTS tracking_code      TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url       TEXT,
  ADD COLUMN IF NOT EXISTS gelato_updated_at  TIMESTAMPTZ;
