# FPK ISOS TypeScript Conversion Guide

## Overview

This document provides a complete guide for integrating the converted TypeScript components from the Horizons prototype into your production FPK University codebase.

## What Was Converted

**Total Files Converted:** 79 React components
- **Admin Components:** 26 files
- **Teacher Components:** 17 files  
- **Student Components:** 15 files
- **Shared UI Components:** 10 files
- **Layouts:** 3 files
- **Core Files:** 8 files (App, Landing, utilities, etc.)

## Folder Structure

```
src/
├── components/
│   ├── ui/                    # Shared UI primitives (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ... (10 files total)
│   │
│   ├── common/                # Shared application components
│   │   └── AIAssistant.tsx
│   │
│   └── admin/                 # Top-level role-specific components
│       ├── AdminPanel.tsx
│       ├── Dashboard.tsx
│       └── ...
│
├── features/                  # Feature-based organization
│   ├── admin/                 # Admin-specific features
│   │   ├── AICoachManager.tsx
│   │   ├── AIGovernance.tsx
│   │   ├── ISOSDashboard.tsx
│   │   ├── ITPortal.tsx
│   │   └── ... (26 files total)
│   │
│   ├── teacher/               # Teacher-specific features
│   │   ├── TeacherOverview.tsx
│   │   ├── TeacherAttendance.tsx
│   │   ├── TeacherGradebook.tsx
│   │   └── ... (17 files total)
│   │
│   └── student/               # Student-specific features
│       ├── StudentOverview.tsx
│       ├── StudentCourses.tsx
│       ├── StudentLearning.tsx
│       └── ... (15 files total)
│
├── layouts/                   # Page layout wrappers
│   ├── AdminLayout.tsx
│   ├── TeacherLayout.tsx
│   └── StudentLayout.tsx
│
├── pages/                     # Top-level route components
│   └── Landing.tsx
│
├── lib/                       # Utility functions
│   └── utils.ts
│
├── types/                     # TypeScript type definitions
│   └── index.ts               # Centralized type exports
│
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## Key TypeScript Patterns Used

### 1. Component Props Interfaces

Every component has a clearly defined props interface:

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtext?: string;  // Optional prop
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, subtext }) => {
  // Component implementation
};
```

### 2. State Typing

All `useState` hooks are properly typed:

```typescript
const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [students, setStudents] = useState<Student[]>([]);
```

### 3. Event Handlers

Event handlers have explicit types:

```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle form submission
};

const handleClick = (id: string) => {
  // Handle click
};
```

### 4. Shared Types

Common types are defined in `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  // ... other properties
}
```

## Integration Steps

### Step 1: Install Dependencies

```bash
npm install typescript @types/react @types/react-dom
npm install framer-motion lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-slider
```

### Step 2: Copy TypeScript Configuration

Use the provided `tsconfig.json` in the root of this directory.

### Step 3: Integrate Components

1. **Copy the `src/` folder** from this conversion into your existing project
2. **Merge with existing files:**
   - If you already have a `components/ui/` folder, compare and merge
   - If you already have an `App.tsx`, integrate the routing logic
3. **Update import paths** to match your project structure

### Step 4: Update Routing

In your main `App.tsx`, add routes for the new dashboards:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/teacher/*" element={<TeacherLayout />} />
        <Route path="/student/*" element={<StudentLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 5: Connect to Supabase

Replace mock data with real Supabase queries. Example:

```typescript
// Before (mock data)
const [students, setStudents] = useState<Student[]>([
  { id: '1', name: 'John', grade: 85 }
]);

// After (Supabase)
import { supabase } from '@/lib/supabase';

const [students, setStudents] = useState<Student[]>([]);

useEffect(() => {
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    
    if (data) setStudents(data);
  };
  
  fetchStudents();
}, []);
```

## File-by-File Conversion Notes

### Admin Components

- **ISOSDashboard.tsx**: Main command center, fully typed with StatCard and QuickAction sub-components
- **ITPortal.tsx**: Complete IT management interface with plugin configuration
- **AIGovernance.tsx**: AI model and rules management with full type safety
- **StudentInfoSystem.tsx**: SIS with form validation types

### Teacher Components

- **TeacherGradebook.tsx**: Gradebook with Student and Grade interfaces
- **TeacherAttendance.tsx**: Attendance tracking with date and status types
- **TeacherTools.tsx**: AI tools suite with proper tool configuration types

### Student Components

- **StudentLearning.tsx**: AI Learning Hub with course recommendation types
- **StudentCourses.tsx**: Course management with enrollment types
- **StudentReports.tsx**: Report viewing with grade and assessment types

## Common Issues & Solutions

### Issue 1: Import Path Errors

**Problem:** `Cannot find module '@/components/ui/button'`

**Solution:** Ensure your `tsconfig.json` has the path alias configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 2: Type Errors with Lucide Icons

**Problem:** `Type 'LucideIcon' is not assignable to type 'ComponentType'`

**Solution:** Use the correct icon type:

```typescript
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
}
```

### Issue 3: Missing UI Component Types

**Problem:** `Property 'variant' does not exist on type 'ButtonProps'`

**Solution:** Ensure you're using the shadcn/ui components or define the variant types:

```typescript
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // ... other props
}
```

## Next Steps

1. **Test Each Dashboard**: Navigate to each role's dashboard and verify functionality
2. **Connect Real Data**: Replace all mock data with Supabase queries
3. **Add Authentication**: Integrate with your existing auth system
4. **Implement RLS Policies**: Ensure proper row-level security in Supabase
5. **Add Error Handling**: Implement proper error boundaries and loading states
6. **Performance Optimization**: Add React.memo, useMemo, and useCallback where needed

## Support

For questions or issues during integration, refer to:
- TypeScript documentation: https://www.typescriptlang.org/docs/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Supabase TypeScript guide: https://supabase.com/docs/guides/api/typescript-support

---

**Conversion completed:** December 3, 2025
**Total components converted:** 79
**Estimated integration time:** 4-6 hours
