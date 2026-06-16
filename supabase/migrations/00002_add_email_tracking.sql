-- Add email tracking columns to the orders table
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS email_status       TEXT,
  ADD COLUMN IF NOT EXISTS email_sent_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_bounced_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_opened_at    TIMESTAMPTZ;

-- Add mug gelato order ID column
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS mug_gelato_order_id TEXT;
