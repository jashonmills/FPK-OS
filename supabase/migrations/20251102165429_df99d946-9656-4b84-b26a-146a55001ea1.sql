-- Extend task_type enum to support calendar event types
ALTER TYPE task_type ADD VALUE IF NOT EXISTS 'meeting';
ALTER TYPE task_type ADD VALUE IF NOT EXISTS 'deadline';
ALTER TYPE task_type ADD VALUE IF NOT EXISTS 'focus_time';
ALTER TYPE task_type ADD VALUE IF NOT EXISTS 'personal';
ALTER TYPE task_type ADD VALUE IF NOT EXISTS 'reminder';