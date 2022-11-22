import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));
const MasterCity = React.lazy(() => import('../screens/master-screens/city/index'));
const StorageScreens = React.lazy(() => import('../screens/master-screens/storage-screens/index'));
const StorageScreensAdd = React.lazy(() => import('../screens/master-screens/storage-screens/add-storage'));
const StorageScreensDetail = React.lazy(() => import('../screens/master-screens/storage-screens/detail-storage'));

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
    route: '/master/city',
    component: MasterCity,
    routes: [
      {
        displayName: 'Storage',
        icon: HomeIcon,
        name: 'master-storage',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/storage',
        component: StorageScreens,
        routes: [
          {
            displayName: 'Add Storage',
            name: 'master-storage-add',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/storage/add',
            component: StorageScreensAdd,
          },
          {
            displayName: 'Detail Storage',
            name: 'master-storage-detail',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/storage/:id/detail',
            component: StorageScreensDetail,
          },
        ],
      },
      {
        displayName: 'Country',
        icon: HomeIcon,
        name: 'master-country',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/country',
        component: StorageScreens,
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
