import { ipcMain } from 'electron';
import type { StreamCache } from './StreamCache';

/**
 * Register cache episode lifecycle IPC handler for transparent auto-caching.
 *
 * cache:setCurrentEpisode — Called by the website when a new episode loads.
 * Finalizes the previous episode's cache and starts tracking the new one.
 */
export function registerCacheIpc(cache: StreamCache): void {
  let currentCachingEpisodeId: string | null = null;

  ipcMain.handle('cache:setCurrentEpisode', async (_event, episodeId: string, subs: { language: string; url: string }[]) => {
    if (currentCachingEpisodeId && currentCachingEpisodeId !== episodeId) {
      cache.finalizeEpisodeCache(currentCachingEpisodeId);
    }
    currentCachingEpisodeId = episodeId;
    cache.setCurrentEpisode(episodeId, subs);
  });
}
