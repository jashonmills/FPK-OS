# FPK Nexus - Progressive Web App Guide

## Overview

FPK Nexus is now a fully-featured Progressive Web App (PWA) with offline capabilities, mobile-first design, and native app-like experience.

## Features Implemented

### 1. **PWA Infrastructure**
- ✅ Service Worker with offline caching
- ✅ Web App Manifest for installability
- ✅ Multiple icon sizes (72x72 to 512x512)
- ✅ iOS and Android optimization
- ✅ Offline fallback page
- ✅ Push notification support

### 2. **Mobile-First Design**
- ✅ Responsive layouts across all pages
- ✅ Touch-friendly UI (44x44px minimum touch targets)
- ✅ Safe area insets for notched devices
- ✅ Optimized typography and spacing
- ✅ Mobile keyboard handling
- ✅ Momentum scrolling (iOS)

### 3. **Performance Optimizations**
- ✅ Asset caching (fonts, images, static files)
- ✅ Service worker with cache-first strategies
- ✅ Lazy loading support ready
- ✅ Optimized bundle via Vite PWA plugin

## Installation Instructions

### Android / Desktop Chrome
1. Visit the app in Chrome
2. Look for the install prompt at the bottom of the screen
3. Click "Install App"
4. The app will be added to your home screen/app drawer

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right corner

### Dismissing the Install Prompt
- Users can dismiss the install prompt
- The prompt won't show again on that device
- To reset: Clear browser data/localStorage

## Technical Details

### Service Worker (`public/sw.js`)
- Handles offline caching
- Manages push notifications
- Provides offline fallback
- Cache version: `fpk-nexus-v1`

### Manifest (`public/manifest.json`)
- App name: "FPK Nexus"
- Theme color: #9575CD (purple)
- Background: #F5F3EF (warm beige)
- Display mode: standalone
- Orientation: any

### PWA Configuration (`vite.config.ts`)
- Automatic service worker generation
- Workbox strategies for caching
- Font and image caching
- Asset precaching

## Mobile Optimizations

### Touch Targets
All interactive elements (buttons, links, inputs) have a minimum size of 44x44px for comfortable touch interaction.

### Safe Area Insets
The app respects safe area insets on devices with notches/rounded corners using CSS environment variables:
- `env(safe-area-inset-top)`
- `env(safe-area-inset-bottom)`
- `env(safe-area-inset-left)`
- `env(safe-area-inset-right)`

### Typography
- Base font size: 16px (prevents auto-zoom on iOS)
- Line height: 1.6 for readability
- Responsive scaling across breakpoints

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Testing Checklist

### Functionality
- [ ] App installs on Android
- [ ] App installs on iOS
- [ ] Offline page displays when network is lost
- [ ] Push notifications work
- [ ] All pages are responsive
- [ ] Touch targets are adequate

### Performance
- [ ] Lighthouse PWA score > 90
- [ ] Lighthouse Performance score > 90
- [ ] Assets load from cache
- [ ] Service worker activates properly

### Cross-Browser
- [ ] Chrome (Android/Desktop)
- [ ] Safari (iOS/macOS)
- [ ] Firefox (Android/Desktop)
- [ ] Edge (Desktop)

## Maintenance

### Updating the Service Worker
When making changes to cached assets, increment the `CACHE_NAME` version in `public/sw.js`:

```javascript
const CACHE_NAME = 'fpk-nexus-v2'; // Increment version
```

### Adding New Icons
Place new icons in `public/icons/` and update `manifest.json`:

```json
{
  "src": "/icons/icon-[size]x[size].png",
  "sizes": "[size]x[size]",
  "type": "image/png"
}
```

### Customizing Install Prompt
Edit `src/components/pwa/InstallPrompt.tsx` to customize the install prompt appearance and behavior.

## Browser Support

- **Chrome/Edge**: Full PWA support
- **Safari**: Install support via "Add to Home Screen"
- **Firefox**: Service Worker and offline support
- **Samsung Internet**: Full PWA support

## Debugging

### View Service Worker
- Chrome: `chrome://serviceworker-internals/`
- Firefox: `about:debugging#/runtime/this-firefox`
- Safari: Develop → Service Workers

### Clear Cache
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Test Offline
1. Open DevTools → Network tab
2. Select "Offline" from throttling dropdown
3. Reload the page

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
