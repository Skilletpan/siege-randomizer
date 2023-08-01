import { createRouter, createWebHistory } from 'vue-router'

import {
  HomeView,
  LineupPicker,
  MapPicker,
  OperatorPicker,
  TeamPicker,
  StratPicker
} from '@/views';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/lineup',
    name: 'lineup-picker',
    component: LineupPicker
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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
