import {
  createRouter, createWebHashHistory, RouteRecordRaw,
} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MoviesView from '../views/MoviesView.vue';
import MovieView from '../views/MovieView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/movies',
    name: 'movies',
    component: MoviesView,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/movies/:id',
    component: MovieView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
