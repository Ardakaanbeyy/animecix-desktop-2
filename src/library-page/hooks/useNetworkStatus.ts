import { useState, useEffect } from 'react';

export function useNetworkStatus(pollIntervalMs = 5000) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return window.animecix?.isOnline?.() ?? navigator.onLine;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const online = window.animecix?.isOnline?.() ?? navigator.onLine;
      setIsOnline(online);
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [pollIntervalMs]);

  return { isOnline };
}
