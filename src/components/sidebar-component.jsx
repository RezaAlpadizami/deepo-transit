import React, { useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Context from '../context';
import menuItem from '../navigation/menu-item';
import ArrowUpTray from '../assets/images/arrow-up-tray.svg';
import CookieService from '../services/cookies/cookie-service';
import { findParent, findTree } from '../utils/navigation-utils';

function SidebarComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [menuParent, setMenuParent] = useState(null);

  useEffect(() => {
    setMenuParent(findParent(menuItem, location));
  }, [location.pathname]);

  useEffect(() => {
    if (!menuParent || !menuParent.routes || menuParent?.routes.length <= 0) {
      store.setIsDrawerOpen(false);
    } else {
      store.setIsDrawerOpen(true);
    }
  }, [JSON.stringify(menuParent)]);

  const handleLogOut = () => {
    CookieService.removeCookies();
    navigate('/');
    window.location.reload();
  };

  return (
    <aside
      className={`${
        store.isDrawerOpen ? 'w-80' : '-translate-x-80 w-0'
      } bg-primarydeepo transition-all ease-in-out delay-150 duration-300`}
    >
      <div className="relative h-full">
        <ul className="text-white">
          {menuParent?.routes?.map(
            (d, idx) =>
              d.showmenu &&
              (store.user.hasRole(d.role) || d.role === '') && (
                <Link to={d.route} key={idx}>
                  <li
                    className={`${
                      findTree([d], location).length > 0
                        ? 'bg-secondarydeepo hover:font-bold active:text-secondarydeepo]'
                        : 'hover:bg-secondarydeepo'
                    } flex px-5 py-3 items-center`}
                  >
                    <d.icon className="w-5 h-5" />
                    <span className="ml-2 flex-auto">{d.displayName}</span>
                    {d.routes && findTree([d.routes], location).length > 0 && (
                      <ChevronRightIcon
                        className={`w-5 h-5 transition-transform ease-out duration-300 ${
                          findTree([d], location).length > 0 ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    )}
                  </li>
                  {d.routes?.length > 0 && (
                    <ul
                      className={`transition-all ease-in-out duration-300 bg-secondarydeepo overflow-hidden ${
                        findTree([d], location).length > 0 ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {d.routes.map(
                        (r, idx) =>
                          r.showmenu &&
                          (store.user.hasRole(r.role) || r.role === '') && (
                            <Link to={r.route} key={idx}>
                              <li
                                className={`${
                                  findTree([r], location).length > 0 ? 'font-bold' : ''
                                } pl-12 pr-5 py-3 hover:bg-secondarydeepo`}
                              >
                                {r.displayName}
                              </li>
                            </Link>
                          )
                      )}
                    </ul>
                  )}
                </Link>
              )
          )}
        </ul>
        <button
          className="absolute inset-x-0 bottom-10 h-15 py-3 hover:bg-secondarydeepo"
          type="button"
          onClick={handleLogOut}
        >
          <div className="flex pl-6">
            <img src={ArrowUpTray} alt="arrow up" className="h-7 rotate-90 text-black" />
            <h3 className="pt-0 pl-6 transition-all ease-in-out duration-300 font-bold text-md text-[#fff]">Log out</h3>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default observer(SidebarComponent);
