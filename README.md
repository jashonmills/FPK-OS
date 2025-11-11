# FPK Nexus - Community Platform

## Project info

**URL**: https://lovable.dev/projects/82f1d6f6-2d72-46ae-8cc7-ab78f6c3d641

## Overview

FPK Nexus is a private, high-trust community platform designed for the neurodiverse world. It features a fully-functional Progressive Web App (PWA) with mobile-first design, offline capabilities, and push notifications.

## Key Features

- 🌐 **Progressive Web App**: Install on any device for a native app experience
- 📱 **Mobile-First Design**: Optimized for all screen sizes with touch-friendly UI
- 🔔 **Push Notifications**: Stay connected with real-time updates
- 💬 **Real-time Messaging**: Connect with community members instantly
- 📊 **Analytics Dashboard**: Track your engagement and community impact
- 🎨 **Customizable Captions**: Personalize your visual content
- 🔒 **Secure & Private**: Built with user privacy and safety in mind

## PWA Features

This app is a fully-featured Progressive Web App with:
- Offline support with service worker caching
- Installable on mobile and desktop
- Push notification support
- Mobile-optimized UI with 44px minimum touch targets
- Safe area insets for notched devices
- Responsive design across all breakpoints

For detailed PWA information, see [PWA_GUIDE.md](./PWA_GUIDE.md)

## Technologies Used

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui components
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **PWA**: vite-plugin-pwa, Workbox
- **Real-time**: Supabase Realtime
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod validation

## Installation (Mobile & Desktop)

### Android / Desktop Chrome
1. Visit the app in Chrome
2. Look for the install banner or click the install icon in the address bar
3. Click "Install" to add to home screen/app drawer

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

## Development Setup

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/82f1d6f6-2d72-46ae-8cc7-ab78f6c3d641) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/82f1d6f6-2d72-46ae-8cc7-ab78f6c3d641) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
