import { ipcMain } from 'electron';
import type { DiscordService, EpisodeData } from './discord-rpc';

/**
 * Register episode metadata IPC handlers for Discord Rich Presence.
 *
 * The website bridges between the player iframe (postMessage) and main process (IPC).
 * episode:update — sent on episode change with title, season, episode, translator, posterUrl.
 * episode:playState — sent when website receives currentTime postMessage from player.
 * episode:idle — sent when player is closed or navigated away.
 */
export function registerDiscordIpc(
  getDiscord: () => DiscordService | null,
): void {
  let lastEpisodeData: Omit<EpisodeData, 'isPlaying' | 'startTimestamp'> | null = null;

  ipcMain.on('episode:update', (_event, data: Omit<EpisodeData, 'isPlaying' | 'startTimestamp'>) => {
    lastEpisodeData = data;
    getDiscord()?.updateActivity({ ...data, isPlaying: true, startTimestamp: Date.now() });
  });

  ipcMain.on('episode:playState', (_event, isPlaying: boolean) => {
    if (lastEpisodeData) {
      getDiscord()?.updateActivity({
        ...lastEpisodeData,
        isPlaying,
        startTimestamp: isPlaying ? Date.now() : undefined,
      });
    }
  });

  ipcMain.on('episode:idle', () => {
    lastEpisodeData = null;
    getDiscord()?.setIdle();
  });
}
