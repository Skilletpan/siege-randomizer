import { createRouter, createWebHashHistory } from 'vue-router';

import * as Views from '@/views';

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Views.HomeView
    }
  ]
});
