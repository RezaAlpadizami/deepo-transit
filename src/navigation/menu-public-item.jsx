import React from 'react';

const WarehouseSelection = React.lazy(() => import('../screens/transit-screens/warehouse-selection-screens/index'));
const NotFound = React.lazy(() => import('../screens/home-screens/404'));

export default [
  {
    name: 'warehouse-selection',
    showmenu: false,
    exact: false,
    route: '/',
    component: WarehouseSelection,
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
