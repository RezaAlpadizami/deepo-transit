import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));
const MasterCity = React.lazy(() => import('../screens/master-screens/city/index'));
const CategoryScreens = React.lazy(() => import('../screens/master-screens/category-screens/index'));
const CategoryScreensAdd = React.lazy(() => import('../screens/master-screens/category-screens/add-category'));

export default [
  {
    displayName: 'Home',
    name: 'home',
    role: 'home',
    showmenu: true,
    exact: true,
    route: '/',
    component: Home,
  },
  {
    displayName: 'Master',
    name: 'master',
    role: 'master',
    showmenu: true,
    exact: true,
    route: '/master',
    component: MasterCity,
    routes: [
      {
        displayName: 'Category',
        icon: HomeIcon,
        name: 'master-category',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/category',
        component: CategoryScreens,
        routes: [
          {
            displayName: 'Add Category',
            name: 'master-category-add',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/category/add',
            component: CategoryScreensAdd,
          },
        ],
      },
      {
        displayName: 'X',
        icon: HomeIcon,
        name: 'master-x',
        role: 'master',
        showmenu: false,
        exact: true,
        route: '/master/x',
        component: MasterCity,
      },
    ],
  },
  {
    displayName: '404',
    name: '404',
    showmenu: false,
    exact: false,
    route: '/*',
    component: NotFound,
  },
];
