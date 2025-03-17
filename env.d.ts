/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_PORT: number;
  readonly VITE_HOST_URI: string;

  readonly VITE_HOST_ASSETS: string;
  readonly VITE_HOST_DATA: string;

  readonly VITE_OPERATOR_GRID_ROWS: number;
  readonly VITE_OPERATOR_GRID_COLUMNS: number;
  readonly VITE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
