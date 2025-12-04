-- Phase 1: Expand app_role enum with 4 new business roles
-- This must be in its own transaction
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hr';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'it';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'viewer';