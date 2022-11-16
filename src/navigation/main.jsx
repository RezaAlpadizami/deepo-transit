import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@chakra-ui/react';

import MenuItem from './menu-item';
import Header from '../components/header-component';
import Breadcrumb from '../components/breadcrumb-component';
import Sidebar from '../components/sidebar-component';

function MainNavigation() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-container min-h-screen flex-auto transition-width ease-in-out delay-150 duration-300">
          <Breadcrumb />
          <Content />
        </div>
      </div>
    </BrowserRouter>
  );
}

function Content() {
  const location = useLocation();
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </div>
        </div>
      }
    >
      <Routes location={location}>
        {MenuItem.map(item => {
          const comp = [];
          if (item.route && item.component) {
            comp.push(<Route exact={item.exact} path={item.route} element={<item.component />} />);
            /* if (AuthService.hasRole('mofids_pds', `${item.data.role}${item.data.exactRole ? '' : '_access'}`)) {
              comp.push(<Route exact path={item.data.route} render={() => <item.data.component info={item} />} />);
            } else {
              comp.push(<Route exact path={item.data.route} render={() => <NoAccessScreen />} />);
            } */
          }
          if (item.routes && item.routes.length > 0) {
            item.routes.forEach(routes => {
              comp.push(
                <Route
                  exact={routes.exact}
                  path={routes.route}
                  element={<routes.component route={routes.route} displayName={routes.displayName} />}
                />
              );

              if (routes.routes && routes.routes.length > 0) {
                routes.routes.forEach(routes2 => {
                  comp.push(<Route exact={routes2.exact} path={routes2.route} element={<routes2.component />} />);
                });
              }
            });
          }

          if (item.action && item.action.length > 0) {
            item.action.forEach(action => {
              comp.push(<Route exact path={`${item.route}/${action.name}`} element={<action.component />} />);
            });
          }
          return comp;
        })}
      </Routes>
    </Suspense>
  );
}

export default observer(MainNavigation);
