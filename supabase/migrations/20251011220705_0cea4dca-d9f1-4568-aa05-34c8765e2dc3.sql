-- Manual cleanup for user allen.od101@gmail.com (53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4)
-- Only delete from tables that have actual data

-- Delete from daily_activities (this was causing the foreign key constraint issue)
DELETE FROM public.daily_activities 
WHERE user_id = '53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4';

-- Finally delete the auth user
DELETE FROM auth.users WHERE id = '53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4';