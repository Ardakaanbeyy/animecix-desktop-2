import { ipcMain, BrowserWindow, shell } from 'electron';

export function registerWindowIpc(win: BrowserWindow): void {
  // Window control handlers
  ipcMain.handle('window:minimize', () => {
    win.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.handle('window:close', () => {
    win.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return win.isMaximized();
  });

  // D-09: setFullscreen IPC handler. Renderer (animecix.tv) calls this in response to
  // postMessage from the player iframe (Plan 05). Boolean(...) coercion is defense-in-depth
  // per RESEARCH.md ASVS V5 — contextBridge can serialize unexpected values to null/undefined.
  // The async OS fullscreen transition is reported back via the existing
  // enter-full-screen / leave-full-screen listeners below (D-11 — no new event source).
  ipcMain.handle('window:setFullscreen', (_event, fullscreen: boolean) => {
    win.setFullScreen(Boolean(fullscreen));
  });

  // Open URL in system default browser (used by Angular for Google OAuth).
  // Angular sends relative URLs like "secure/auth/social/google/login" —
  // prepend site base URL when not absolute (matches old app's APP_URL behavior).
  ipcMain.handle('window:openLink', (_event, url: string) => {
    let fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = import.meta.env.VITE_SITE_URL + '/' + url;
    }
    try {
      const parsed = new URL(fullUrl);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        void shell.openExternal(fullUrl);
      }
    } catch { /* invalid URL */ }
  });

  // Fullscreen event notifications to renderer
  win.on('enter-full-screen', () => {
    win.webContents.send('window:fullscreen-changed', true);
  });

  win.on('leave-full-screen', () => {
    win.webContents.send('window:fullscreen-changed', false);
  });
}
