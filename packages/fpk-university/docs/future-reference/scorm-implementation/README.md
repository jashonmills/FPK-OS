# SCORM Reference Implementation

> **⚠️ IMPORTANT: This is reference material only**  
> This directory contains a SCORM 1.2 implementation that was researched but **not deployed** in the FPK University platform.  
> 
> **Current Architecture:** Games use unauthenticated iframe embedding (no tracking).  
> **Future Architecture:** Unified Auth & Direct Database Writes (see `docs/DECISION_LOG_GAME_TRACKING.md`).  
> 
> This SCORM implementation is preserved for reference purposes and potential future LMS export features.

---

# SCORM 1.2 Package Structure (Reference)

This directory contains a complete SCORM 1.2 package structure for trackable learning games.

## Structure

Each game package follows this structure:
```
game-name-scorm/
├── game/                     // Actual game files (HTML, CSS, JS, assets)
├── imsmanifest.xml          // SCORM manifest (required by LMS)
├── SCORM_API_wrapper.js     // Standard SCORM communication library
└── index.html               // Entry point that launches the game
```

## Current Packages

### Addition Journey Quest
- **Path**: `addition-journey-quest-scorm/`
- **Status**: Foundation complete, awaiting game files
- **Next Steps**: 
  1. Place game files in the `game/` folder
  2. Add file references to `imsmanifest.xml`
  3. Modify game code to call `window.parent.setComplete(score)` on completion
  4. Create ZIP package for LMS upload

## Creating a ZIP Package

To create a deployable SCORM package:
1. Navigate into the game folder (e.g., `addition-journey-quest-scorm/`)
2. Select ALL files and folders inside (not the parent folder itself)
3. Create a ZIP archive
4. Upload to your LMS

## Integration with Game Code

Games need to report completion by calling the parent window's `setComplete` function:

```javascript
// In your game's JavaScript, when the game ends:
var finalScore = 85; // The player's score

// Report to SCORM wrapper
if (window.parent && window.parent.setComplete) {
  window.parent.setComplete(finalScore, 100, 0); // score, max, min
}
```
