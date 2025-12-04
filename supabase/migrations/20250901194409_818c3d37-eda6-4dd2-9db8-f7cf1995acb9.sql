-- Create course cover images as data URLs in the database
-- This ensures the images are immediately available without requiring separate upload

-- Update Learning State course with data URL image
UPDATE courses 
SET thumbnail_url = 'data:image/svg+xml;base64,' || encode(convert_to(
  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad1)" rx="8" />
    <rect x="20" y="20" width="360" height="260" fill="rgba(255,255,255,0.1)" rx="4" />
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">Learning State</text>
    <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.8)">Beta Course</text>
    <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)" />
    <circle cx="350" cy="250" r="15" fill="rgba(255,255,255,0.2)" />
  </svg>', 'UTF8'), 'base64')
WHERE id = 'learning-state-beta';

-- Update EL Spelling course with data URL image  
UPDATE courses 
SET thumbnail_url = 'data:image/svg+xml;base64,' || encode(convert_to(
  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#EC4899;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad2)" rx="8" />
    <rect x="20" y="20" width="360" height="260" fill="rgba(255,255,255,0.1)" rx="4" />
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="28" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">EL Spelling</text>
    <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.8)">Language Course</text>
    <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)" />
    <circle cx="350" cy="250" r="15" fill="rgba(255,255,255,0.2)" />
  </svg>', 'UTF8'), 'base64')
WHERE id = 'el-spelling-reading';

-- Update Algebra Pathfinder course with data URL image
UPDATE native_courses 
SET cover_url = 'data:image/svg+xml;base64,' || encode(convert_to(
  '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F97316;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad3)" rx="8" />
    <rect x="20" y="20" width="360" height="260" fill="rgba(255,255,255,0.1)" rx="4" />
    <text x="200" y="120" font-family="Arial, sans-serif" font-size="26" font-weight="bold" 
          text-anchor="middle" dominant-baseline="middle" fill="white">Algebra Pathfinder</text>
    <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" 
          text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.8)">Math Course</text>
    <circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.3)" />
    <circle cx="350" cy="250" r="15" fill="rgba(255,255,255,0.2)" />
  </svg>', 'UTF8'), 'base64')
WHERE slug = 'algebra-pathfinder-converted';