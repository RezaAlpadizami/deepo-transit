import React from 'react';
import { HomeIcon, UserCircleIcon, ArchiveIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));
const MasterCity = React.lazy(() => import('../screens/master-screens/city/index'));
const MasterCityAdd = React.lazy(() => import('../screens/master-screens/city/add'));

const WareHouseScreen = React.lazy(() => import('../screens/master-screens/warehouse-screen/index'));
const WareHouseShowScreen = React.lazy(() => import('../screens/master-screens/warehouse-screen/show'));
const ProductScreen = React.lazy(() => import('../screens/master-screens/product-screen/index'));
const ProductShowScreen = React.lazy(() => import('../screens/master-screens/product-screen/show'));
const ProductAddScreen = React.lazy(() => import('../screens/master-screens/product-screen/add'));

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
        displayName: 'City',
        icon: HomeIcon,
        name: 'master-city',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/city',
        component: MasterCity,
        routes: [
          {
            displayName: 'Add City',
            icon: UserCircleIcon,
            name: 'master-city-add',
            role: 'master',
            showmenu: true,
            exact: true,
            route: '/master/city/add',
            component: MasterCityAdd,
          },
          {
            displayName: 'Delete',
            icon: UserCircleIcon,
            name: 'master-city-delete',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/city/delete',
            component: MasterCityAdd,
          },
        ],
      },
      {
        displayName: 'Warehouse',
        icon: HomeIcon,
        name: 'master-warehouse',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/warehouse',
        component: WareHouseScreen,
        routes: [
          {
            displayName: 'Show',
            icon: UserCircleIcon,
            name: 'master-warehouse-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/warehouse/:id/show',
            component: WareHouseShowScreen,
          },
        ],
      },
      {
        displayName: 'Product',
        icon: ArchiveIcon,
        name: 'master-product',
        role: 'master',
        showmenu: true,
        exact: true,
        route: '/master/product',
        component: ProductScreen,
        routes: [
          {
            displayName: 'Detail Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/product/:id/show',
            component: ProductShowScreen,
          },
          {
            displayName: 'Add Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/product/add',
            component: ProductAddScreen,
          },
          {
            displayName: 'Edit Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/product/:id/edit',
            component: ProductAddScreen,
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
