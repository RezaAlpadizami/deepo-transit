/* eslint-disable react/no-array-index-key */
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/solid';

import Context from '../context';
import menuItem from '../navigation/menu-item';
import logo from '../assets/images/logo.svg';
import { findTree } from '../utils/navigation-utils';

function Header() {
  const { store } = useContext(Context);
  const location = useLocation();

  return (
    <header className="flex p-5 border-b">
      <div className="mx-3 mt-0.5 cursor-pointer" onClick={() => store.toggleDrawer()}>
        <img src={logo} alt="logo" />
      </div>
      <ul className="flex ml-5 flex-auto">
        {menuItem
          .filter(item => item.showmenu)
          .map((v, i) => {
            if (v.routes && !isShouldDisplay(v.routes)) return null;
            return (
              <li className="px-2" key={i}>
                <Link to={v.route} className={findTree([v], location).length > 0 ? 'font-bold' : ''}>
                  {v.displayName}
                </Link>
              </li>
            );
          })}
      </ul>
      <div className="flex">
        <UserCircleIcon className="w-6 h-6" />
        <span className="ml-2">Administrator</span>
      </div>
    </header>
  );
}

const isShouldDisplay = routes => {
  let shouldDisplay = false;
  if (!routes) return false;

  // we make sure the parent has at least one displayed child
  routes.forEach(v => {
    if (!shouldDisplay) {
      //   if (v.showmenu && !v.routes && AuthService.hasRole('mofids_pds', `${v.role}${v.exactRole ? '' : '_access'}`)) {
      if (v.showmenu && (!v.routes || v.route)) {
        shouldDisplay = true;
      } else {
        shouldDisplay = isShouldDisplay(v.routes);
      }
    }
  });

  return shouldDisplay;
};

export default Header;
export { isShouldDisplay };
