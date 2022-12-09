import React from 'react';
import { HomeIcon, UserCircleIcon, ArchiveIcon, ServerIcon, MenuAlt3Icon, ShareIcon } from '@heroicons/react/solid';

const NotFound = React.lazy(() => import('../screens/home-screens/404'));
const Home = React.lazy(() => import('../screens/home-screens/index'));

const CategoryScreens = React.lazy(() => import('../screens/master-screens/category-screens/index'));
const CategoryScreenAdd = React.lazy(() => import('../screens/master-screens/category-screens/add'));
const CategoryScreenShow = React.lazy(() => import('../screens/master-screens/category-screens/show'));
const CategoryScreenEdit = React.lazy(() => import('../screens/master-screens/category-screens/edit'));

const StorageScreens = React.lazy(() => import('../screens/master-screens/storage-screens/index'));
const StorageScreenAdd = React.lazy(() => import('../screens/master-screens/storage-screens/add'));
const StorageScreenShow = React.lazy(() => import('../screens/master-screens/storage-screens/show'));
const StorageScreenEdit = React.lazy(() => import('../screens/master-screens/storage-screens/edit'));

const ProductScreen = React.lazy(() => import('../screens/master-screens/product-screen/index'));
const ProductShowScreen = React.lazy(() => import('../screens/master-screens/product-screen/show'));
const ProductAddScreen = React.lazy(() => import('../screens/master-screens/product-screen/add'));
const ProductEditScreen = React.lazy(() => import('../screens/master-screens/product-screen/edit'));

const MasterWarhouse = React.lazy(() => import('../screens/master-screens/warehouse-screens/index'));
const MasterWarehouseAdd = React.lazy(() => import('../screens/master-screens/warehouse-screens/add'));
const MasterWarehouseShow = React.lazy(() => import('../screens/master-screens/warehouse-screens/show'));
const MasterWarehouseEdit = React.lazy(() => import('../screens/master-screens/warehouse-screens/edit'));

const ProductJourneyScreens = React.lazy(() => import('../screens/product-screens/product-journey-screens/index'));
const ProductJourneyShowScreen = React.lazy(() => import('../screens/product-screens/product-journey-screens/show'));

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
      {
        displayName: 'Category',
        icon: MenuAlt3Icon,
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
            component: CategoryScreenAdd,
          },
          {
            displayName: 'Detail Category',
            name: 'master-category-show',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/category/:id/show',
            component: CategoryScreenShow,
          },
          {
            displayName: 'Update Category',
            name: 'master-category-edit',
            role: 'master',
            showmenu: false,
            exact: true,
            route: '/master/category/:id/edit',
            component: CategoryScreenEdit,
          },
        ],
      },
    ],
  },
  {
    displayName: 'Product',
    name: 'product',
    role: 'product',
    showmenu: true,
    exact: true,
    route: '/product',
    component: Home,
    routes: [
      {
        displayName: 'Product Journey',
        icon: ShareIcon,
        name: 'product-journey',
        role: 'product',
        showmenu: true,
        exact: true,
        route: '/product-journey',
        component: ProductJourneyScreens,
        routes: [
          {
            displayName: 'Detail Product Journey',
            name: 'product-journey-detail',
            role: 'product',
            showmenu: false,
            exact: true,
            route: '/product-journey/:id/show',
            component: ProductJourneyShowScreen,
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
