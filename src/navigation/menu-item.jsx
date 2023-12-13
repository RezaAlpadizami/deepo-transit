import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';
import { GiHandTruck } from 'react-icons/gi';
import { FaTruckLoading } from 'react-icons/fa';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));

// const RequestScreens = React.lazy(() => import('../screens/transit-screens/request-screens/index'));
// const RequestScreensAdd = React.lazy(() => import('../screens/transit-screens/request-screens/add'));
// const RequestScreenShow = React.lazy(() => import('../screens/transit-screens/request-screens/show'));
// const RequestScreensEdit = React.lazy(() => import('../screens/transit-screens/request-screens/edit'));

const LabelRegistrationScreen = React.lazy(() =>
  import('../screens/transit-screens/registration-screens/label-registration-screens/index')
);
const SettingPathScreen = React.lazy(() => import('../screens/transit-screens/setting-path-screens/index'));

const PanelNotifScreen = React.lazy(() => import('../screens/transit-screens/panel-notif-screens/index'));

const InboundScreens = React.lazy(() => import('../screens/transit-screens/inbound-screens/index'));
const OutboundSCreens = React.lazy(() => import('../screens/transit-screens/outbond-screens/index'));
export default [
  {
    displayName: 'Home',
    name: 'home',
    role: 'home',
    showmenu: false,
    exact: false,
    route: '/',
    component: Home,
  },
  {
    displayName: 'Transit',
    name: 'transit',
    role: 'transit',
    showmenu: false,
    exact: true,
    route: '/request',
    routes: [
      {
        displayName: 'Panel Notif',
        name: 'panel',
        role: 'panel',
        showmenu: false,
        exact: false,
        route: '/panel-notif',
        component: PanelNotifScreen,
      },
      {
        displayName: 'Label Registration',
        name: 'registration',
        role: 'registration',
        showmenu: true,
        exact: true,
        route: '/label-registration',
        component: LabelRegistrationScreen,
        routes: [
          {
            displayName: 'Label Registration',
            name: 'registration',
            role: 'registration',
            showmenu: false,
            exact: true,
            route: '/label-registration',
            component: LabelRegistrationScreen,
          },
          // {
          //   displayName: 'Cancel Label Registration',
          //   name: 'registration-cancel-label',
          //   role: 'registration',
          //   showmenu: true,
          //   exact: true,
          //   route: '/registration/cancel-label-registration',
          //   component: LabelCancelRegistrationScreen,
          // },
        ],
      },
      // {
      //   displayName: 'Request',
      //   icon: FaRegListAlt,
      //   name: 'transit-request',
      //   role: 'transit-request',
      //   showmenu: true,
      //   exact: true,
      //   route: '/request',
      //   component: RequestScreens,
      //   routes: [
      //     {
      //       displayName: 'Request',
      //       icon: HomeIcon,
      //       name: 'transit-request',
      //       role: 'transit-request',
      //       showmenu: false,
      //       exact: true,
      //       route: '/request',
      //     },
      //     {
      //       displayName: 'Create Request',
      //       icon: HomeIcon,
      //       name: 'transit-request-add',
      //       role: 'transit-request',
      //       showmenu: false,
      //       exact: true,
      //       route: '/request/add',
      //       component: RequestScreensAdd,
      //     },
      //     {
      //       displayName: 'Detail Request',
      //       icon: HomeIcon,
      //       name: 'transit-request-show',
      //       role: 'transit-request',
      //       showmenu: false,
      //       exact: true,
      //       route: '/request/:id/show',
      //       component: RequestScreenShow,
      //     },
      //     {
      //       displayName: 'Edit Request',
      //       icon: HomeIcon,
      //       name: 'transit-request-edit',
      //       role: 'transit-request',
      //       showmenu: false,
      //       exact: true,
      //       route: '/request/:id/edit',
      //       component: RequestScreensEdit,
      //     },
      //   ],
      // },
      {
        displayName: 'Inbound',
        icon: GiHandTruck,
        name: 'inbound',
        role: 'inbound',
        showmenu: true,
        exact: true,
        route: '/inbound',
        component: InboundScreens,
        routes: [
          {
            displayName: 'Inbound',
            icon: HomeIcon,
            name: 'inbound',
            role: 'inbound',
            showmenu: false,
            exact: true,
            route: '/inbound',
            component: InboundScreens,
          },
        ],
      },
      {
        displayName: 'Outbound',
        icon: FaTruckLoading,
        name: 'outbound',
        role: 'outbound',
        showmenu: true,
        exact: true,
        route: '/outbound',
        component: OutboundSCreens,
        routes: [
          {
            displayName: 'Outbound',
            icon: HomeIcon,
            name: 'outbound',
            role: 'outbound',
            showmenu: false,
            exact: true,
            route: '/outbound',
            component: OutboundSCreens,
          },
        ],
      },
      {
        displayName: 'Setting Path',
        icon: FaTruckLoading,
        name: 'setting-path',
        role: 'setting',
        showmenu: true,
        exact: true,
        route: '/setting-path',
        component: SettingPathScreen,
        routes: [
          {
            displayName: 'Setting Path',
            icon: HomeIcon,
            name: 'setting-path',
            role: 'setting',
            showmenu: false,
            exact: true,
            route: '/setting-path',
            component: SettingPathScreen,
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
    role: '',
    route: '/*',
    component: NotFound,
  },
];
