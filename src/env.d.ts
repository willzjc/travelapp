/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // Firebase env vars can be removed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
