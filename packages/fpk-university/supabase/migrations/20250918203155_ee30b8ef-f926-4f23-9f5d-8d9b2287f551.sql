-- Insert sample courses for St. Oliver's Community College with proper course images
-- Get the organization owner as the course creator
DO $$
DECLARE
  org_owner_id UUID;
BEGIN
  -- Get the organization owner
  SELECT o.owner_id INTO org_owner_id FROM organizations o WHERE o.id = '7ec908f7-f5cd-481c-87b9-02752db61d91';
  
  -- Delete existing courses first to avoid duplicates
  DELETE FROM org_courses WHERE org_id = '7ec908f7-f5cd-481c-87b9-02752db61d91';

  -- Insert the new courses with proper images and creator
  INSERT INTO org_courses (org_id, title, description, level, published, thumbnail_url, created_by) VALUES
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Empowering Learning for Spelling', 'Master spelling through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome spelling challenges.', 'beginner', true, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Empowering Learning: Handwriting', 'Master handwriting techniques through systematic practice and understanding. Develop fluency, accuracy, and confidence in written communication.', 'beginner', true, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Empowering Learning State', 'Master the optimal learning state through calming techniques and brain integration methods. Learn to regulate emotions and enhance focus for better learning outcomes.', 'intermediate', true, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Empowering Learning for Reading', 'Master reading through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome reading challenges and build confidence.', 'beginner', true, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Empowering Learning for Numeracy', 'Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication, and division using proven methodologies.', 'beginner', true, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'EL Spelling & Reading', 'Master spelling and reading through visual memory techniques and optimal learning states. A comprehensive approach combining phonics and visual learning strategies.', 'beginner', true, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'ELT: Empowering Learning Techniques', 'Master evidence-based learning strategies specifically designed for neurodiverse minds. Comprehensive techniques for enhanced cognitive performance and learning efficiency.', 'advanced', true, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id),
  ('7ec908f7-f5cd-481c-87b9-02752db61d91', 'Money Management for Teens', 'Learn essential financial skills including budgeting, saving, investing, and credit management. Build a foundation for lifelong financial literacy and independence.', 'intermediate', true, 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&h=300&fit=crop&auto=format&q=80', org_owner_id);
END $$;