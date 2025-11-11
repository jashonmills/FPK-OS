// Service Worker for Web Push Notifications
// This file handles push notifications when the app is closed or in background

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {}
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        data: payload.data || notificationData.data,
        tag: payload.tag || 'notification',
        requireInteraction: false,
        // Add vibration pattern for mobile
        vibrate: [200, 100, 200]
      };
    }
  } catch (error) {
    console.error('Error parsing push notification data:', error);
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate
    }
  );

  event.waitUntil(promiseChain);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  // Determine the URL to open
  let urlToOpen = '/';
  
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  } else if (event.notification.data && event.notification.data.conversation_id) {
    urlToOpen = `/messages/${event.notification.data.conversation_id}`;
  }

  // Open or focus the app window
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // Check if there's already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then(client => {
            // Navigate to the URL
            if ('navigate' in client) {
              return client.navigate(urlToOpen);
            }
          });
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});