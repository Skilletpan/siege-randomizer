import { createRouter, createWebHashHistory } from 'vue-router';

import HelloWorld from '@/components/HelloWorld.vue';
import * as Views from '@/views';

export default createRouter({
  history: createWebHashHistory(import.meta.env.VITE_URI),
  routes: [
    {
      path: '/',
      redirect: '/matchup'
    },
    {
      component: Views.MatchView,
      path: '/matchup',
    },
    {
      component: Views.OperatorView,
      path: '/operators'
    },
    {
      component: Views.LevelView,
      path: '/maps'
    },
    {
      component: HelloWorld,
      path: '/strats'
    }
  ]
});
