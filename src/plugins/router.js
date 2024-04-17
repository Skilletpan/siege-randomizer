import { createRouter, createWebHashHistory } from 'vue-router';

import { Home, MapPicker, OperatorPicker, StratPicker, TeamPicker } from '@/views';

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/maps',
      name: 'map-picker',
      component: MapPicker
    },
    {
      path: '/operators',
      name: 'operator-picker',
      component: OperatorPicker
    },
    {
      path: '/strats',
      name: 'strat-picker',
      component: StratPicker
    },
    {
      path: '/teams',
      name: 'team-picker',
      component: TeamPicker
    }
  ]
});
