import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));

const RequestScreens = React.lazy(() => import('../screens/transit-screens/request-screens/index'));
const RequestScreensAdd = React.lazy(() => import('../screens/transit-screens/request-screens/add'));
const RequestScreenShow = React.lazy(() => import('../screens/transit-screens/request-screens/show'));

const InboundScreens = React.lazy(() => import('../screens/transit-screens/inbound-screens/index'));

export default [
  {
    displayName: 'Home',
    name: 'home',
    role: 'home',
    showmenu: false,
    exact: true,
    route: '/',
    component: Home,
  },
  {
    displayName: 'Transit',
    icon: HomeIcon,
    name: 'transit',
    role: 'transit',
    showmenu: false,
    exact: true,
    route: '/request',
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
        routes: [
          {
            displayName: 'Request',
            icon: HomeIcon,
            name: 'request',
            role: 'request',
            showmenu: false,
            exact: true,
            route: '/request',
            component: RequestScreens,
            routes: [
              {
                displayName: 'Create Request',
                icon: HomeIcon,
                name: 'request-add',
                role: 'request',
                showmenu: false,
                exact: true,
                route: '/request/add',
                component: RequestScreensAdd,
              },
              {
                displayName: 'Detail Request',
                icon: HomeIcon,
                name: 'request-show',
                role: 'request',
                showmenu: false,
                exact: true,
                route: '/request/:id/show',
                component: RequestScreenShow,
              },
            ],
          },
        ],
      },
      {
        displayName: 'Inbound',
        icon: HomeIcon,
        name: 'request',
        role: 'request',
        showmenu: true,

        exact: true,
        route: '/inbound',
        component: InboundScreens,
        routes: [
          {
            displayName: 'Inbound',
            icon: HomeIcon,
            name: 'request',
            role: 'request',
            showmenu: false,
            exact: true,
            route: '/inbound',
            component: InboundScreens,
          },
        ],
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
