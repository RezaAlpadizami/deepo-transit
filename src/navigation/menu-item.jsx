import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';
// import warehouseIcon from '../assets/icons/'

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));
const MasterWarhouse = React.lazy(() => import('../screens/master-screens/warehouse-screens/index'));
const MasterWarehouseAdd = React.lazy(() => import('../screens/master-screens/warehouse-screens/add-warehouse'));
const MasterWarehouseView = React.lazy(() =>
  import('../screens/master-screens/warehouse-screens/view-detail-warehouse')
);
const MasterWarehouseUpdate = React.lazy(() => import('../screens/master-screens/warehouse-screens/update-warehouse'));

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
    component: MasterWarhouse,
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
            name: 'warehouse-add',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/add',
            component: MasterWarehouseAdd,
          },
          {
            displayName: 'View Detail Warehouse',
            name: 'warehouse-view',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/:id',
            component: MasterWarehouseView,
          },
          {
            displayName: 'Edit Detail Warehouse',
            name: 'warehouse-edit',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/:id/edit',
            component: MasterWarehouseUpdate,
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
        component: MasterWarhouse,
      },
      {
        displayName: 'X',
        icon: HomeIcon,
        name: 'master-x',
        role: 'master',
        showmenu: false,
        exact: true,
        route: '/master/x',
        component: MasterWarhouse,
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
