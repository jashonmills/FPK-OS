
# OPDS Integration & EPUB Reader Implementation

## Overview

This implementation provides federated OPDS (Open Publication Distribution System) ingestion from Project Gutenberg and an in-app EPUB reader for the FPK library system.

## Architecture

### 1. OPDS Feed Processing (`src/services/opdsService.ts`)
- Fetches and parses OPDS XML from Project Gutenberg
- Filters content for neurodiversity-relevant topics
- Converts OPDS entries to internal book format

### 2. Data Types (`src/types/publicDomainBooks.ts`)
- `PublicDomainBook`: Internal book representation
- `OPDSEntry`: Raw OPDS entry structure
- `OPDSFeed`: Complete feed structure

### 3. Frontend Components
- `PublicDomainBooksSection`: Book grid display
- `EPUBReader`: Full-screen EPUB reader with navigation
- Integration with existing Library page

### 4. Content Filtering

Books are filtered based on these neurodiversity-relevant keywords:
```typescript
const NEURODIVERSITY_KEYWORDS = [
  'autism', 'adhd', 'neurodiversity', 'learning', 'education', 'teaching',
  'psychology', 'behavior', 'development', 'cognitive', 'mind', 'brain',
  'inclusive', 'special needs', 'disability', 'mental health', 'social skills',
  'communication', 'sensory', 'emotional', 'self-help', 'understanding'
];
```

## Backend Implementation (Supabase)

### Database Schema
```sql
CREATE TABLE public_domain_books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  subjects TEXT[] DEFAULT '{}',
  cover_url TEXT,
  epub_url TEXT NOT NULL,
  gutenberg_id INTEGER UNIQUE,
  description TEXT,
  language TEXT DEFAULT 'en',
  last_updated TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Edge Functions Needed

1. **OPDS Ingestion Function** (`/functions/opds-ingestion/index.ts`)
   - Scheduled weekly execution
   - Fetches and processes OPDS feed
   - Updates database with new books
   - Removes outdated entries

2. **Public Domain Books API** (`/functions/public-domain-books/index.ts`)
   - Returns filtered book list for frontend
   - Supports pagination and search

3. **EPUB Proxy Function** (`/functions/epub-proxy/index.ts`)
   - Proxies EPUB files through Supabase Storage
   - Handles CORS and security headers

## EPUB Reader Features

### Current Implementation
- Full-screen reading interface
- Font size adjustment (12px - 24px)
- Navigation controls (prev/next page)
- Table of contents placeholder
- Accessibility support
- "Back to Library" functionality

### Future Enhancements
- Real EPUB.js integration for actual book rendering
- Text-to-speech support
- Bookmarking and progress tracking
- Annotation system
- Offline reading capability

## Usage

### For Users
1. Navigate to Library → Public Domain Collection
2. Browse curated books filtered for educational content
3. Click "Read" to open the in-app EPUB reader
4. Use navigation controls for reading

### For Developers
1. Install dependencies: `npm install epubjs`
2. Update OPDS processing logic in `src/utils/opdsProcessor.ts`
3. Implement backend functions for data ingestion
4. Configure weekly cron job for OPDS updates

## Testing

### Manual Testing
1. Verify Public Domain section appears in Library
2. Confirm book grid displays properly
3. Test EPUB reader opens and displays content
4. Verify navigation controls work
5. Test accessibility features (keyboard navigation, screen readers)

### Automated Testing
```bash
# Test OPDS parsing
npm test -- opdsService.test.ts

# Test book filtering
npm test -- opdsProcessor.test.ts

# Test reader components
npm test -- EPUBReader.test.tsx
```

## Performance Considerations

1. **Lazy Loading**: Book covers and EPUB files load on demand
2. **Caching**: Session storage for thumbnails, weekly database updates
3. **Pagination**: Large book collections support pagination
4. **CDN**: Static assets served through optimized delivery

## Security & CORS

1. **Content Security Policy**: Allows EPUB content rendering
2. **CORS Configuration**: Permits cross-origin EPUB loading
3. **Input Validation**: Sanitizes OPDS data before storage
4. **Rate Limiting**: Prevents abuse of OPDS ingestion

## Accessibility Features

1. **Keyboard Navigation**: Full reader control via keyboard
2. **Screen Reader Support**: Proper ARIA labels and roles
3. **Font Size Control**: User-adjustable text size
4. **High Contrast Mode**: Respects user accessibility preferences
5. **Text Reflow**: Responsive text layout for all devices
