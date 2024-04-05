import { createPinia } from 'pinia';

import router from './router';
import vuetify from './vuetify';

export function registerPlugins(app) {
  app.use(createPinia());
  app.use(router);
  app.use(vuetify);
}
