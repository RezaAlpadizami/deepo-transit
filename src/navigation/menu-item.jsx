import React from 'react';
import { HomeIcon, UserCircleIcon, ArchiveIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));

const ProductScreen = React.lazy(() => import('../screens/master-screens/product-screen/index'));
const ProductShowScreen = React.lazy(() => import('../screens/master-screens/product-screen/show'));
const ProductAddScreen = React.lazy(() => import('../screens/master-screens/product-screen/add'));
const ProductEditScreen = React.lazy(() => import('../screens/master-screens/product-screen/edit'));

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
        displayName: 'Product',
        icon: ArchiveIcon,
        name: 'master-product',
        role: 'PRODUCT',
        showmenu: true,
        exact: true,
        route: '/master/product',
        component: ProductScreen,
        routes: [
          {
            displayName: 'Detail Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'PRODUCT',
            showmenu: false,
            exact: true,
            route: '/master/product/:id/show',
            component: ProductShowScreen,
          },
          {
            displayName: 'Add Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'PRODUCT',
            showmenu: false,
            exact: true,
            route: '/master/product/add',
            component: ProductAddScreen,
          },
          {
            displayName: 'Edit Product',
            icon: UserCircleIcon,
            name: 'master-product-show',
            role: 'PRODUCT',
            showmenu: false,
            exact: true,
            route: '/master/product/:id/edit',
            component: ProductEditScreen,
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
