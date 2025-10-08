export async function hardResetApp() {
  try {
    // 1. Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // 2. Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // 3. Clear IndexedDB (photos)
    if ('indexedDB' in window) {
      // Try using databases() if available (not supported in Safari/iOS)
      if (indexedDB.databases) {
        try {
          const databases = await indexedDB.databases();
          for (const db of databases) {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          }
        } catch (e) {
          // Fall back to deleting known database
          indexedDB.deleteDatabase('PhotoWalletDB');
        }
      } else {
        // Safari/iOS fallback - delete known database by name
        indexedDB.deleteDatabase('PhotoWalletDB');
      }
    }

    // 4. Clear localStorage
    localStorage.clear();

    // 5. Clear sessionStorage
    sessionStorage.clear();

    // 6. Force reload from server (bypass cache)
    window.location.reload();
  } catch (error) {
    console.error('Error during hard reset:', error);
    // Fallback: try to delete known database and reload
    try {
      indexedDB.deleteDatabase('PhotoWalletDB');
    } catch (e) {
      // Ignore errors
    }
    window.location.reload();
  }
}
