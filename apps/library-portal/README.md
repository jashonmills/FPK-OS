# FPK University Library Portal

Public-facing, read-only library portal for FPK University courses. This is a simplified, anonymous-access interface for accessing course content in public institutions.

## Overview

The Library Portal is a standalone React application that provides:
- **Course Gallery**: Browse all 88 available courses
- **Course Overview**: View course details and lesson listings
- **Lesson Player**: Read lesson content with formatted transcripts

## Features

✅ **Anonymous Access**: No authentication required  
✅ **Read-Only**: Users can browse and read content only  
✅ **470 Lessons**: Imported from course manifests into Supabase  
✅ **Responsive Design**: Works on all devices  
✅ **Supabase Integration**: Powered by Edge Functions and PostgreSQL  

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Routing**: Wouter (lightweight React router)

## API Integration

The portal connects to the `library-portal-api` Supabase Edge Function:

- **Endpoint**: `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/library-portal-api`
- **Authentication**: Custom API key (x-library-api-key header)
- **Modes**:
  - `?mode=list` - Get all courses
  - `?mode=course&id={courseId}` - Get course with lessons
  - `?mode=lesson&id={courseId}&lessonId={lessonId}` - Get lesson details

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

The API URL and key are hardcoded in `src/lib/api.ts` for static deployment compatibility:
- `API_URL`: Supabase Edge Function URL
- `API_KEY`: Custom authentication key

## Deployment

This is a static site that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Database Schema

**courses** table:
- id, title, description, asset_path, featured, created_at, updated_at

**lessons** table:
- id, course_id, title, transcript, video_url, lesson_number, created_at, updated_at

## Future Enhancements

- [ ] Smaller course tiles / list view option
- [ ] Course artwork/images
- [ ] Search and filtering
- [ ] Pagination for large course lists
