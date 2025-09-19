/** The environment variable values of the app. */
export default Object.freeze({
  /** The display name of the app. */
  APP_NAME: import.meta.env.VITE_APP_NAME,

  /** The URL to the repository of the app. */
  APP_REPOSITORY: import.meta.env.VITE_APP_REPOSITORY || null,

  /** The version of the app. */
  APP_VERSION: import.meta.env.VITE_APP_VERSION,

  /** The URL where application assets are hosted. */
  REMOTE_ASSETS_HOST: import.meta.env.VITE_REMOTE_ASSETS_HOST || null,

  /** The URL where application data is hosted. */
  REMOTE_DATA_HOST: import.meta.env.VITE_REMOTE_DATA_HOST || null
});
