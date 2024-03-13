import { createApp } from 'vue';

import { registerPlugins } from '@/plugins';
import App from './App.vue';

// Create and register app
const app = createApp(App);
registerPlugins(app);
app.mount('#app');
