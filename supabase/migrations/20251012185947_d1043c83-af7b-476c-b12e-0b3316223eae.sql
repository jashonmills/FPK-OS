-- Update the course title from "Introduction to Video Production" to "Meditation with David Scullion"
UPDATE courses 
SET title = 'Meditation with David Scullion',
    updated_at = now()
WHERE id = 'introduction-video-production';