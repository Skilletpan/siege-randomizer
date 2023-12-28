import { createRouter, createWebHashHistory } from 'vue-router';

import {
  MapPicker,
  OperatorPicker,
  StratPicker
} from '@/views';

const routes = [
  {
    path: '/',
    redirect: '/maps'
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
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
