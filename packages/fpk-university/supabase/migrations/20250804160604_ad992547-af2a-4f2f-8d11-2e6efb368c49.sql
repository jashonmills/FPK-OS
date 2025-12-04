-- Enable real-time for contact_submissions table
ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;

-- Enable real-time for profiles table (for beta user updates)
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;