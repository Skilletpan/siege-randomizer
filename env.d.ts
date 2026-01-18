/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The display name of the app. */
  readonly VITE_APP_NAME: string;

  /** The description of the app (used in `meta`-header). */
  readonly VITE_APP_DESCRIPTION: string;

  /** The version number of the app. */
  readonly VITE_APP_VERSION: string;

  /** The URL where application assets (images) are hosted. */
  readonly VITE_URL_ASSETS: string;

  /** The URL where application data is hosted. */
  readonly VITE_URL_DATA: string;

  /** The URL where the change log is hosted. */
  readonly VITE_URL_NOTES: string;

  /** The URL where the project repository is hosted. */
  readonly VITE_URL_REPOSITORY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
