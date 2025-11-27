/**
 * Student Portal - Study Tools Section (Notes & Flashcards)
 * Comprehensive documentation for student note-taking and flashcard features
 */

import { GuideEntry } from '@/types/platform-guide';

export const studentStudyGuide: GuideEntry[] = [
  {
    id: 'student-notes-overview',
    section: 'study',
    title: 'Notes & Flashcards - Complete Hub',
    description: 'Central hub for organizing learning materials including notes, file uploads, flashcards, and progress tracking.',
    userPurpose: 'Organize learning materials, create study aids, upload files, manage flashcards, and review progress in one place.',
    route: '/dashboard/learner/notes',
    component: 'Notes.tsx',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Tabbed Interface',
        action: 'Switch between Notes, Upload, Flashcards, and Progress tabs',
        outcome: 'Organizes different study tools',
        technicalDetails: 'Tabs component with four sections'
      },
      {
        element: 'First Visit Video',
        action: 'Introductory video modal on first visit',
        outcome: 'Teaches how to use notes and flashcards system',
        technicalDetails: 'useFirstVisitVideo hook with tutorial video'
      },
      {
        element: 'Mobile Responsive Layout',
        action: 'Adapts to mobile screen sizes',
        outcome: 'Optimized mobile experience',
        technicalDetails: 'useIsMobile hook and responsive styling'
      },
      {
        element: 'Help Button',
        action: 'Click to replay tutorial',
        outcome: 'Manually shows instructional video',
        technicalDetails: 'Help icon triggers video modal'
      }
    ],
    dataDisplayed: [],
    relatedFeatures: ['Note Taking', 'Flashcards', 'File Upload', 'Study Progress']
  },
  {
    id: 'student-notes-tab',
    section: 'study',
    subsection: 'Notes',
    title: 'Notes Tab - Note Taking and Organization',
    description: 'Create, edit, and organize rich text notes linked to courses and lessons.',
    userPurpose: 'Take notes during learning, organize thoughts, and create study summaries.',
    route: '/dashboard/learner/notes#notes',
    component: 'NotesSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Create Note Button',
        action: 'Opens new note editor',
        outcome: 'Begins new note creation',
        technicalDetails: 'Opens NoteEditor component with blank note'
      },
      {
        element: 'Note Editor',
        action: 'Rich text editor for note content',
        outcome: 'Format text with bold, italics, lists, etc.',
        technicalDetails: 'Rich text editor component (possibly TipTap or similar)'
      },
      {
        element: 'Link to Course',
        action: 'Associate note with specific course',
        outcome: 'Organizes notes by course',
        technicalDetails: 'Dropdown to select course_id for note'
      },
      {
        element: 'Note Tags',
        action: 'Add tags for categorization',
        outcome: 'Makes notes searchable and filterable',
        technicalDetails: 'Tag input field, stores in note_tags table'
      },
      {
        element: 'Notes List',
        action: 'Displays all saved notes',
        outcome: 'Browse and access previous notes',
        technicalDetails: 'List or grid of NoteCard components'
      },
      {
        element: 'Search Notes',
        action: 'Search by title, content, or tags',
        outcome: 'Quickly find specific notes',
        technicalDetails: 'Search input with client-side or server-side filtering'
      },
      {
        element: 'Edit Note',
        action: 'Click to edit existing note',
        outcome: 'Modify note content',
        technicalDetails: 'Opens NoteEditor in edit mode with existing content'
      },
      {
        element: 'Delete Note',
        action: 'Remove note from system',
        outcome: 'Deletes note (possibly soft delete)',
        technicalDetails: 'DELETE or UPDATE with deleted_at timestamp'
      }
    ],
    dataDisplayed: [
      {
        field: 'Student Notes',
        source: 'student_notes WHERE student_id=:userId',
        significance: 'All notes created by student'
      },
      {
        field: 'Note Content',
        source: 'student_notes.content (rich text)',
        significance: 'Note body with formatting'
      },
      {
        field: 'Course Association',
        source: 'student_notes.course_id',
        significance: 'Which course note is related to'
      },
      {
        field: 'Note Tags',
        source: 'note_tags table',
        significance: 'Categorization and search terms'
      },
      {
        field: 'Created/Updated Dates',
        source: 'student_notes.created_at, updated_at',
        significance: 'When note was made or last modified'
      }
    ],
    relatedFeatures: ['Course Materials', 'Study Sessions', 'Flashcard Creation']
  },
  {
    id: 'student-file-upload-tab',
    section: 'study',
    subsection: 'File Management',
    title: 'Upload Tab - File Upload and Management',
    description: 'Upload and manage files such as PDFs, images, documents for study reference.',
    userPurpose: 'Store study materials, handouts, worksheets, and reference files in organized manner.',
    route: '/dashboard/learner/notes#upload',
    component: 'FileUploadSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'File Upload Dropzone',
        action: 'Drag and drop files or click to browse',
        outcome: 'Uploads files to student\'s storage',
        technicalDetails: 'react-dropzone component, uploads to Supabase Storage student_files bucket'
      },
      {
        element: 'Supported File Types',
        action: 'Shows accepted file formats (PDF, images, docs, etc.)',
        outcome: 'Guides user on what can be uploaded',
        technicalDetails: 'File validation on upload'
      },
      {
        element: 'Uploaded Files List',
        action: 'Displays all uploaded files with thumbnails',
        outcome: 'Browse uploaded study materials',
        technicalDetails: 'Grid or list of FileCard components'
      },
      {
        element: 'View File',
        action: 'Click to open/download file',
        outcome: 'Access uploaded file',
        technicalDetails: 'Opens file in new tab or triggers download'
      },
      {
        element: 'Delete File',
        action: 'Remove file from storage',
        outcome: 'Deletes file',
        technicalDetails: 'DELETE from storage bucket'
      },
      {
        element: 'Associate with Course',
        action: 'Link file to specific course',
        outcome: 'Organizes files by course',
        technicalDetails: 'Metadata field for course_id on file record'
      }
    ],
    dataDisplayed: [
      {
        field: 'Uploaded Files',
        source: 'storage.objects WHERE bucket_id=\'student_files\' AND (storage.foldername(name))[1]=:userId',
        significance: 'All files uploaded by student'
      },
      {
        field: 'File Metadata',
        source: 'student_files table (if exists)',
        significance: 'File name, type, size, upload date, course association'
      }
    ],
    relatedFeatures: ['Study Materials', 'Course Resources', 'Document Management']
  },
  {
    id: 'student-flashcards-tab',
    section: 'study',
    subsection: 'Flashcards',
    title: 'Flashcards Tab - Overview and Deck Management',
    description: 'View flashcard decks, study statistics, and navigate to flashcard manager.',
    userPurpose: 'Access flashcard decks for active recall study and spaced repetition.',
    route: '/dashboard/learner/notes#flashcards',
    component: 'FlashcardsSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Flashcard Decks List',
        action: 'Shows all created flashcard decks',
        outcome: 'Browse available decks',
        technicalDetails: 'List of DeckCard components from student_flashcard_decks'
      },
      {
        element: 'Study Deck Button',
        action: 'Click to enter study mode for deck',
        outcome: 'Opens flashcard study interface',
        technicalDetails: 'Navigates to /dashboard/learner/flashcards/:deckId/study'
      },
      {
        element: 'Create Deck Button',
        action: 'Opens deck creation form',
        outcome: 'Creates new flashcard deck',
        technicalDetails: 'Modal or page with deck name and description inputs'
      },
      {
        element: 'Deck Statistics',
        action: 'Shows cards due for review, mastered, learning',
        outcome: 'Track flashcard progress',
        technicalDetails: 'Stats calculated from flashcard_progress table'
      },
      {
        element: 'Manage Flashcards Link',
        action: 'Navigate to full flashcard manager',
        outcome: 'Opens comprehensive flashcard interface',
        technicalDetails: 'Router link to /dashboard/learner/flashcards'
      }
    ],
    dataDisplayed: [
      {
        field: 'Flashcard Decks',
        source: 'student_flashcard_decks WHERE student_id=:userId',
        significance: 'All decks created by student'
      },
      {
        field: 'Cards Count',
        source: 'COUNT of student_flashcards per deck',
        significance: 'Number of cards in each deck'
      },
      {
        field: 'Cards Due',
        source: 'flashcard_progress WHERE next_review_date <= NOW()',
        calculation: 'Cards scheduled for review today',
        significance: 'What needs to be studied'
      },
      {
        field: 'Mastered Cards',
        source: 'flashcard_progress WHERE mastery_level >= threshold',
        significance: 'Cards student knows well'
      }
    ],
    relatedFeatures: ['Flashcard Manager', 'Spaced Repetition', 'Study Sessions']
  },
  {
    id: 'student-flashcard-manager',
    section: 'study',
    subsection: 'Flashcards',
    title: 'Flashcard Manager - Full Management Interface',
    description: 'Comprehensive flashcard creation, editing, organization, and study interface with spaced repetition algorithm.',
    userPurpose: 'Build flashcard decks, edit cards, study with spaced repetition, and track mastery.',
    route: '/dashboard/learner/flashcards',
    component: 'FlashcardManager',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Deck Selection',
        action: 'Choose deck to work with',
        outcome: 'Loads deck\'s flashcards',
        technicalDetails: 'Dropdown or list to select active deck'
      },
      {
        element: 'Create Flashcard',
        action: 'Add new card to deck',
        outcome: 'Opens card creation form',
        technicalDetails: 'Modal with front/back inputs, optional image upload'
      },
      {
        element: 'Edit Flashcard',
        action: 'Modify existing card',
        outcome: 'Updates card content',
        technicalDetails: 'Edit form pre-filled with card data'
      },
      {
        element: 'Delete Flashcard',
        action: 'Remove card from deck',
        outcome: 'Deletes card',
        technicalDetails: 'DELETE from student_flashcards'
      },
      {
        element: 'Study Mode',
        action: 'Begin spaced repetition study session',
        outcome: 'Shows cards due for review',
        technicalDetails: 'Queries cards with next_review_date <= NOW(), implements SM-2 algorithm'
      },
      {
        element: 'Card Rating (Study)',
        action: 'Rate recall difficulty (Again, Hard, Good, Easy)',
        outcome: 'Updates next review date based on rating',
        technicalDetails: 'SM-2 spaced repetition algorithm adjusts next_review_date'
      },
      {
        element: 'Flip Card',
        action: 'Click to reveal answer',
        outcome: 'Shows back of card',
        technicalDetails: 'Toggle state between front and back'
      },
      {
        element: 'Shuffle Deck',
        action: 'Randomize card order',
        outcome: 'Studies in random sequence',
        technicalDetails: 'Array shuffle on study session start'
      },
      {
        element: 'Import/Export Deck',
        action: 'Import from CSV or export deck data',
        outcome: 'Bulk card management',
        technicalDetails: 'CSV parsing with papaparse'
      },
      {
        element: 'Back Button',
        action: 'Return to Notes page',
        outcome: 'Navigates back',
        technicalDetails: 'Router navigation via onBack prop'
      }
    ],
    dataDisplayed: [
      {
        field: 'Flashcards',
        source: 'student_flashcards WHERE deck_id=:deckId',
        significance: 'All cards in selected deck'
      },
      {
        field: 'Card Front/Back',
        source: 'student_flashcards.front_content, back_content',
        significance: 'Question and answer'
      },
      {
        field: 'Review Schedule',
        source: 'flashcard_progress.next_review_date',
        calculation: 'When card should be reviewed next (SM-2 algorithm)',
        significance: 'Spaced repetition timing'
      },
      {
        field: 'Mastery Level',
        source: 'flashcard_progress.mastery_level',
        calculation: 'Increasing with successful reviews',
        significance: 'How well student knows card'
      },
      {
        field: 'Review History',
        source: 'flashcard_review_log',
        significance: 'Past performance on each card'
      }
    ],
    relatedFeatures: ['Spaced Repetition', 'Active Recall', 'Study Sessions', 'Memory Retention']
  },
  {
    id: 'student-progress-tab',
    section: 'study',
    subsection: 'Progress Tracking',
    title: 'Progress Tab - Study Analytics',
    description: 'Analytics for note-taking activity, flashcard mastery, and file organization.',
    userPurpose: 'Track study tool usage and effectiveness.',
    route: '/dashboard/learner/notes#progress',
    component: 'ProgressSection',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Notes Statistics',
        action: 'Shows total notes, recent activity',
        outcome: 'Track note-taking habits',
        technicalDetails: 'COUNT of notes, recent notes created'
      },
      {
        element: 'Flashcard Mastery Stats',
        action: 'Displays mastered vs. learning cards',
        outcome: 'See flashcard progress',
        technicalDetails: 'Breakdown of cards by mastery level'
      },
      {
        element: 'Study Streak',
        action: 'Days with consecutive flashcard study',
        outcome: 'Encourages daily review',
        technicalDetails: 'Streak calculation from flashcard_review_log'
      },
      {
        element: 'File Storage Usage',
        action: 'Shows storage space used',
        outcome: 'Monitor file uploads',
        technicalDetails: 'SUM of file sizes from storage'
      }
    ],
    dataDisplayed: [
      {
        field: 'Total Notes',
        source: 'COUNT(student_notes)',
        significance: 'Note-taking activity level'
      },
      {
        field: 'Total Flashcards',
        source: 'COUNT(student_flashcards)',
        significance: 'Flashcard library size'
      },
      {
        field: 'Flashcard Mastery Breakdown',
        source: 'flashcard_progress grouped by mastery_level',
        significance: 'Learning vs. mastered distribution'
      },
      {
        field: 'Study Frequency',
        source: 'flashcard_review_log',
        calculation: 'Review sessions per week',
        significance: 'Study consistency'
      }
    ],
    relatedFeatures: ['Learning Analytics', 'Study Habits', 'Progress Tracking']
  },
  {
    id: 'student-spaced-repetition',
    section: 'study',
    subsection: 'Study Science',
    title: 'Spaced Repetition Algorithm (SM-2)',
    description: 'Intelligent scheduling of flashcard reviews based on memory science for optimal retention.',
    userPurpose: 'Maximize long-term memory retention through scientifically-proven review timing.',
    route: '/dashboard/learner/flashcards (embedded in study)',
    component: 'SM-2 algorithm implementation',
    accessLevel: ['student'],
    interactions: [
      {
        element: 'Algorithm Explanation',
        action: 'System automatically schedules reviews',
        outcome: 'Cards appear when optimal for memory retention',
        technicalDetails: 'SM-2 (SuperMemo 2) spaced repetition algorithm'
      },
      {
        element: 'Rating Impact',
        action: 'User rating (Again/Hard/Good/Easy) affects next review',
        outcome: 'Poor ratings shorten interval, good ratings lengthen it',
        technicalDetails: 'Algorithm adjusts easiness factor and interval based on rating'
      },
      {
        element: 'Graduated Intervals',
        action: 'As card is mastered, review intervals increase (1d, 3d, 7d, 14d, 30d, etc.)',
        outcome: 'Less frequent review for mastered content',
        technicalDetails: 'Exponential interval growth based on easiness factor'
      }
    ],
    dataDisplayed: [
      {
        field: 'Next Review Date',
        source: 'flashcard_progress.next_review_date',
        calculation: 'Calculated by SM-2 based on last review and rating',
        significance: 'When card should be studied next'
      },
      {
        field: 'Easiness Factor',
        source: 'flashcard_progress.easiness_factor',
        calculation: 'Adjusted by user ratings (increased for Easy, decreased for Again)',
        significance: 'How easy the card is to remember'
      },
      {
        field: 'Review Interval',
        source: 'flashcard_progress.interval_days',
        calculation: 'Days until next review',
        significance: 'Time between reviews'
      }
    ],
    relatedFeatures: ['Flashcard Study', 'Memory Science', 'Long-term Retention']
  }
];
