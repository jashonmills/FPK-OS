# Prompt Bible - Modular Architecture

## Overview

This directory contains the **Prompt Bible**—a modular, component-based system for managing AI persona prompts. Instead of monolithic, hard-to-maintain prompt files, we organize prompts like a well-structured codebase.

## Directory Structure

```
/src/prompts/
├── core/                    # Shared core rules for all personas
│   ├── safety_and_ethics.md
│   ├── tone_of_voice.md
│   └── language_and_style.md
│
├── personas/                # Persona-specific core behaviors
│   ├── betty_socratic_core.md
│   ├── al_direct_expert_core.md
│   └── al_socratic_support.md
│
├── skills/                  # Reusable skills and techniques
│   ├── vary_affirmations.md
│   ├── handle_typos.md
│   ├── no_meta_reasoning.md
│   └── session_initialization.md
│
├── index.ts                 # Assembler - builds final prompts
└── README.md               # This file
```

## Philosophy

### The Problem with Monolithic Prompts

As AI systems evolve, prompt files grow into 500+ line "God Prompts" that are:
- **Hard to maintain**: One change requires scanning hundreds of lines
- **Difficult to test**: Can't isolate which rule caused an issue
- **Not reusable**: Same rules copy-pasted across personas
- **Prone to conflicts**: Contradictory instructions hidden in the bulk

### The Solution: Modular Components

Each file is a focused "module" containing one set of related rules:
- **Core modules**: Universal rules (safety, tone, style)
- **Persona modules**: Identity and core behavior for each AI character
- **Skill modules**: Specific capabilities (handling typos, varying language, etc.)

The `index.ts` file **assembles** these modules into complete system prompts.

## Benefits

### ✅ Maintainability
To update how Betty varies her affirmations, edit one 30-line file, not a 500-line prompt.

### ✅ Reusability (DRY Principle)
Safety and tone rules are written once, shared by all personas.

### ✅ Flexibility
Want to experiment with a "Betty without typo handling"? Just remove one module from the assembly.

### ✅ Clear Separation
The rules (markdown files) are separate from the assembly logic (TypeScript).

### ✅ Version Control Friendly
Git diffs are clean and focused on the actual change, not scattered across a huge file.

## Usage

### For Developers

**Building Betty's Prompt:**
```typescript
import { buildBettyPrompt } from '@/prompts';

const bettySystemPrompt = buildBettyPrompt();
// Use in your LLM call
```

**Building Al's Prompt:**
```typescript
import { buildAlPrompt, buildAlSocraticSupportPrompt } from '@/prompts';

// For direct answer mode
const alPrompt = buildAlPrompt();

// For Socratic support mode (factual injections)
const alSupportPrompt = buildAlSocraticSupportPrompt();
```

**Debugging a Module:**
```typescript
import { getModulePreview } from '@/prompts';

console.log(getModulePreview('vary_affirmations'));
```

### For Prompt Engineers

1. **To add a new rule**: Create a new `.md` file in the appropriate directory
2. **To modify behavior**: Edit the relevant module file
3. **To create a new persona**: Create a new persona core file and assembly function
4. **To experiment**: Duplicate an assembly function and modify the module list

## Assembly Logic

The `index.ts` file contains builder functions like:

```typescript
export function buildBettyPrompt(): string {
  const modules = [
    NO_META_REASONING,
    BETTY_CORE,
    VARY_AFFIRMATIONS,
    HANDLE_TYPOS,
    SESSION_INITIALIZATION,
    TONE_OF_VOICE,
    LANGUAGE_AND_STYLE,
    SAFETY_AND_ETHICS,
  ];
  
  return modules.join(MODULE_SEPARATOR);
}
```

Order matters:
1. **Meta-rules** (like "no meta-reasoning") come first
2. **Core persona** defines the primary identity
3. **Skills** add specific capabilities
4. **Universal rules** (tone, safety) come last

## Adding New Modules

### Step 1: Create the Module File

```markdown
# Skill: Your Skill Name

## The Problem
[Describe what this solves]

## The Rule
[State the rule clearly]

## Examples
[Provide examples]

## Why This Matters
[Explain the impact]
```

### Step 2: Import in index.ts

```typescript
import YOUR_SKILL from './skills/your_skill.md?raw';
```

### Step 3: Add to Relevant Assembly Functions

```typescript
export function buildBettyPrompt(): string {
  const modules = [
    // ... existing modules
    YOUR_SKILL,
    // ... more modules
  ];
  return modules.join(MODULE_SEPARATOR);
}
```

## Module Guidelines

### Do's ✅

- **Be Specific**: Each module should have one clear purpose
- **Use Examples**: Show correct and incorrect behaviors
- **Explain Impact**: Say why this rule matters
- **Keep it Short**: 20-50 lines per module is ideal

### Don'ts ❌

- **No Overlap**: Don't repeat rules across modules
- **No Ambiguity**: Rules should be clear and actionable
- **No Contradictions**: Check that new rules don't conflict with existing ones
- **No Bloat**: If a module gets too long, split it

## Testing Changes

1. **Modify a module**: Edit the relevant `.md` file
2. **Rebuild the prompt**: The assembly happens automatically on import
3. **Test the behavior**: Use the AI with the updated prompt
4. **Iterate**: Refine based on results

## Migration from Legacy Prompts

Old monolithic prompts in `supabase/functions/ai-study-chat/constants.ts` are being replaced by this system. The edge functions will be updated to import from this new architecture.

## Version Control

- Each module file is version-controlled independently
- Git history shows exactly what changed in which rule
- Rollbacks are precise and targeted

## Future Extensions

Potential additions:
- **Context modules**: Rules that apply only in specific contexts (e.g., math vs. history)
- **Adaptive modules**: Rules that adjust based on student performance
- **Language modules**: Multi-language support
- **Compliance modules**: Domain-specific regulations (FERPA, COPPA, etc.)

---

**Last Updated**: 2025
**Maintained By**: FPK University Development Team
