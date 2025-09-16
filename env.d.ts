/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_REPOSITORY: string;
  readonly VITE_APP_VERSION: string;

  readonly VITE_REMOTE_DATA_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
