-- =====================================================
-- Migration: Create supplies table for soundmixers
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zlymnomyeckxdwghmtyg/sql
-- =====================================================

CREATE TABLE IF NOT EXISTS supplies (
    id            SERIAL PRIMARY KEY,
    "serialNumber" TEXT NOT NULL UNIQUE,
    brand          TEXT NOT NULL,
    model          TEXT NOT NULL,
    description    TEXT,
    price          DECIMAL(10, 2) NOT NULL,
    status         TEXT NOT NULL,
    "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Auto-update updatedAt on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON supplies;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON supplies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
