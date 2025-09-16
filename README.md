# Welcome to Siege Randomizer!

Siege Randomizer is a small web-app with several tools to randomize your Siege-experience. It currently features a Map Picker, an Operator Picker and a Strat Roulette, all are still to be expanded on.

##  Technical Stuff

Siege Randomizer is built with [Vue 3](https://vuejs.org) and [Vuetify](https://vuetifyjs.com).

### Environment Variables

Variable Name     | Default Value                       | Description
----------------- | ----------------------------------- | -----------
`APP_NAME`        | `Siege Randomizer`                  | The display name of the app.
`APP_REPOSITORY`  |                                     | The link to the GitHub project.
`APP_VERSION`     | `version` value from `package.json` | The version number of the app.
`SERVER_PORT`     | `3000`                              | The port to host the development server on.
`SERVER_BASE_URI` | `/`                                 | The base URL of the server. Should start end end with a `/` (ex `/siege-randomizer/`).

### Commands

```shell
npm install       # Install packages
npm run dev       # Run a development build
npm run host      # Run a development build and expose the port to the local network
npm run build     # Create an app build
npm run preview   # Preview an app build
```

##  Disclaimer

I don't own Tom Clancy's Rainbow Six: Siege, its Maps, Operators or Squads. The brand, the used Operator Portraits, Operator Emblems, Squad Emblems and Map Images all belong to Ubisoft.
