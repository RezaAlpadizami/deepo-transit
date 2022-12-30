import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/transit-screens/warehouse-selection/index'));

const RequestScreens = React.lazy(() => import('../screens/transit-screens/request-screens/index'));
const RequestScreensAdd = React.lazy(() => import('../screens/transit-screens/request-screens/add'));
const RequestScreenShow = React.lazy(() => import('../screens/transit-screens/request-screens/show'));
const RequestScreenEdit = React.lazy(() => import('../screens/transit-screens/request-screens/edit'));

export default [
  {
    displayName: 'Transit',
    icon: HomeIcon,
    name: 'transit',
    role: 'transit',
    showmenu: false,
    exact: true,
    route: '/',
    component: Home,
    routes: [
      {
        displayName: 'Request',
        icon: HomeIcon,
        name: 'transit-request',
        role: 'transit-request',
        showmenu: true,
        exact: true,
        route: '/request',
        component: RequestScreens,
      },
      {
        displayName: 'Create Request',
        icon: HomeIcon,
        name: 'transit-request-add',
        role: 'transit-request',
        showmenu: false,
        exact: true,
        route: '/request/add',
        component: RequestScreensAdd,
      },
      {
        displayName: 'Detail Request',
        icon: HomeIcon,
        name: 'transit-request-show',
        role: 'transit-request',
        showmenu: false,
        exact: true,
        route: '/request/:id/show',
        component: RequestScreenShow,
      },
      {
        displayName: 'Edit Detail Request',
        name: 'transit-request-edit',
        role: 'transit-request',
        showmenu: false,
        exact: true,
        route: '/request/:id/edit',
        component: RequestScreenEdit,
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
