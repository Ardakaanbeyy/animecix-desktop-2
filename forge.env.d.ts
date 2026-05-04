/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CDN_DOMAIN: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_DISCORD_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
