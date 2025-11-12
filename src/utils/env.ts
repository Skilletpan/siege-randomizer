/** The environment variable values of the app. */
export default Object.freeze({
  /** Information about the app. */
  APP: {
    /** The display name of the app. */
    NAME: import.meta.env.VITE_APP_NAME,

    /** The description of the app (used in `meta`-header). */
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,

    /** The version number of the app. */
    VERSION: import.meta.env.VITE_APP_VERSION
  },

  /** The URLs of external resources. */
  URL: {
    /** The URL where application assets (images) are hosted. */
    ASSETS: import.meta.env.VITE_URL_ASSETS,

    /** The URL where application data is hosted. */
    DATA: import.meta.env.VITE_URL_DATA,

    /** The URL where the change log is hosted. */
    NOTES: import.meta.env.VITE_URL_NOTES,

    /** The URL where the project repository is hosted. */
    REPOSITORY: import.meta.env.VITE_URL_REPOSITORY
  }
});
