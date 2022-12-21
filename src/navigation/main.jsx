import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import NoAccessScreen from '../screens/home-screens/no-access';
import MenuItem from './menu-item';
import Header from '../components/header-component';
import Breadcrumb from '../components/breadcrumb-component';
import Sidebar from '../components/sidebar-component';

import Context from '../context';
import LoadingHover from '../components/loading-hover-component';

function MainNavigation() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-container min-h-screen flex-auto transition-width ease-in-out delay-150 duration-300 w-5/6 ">
          <Breadcrumb />
          <Content />
        </div>
      </div>
    </BrowserRouter>
  );
}

function Content() {
  const { store } = useContext(Context);
  const location = useLocation();
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div>
            <LoadingHover visible />
          </div>
        </div>
      }
    >
      <Routes location={location}>
        {MenuItem.map(item => {
          const comp = [];
          if (item.route && item.component) {
            if (store.user.hasRole(item.role) || item.role === '') {
              comp.push(
                <Route
                  exact={item.exact}
                  path={item.route}
                  element={<item.component route={item.route} displayName={item.displayName} />}
                />
              );
            } else {
              comp.push(<Route exact path={item.route} element={<NoAccessScreen />} />);
            }
          }
          if (item.routes && item.routes.length > 0) {
            item.routes.forEach(routes => {
              if (store.user.hasRole(routes.role) || routes.role === '') {
                comp.push(
                  <Route
                    exact={routes.exact}
                    path={routes.route}
                    element={<routes.component route={routes.route} displayName={routes.displayName} />}
                  />
                );
              } else {
                comp.push(<Route exact path={routes.route} element={<NoAccessScreen />} />);
              }

              if (routes.routes && routes.routes.length > 0) {
                routes.routes.forEach(routes2 => {
                  if (store.user.hasRole(routes2.role) || routes2.role === '') {
                    comp.push(
                      <Route
                        exact={routes2.exact}
                        path={routes2.route}
                        element={<routes2.component route={routes2.route} displayName={routes2.displayName} />}
                      />
                    );
                  } else {
                    comp.push(<Route exact path={routes2.route} element={<NoAccessScreen />} />);
                  }
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
