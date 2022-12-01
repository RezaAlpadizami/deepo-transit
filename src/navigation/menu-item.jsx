import React from 'react';
import { HomeIcon, ServerIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));

const StorageScreens = React.lazy(() => import('../screens/master-screens/storage-screens/index'));
const StorageScreenAdd = React.lazy(() => import('../screens/master-screens/storage-screens/add'));
const StorageScreenShow = React.lazy(() => import('../screens/master-screens/storage-screens/show'));
const StorageScreenEdit = React.lazy(() => import('../screens/master-screens/storage-screens/edit'));

const MasterWarhouse = React.lazy(() => import('../screens/master-screens/warehouse-screens/index'));
const MasterWarehouseAdd = React.lazy(() => import('../screens/master-screens/warehouse-screens/add'));
const MasterWarehouseShow = React.lazy(() => import('../screens/master-screens/warehouse-screens/show'));
const MasterWarehouseEdit = React.lazy(() => import('../screens/master-screens/warehouse-screens/edit'));

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
    component: Home,
    routes: [
      {
        displayName: 'Warehouse',
        icon: HomeIcon,
        name: 'master-warehouse',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/warehouse',
        component: MasterWarhouse,
        routes: [
          {
            displayName: 'Add Warehouse',
            name: 'master-warehouse-add',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/add',
            component: MasterWarehouseAdd,
          },
          {
            displayName: 'View Detail Warehouse',
            name: 'master-warehouse-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/:id/show',
            component: MasterWarehouseShow,
          },
          {
            displayName: 'Edit Detail Warehouse',
            name: 'master-warehouse-edit',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/:id/edit',
            component: MasterWarehouseEdit,
          },
        ],
      },
      {
        displayName: 'Storage',
        icon: ServerIcon,
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
            component: StorageScreenAdd,
          },
          {
            displayName: 'Detail Storage',
            name: 'master-storage-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/storage/:id/show',
            component: StorageScreenShow,
          },
          {
            displayName: 'Update Storage',
            name: 'master-storage-edit',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/storage/:id/edit',
            component: StorageScreenEdit,
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
