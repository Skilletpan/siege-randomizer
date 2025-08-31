/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_PORT: number;
  readonly VITE_HOST_URI: string;

  readonly VITE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
