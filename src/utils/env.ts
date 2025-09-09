/** The environment variable values of the app. */
export default Object.freeze({
  /** The display name of the app. */
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Siege Randomizer',

  /** The URL to the repository of the app. */
  APP_REPOSITORY: import.meta.env.VITE_APP_REPOSITORY || 'https://github.com/Skilletpan/siege-randomizer',

  /** The version of the app. */
  APP_VERSION: import.meta.env.VITE_APP_VERSION
});
