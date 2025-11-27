# Organization Components

## OrgButton

A standardized button component for organization pages that ensures proper text contrast on dark/purple backgrounds.

### Problem It Solves

Organization pages use an `.org-tile` CSS class that applies `color: hsl(0 0% 12%) !important;` to all child elements for consistent styling. This causes buttons with dark backgrounds (like `variant="default"` which has a purple background) to have dark text on dark backgrounds, making them unreadable.

### Solution

The `OrgButton` component uses `!important` CSS rules to force white text on dark button variants, overriding the `.org-tile` color inheritance.

### Usage

Replace all `Button` components in organization pages with `OrgButton`:

```tsx
// Before
import { Button } from '@/components/ui/button';

// After
import { OrgButton } from '@/components/org/OrgButton';
// or
import { OrgButton as Button } from '@/components/org/OrgButton';

// Usage is identical
<OrgButton variant="default">Click Me</OrgButton>
```

### Features

- Automatically forces white text on dark variants (`default`, `destructive`)
- Maintains all other Button props and functionality
- Works seamlessly with all button sizes and variants
- Ensures proper contrast ratios for accessibility

### When to Use

Use `OrgButton` in:
- All components in `src/components/org/`
- All pages in `src/pages/organizations/`
- Any component that renders buttons inside `.org-tile` containers

### When NOT to Use

Continue using the standard `Button` for:
- Non-organization pages
- Components that don't render within `.org-tile` contexts
- Global components that need standard button styling
