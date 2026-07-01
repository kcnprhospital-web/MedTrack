/* ============================================================
   MedTrack Service Worker — firebase-messaging-sw.js
   ------------------------------------------------------------
   Raw Web Push service worker — no Firebase SDK involved.
   Kept at firebase-messaging-sw.js so existing deployed URL
   continues to work without any GitHub Pages path change.
   ============================================================ */

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) { data = { title: 'MedTrack', body: e.data ? e.data.text() : '' }; }

  const title = data.title || 'MedTrack';
  const options = {
    body: data.body || '',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    tag: data.tag || 'medtrack-dose',
    requireInteraction: true,
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes(self.registration.scope) && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
