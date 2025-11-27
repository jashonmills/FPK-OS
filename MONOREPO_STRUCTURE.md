# FPK University Monorepo Structure

This repository uses a **monorepo** architecture to manage multiple applications within a single codebase.

## Structure

```
fpk-learner-v1/
├── apps/
│   └── library-portal/          # Public-facing library portal (NEW)
├── src/                         # Main FPK Learner application
├── supabase/                    # Shared Supabase backend
│   ├── functions/               # Edge Functions
│   │   └── library-portal-api/  # API for library portal
│   └── migrations/              # Database migrations
├── public/                      # Main app assets
└── package.json                 # Root dependencies

```

## Applications

### Main App (Root)
**Location**: `/src`, `/public`  
**Purpose**: Full-featured FPK University learning platform  
**Access**: Authenticated users (students, coaches, admins)  
**Features**: Course management, progress tracking, assessments, user management

### Library Portal
**Location**: `/apps/library-portal`  
**Purpose**: Public-facing, read-only course library  
**Access**: Anonymous (no authentication)  
**Features**: Browse courses, view lessons, read content

## Shared Resources

### Supabase Backend
Both applications share:
- **Database**: PostgreSQL with `courses` and `lessons` tables
- **Edge Functions**: 
  - `library-portal-api` - Public API for library portal
  - Other functions for main app
- **Storage**: S3-compatible object storage

### Environment Variables
- Main app uses full Supabase credentials
- Library portal uses public Edge Function endpoint with API key

## Development

### Main App
```bash
pnpm install
pnpm dev
```

### Library Portal
```bash
cd apps/library-portal
pnpm install
pnpm dev
```

## Deployment

- **Main App**: Deployed to Vercel/Netlify from root
- **Library Portal**: Can be deployed separately from `apps/library-portal`
- **Supabase**: Single backend serves both applications

## Benefits of Monorepo

✅ **Shared Backend**: Single source of truth for data  
✅ **Code Reuse**: Share types, utilities, and components  
✅ **Consistent Tooling**: Same build tools and dependencies  
✅ **Easier Maintenance**: Update both apps in one place  
✅ **Atomic Changes**: Changes to backend affect both apps simultaneously
