import { createRouter, createWebHistory } from 'vue-router';

import {
  MapPicker,
  OperatorPicker,
  StratPicker,
  UnderConstruction
} from '@/views';

const routes = [
  {
    path: '/',
    redirect: '/maps'
  },
  {
    path: '/lineups',
    name: 'lineup-picker',
    component: UnderConstruction
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
    component: UnderConstruction
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
