# Welcome to Siege Randomizer!

Siege Randomizer is a small web-app with several tools to randomize your Siege-experience. It currently features a Map Picker, an Operator Picker and a Strat Roulette, all are still to be expanded on.

##  Technical Stuff

Siege Randomizer is built with [TypeScript](https://www.typescriptlang.org), [Vue 3](https://vuejs.org) and [Vuetify](https://vuetifyjs.com).

### Dependencies

* [NodeJS](https://nodejs.org/)

####  Optional Dependencies

These only need to be installed if you're testing github workflows locally (using the `workflow`-scripts).

* [Docker](https://www.docker.com/)
* [Act](https://github.com/nektos/act)

---

### Environment Variables

Variable Name        | Default Value                       | Description
:------------------- |:----------------------------------- |:-----------
`APP_NAME`           | `Siege Randomizer`                  | The display name of the app.
`APP_REPOSITORY`     |                                     | The link to the GitHub project.
`APP_VERSION`        | `version` value from `package.json` | The version number of the app.
`SERVER_PORT`        | `3000`                              | The port to host the development server on.
`SERVER_BASE_URI`    | `/`                                 | The base URL of the server. Should start end end with a `/` (ex. `/siege-randomizer/`).
`REMOTE_ASSETS_HOST` | the local `src/assets` folder       | The URL where app assets are hosted
`REMOTE_DATA_HOST`   | the local `src/data` folder         | The URL where app data is hosted

---

### Commands

```shell
npm install          # Install packages
npm run dev          # Run a development build
npm run host         # Run a development build and expose the port to the local network
npm run build        # Create an app build and type-check the project
npm run build-only   # Create an app build
npm run type-check   # Type-check the project
npm run preview      # Preview an app build

# The following require Docker and Act to be installed (see optional dependencies)
npm run workflow-test     # Run the test workflow
npm run workflow-build    # Run the build workflow
npm run workflow-deploy   # Run the deploy workflow
```

##  Disclaimer

I don't own Tom Clancy's Rainbow Six: Siege, its Maps, Operators or Squads. The brand, the used Operator Portraits, Operator Emblems, Squad Emblems and Map Images all belong to Ubisoft.
