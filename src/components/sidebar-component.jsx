import React, { useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { Link, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

import Context from '../context';
import menuItem from '../navigation/menu-item';
// import ArrowUpTray from '../assets/images/arrow-up-tray.svg';
import { findParent, findTree } from '../utils/navigation-utils';

function SidebarComponent() {
  const location = useLocation();
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

  return (
    <aside
      className={`${
        store.isDrawerOpen ? 'w-80' : '-translate-x-80 w-0'
      } bg-[#22577a] transition-all ease-in-out delay-150 duration-300`}
    >
      <div className="relative h-full">
        <ul className="">
          {menuParent?.routes?.map(
            (d, idx) =>
              d.showmenu &&
              (store.user.hasRole(d.role) || d.role === '') && (
                <Link to={d.route} key={idx}>
                  <li
                    className={`${
                      findTree([d], location).length > 0
                        ? 'bg-[#22577a] border-l-4 border-solid border-[#eff6e0] text-[#eff6e0] ml-2'
                        : 'hover:font-bold hover:bg-[#22577a]'
                    } flex px-5 py-3 items-center`}
                  >
                    <d.icon
                      className={`w-4 h-4 ${findTree([d], location).length > 0 ? 'text-[#eff6e0]' : 'text-[#eff6e0]'}`}
                    />
                    <span className="ml-2 flex-auto text-[#eff6e0]">{d.displayName}</span>
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
                                } pl-12 pr-5 py-3 bg-[#22577a]`}
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
          className="absolute inset-x-0 bottom-10 h-15 py-3 transition-all ease-in-out duration-300 hover:bg-[#22577a] hover:text-[#eff6e0] hover:font-bold"
          type="button"
          onClick={() => {}}
        >
          <div className="flex pl-6">
            <FiLogOut className="w-4 h-4 mt-1 text-[#eff6e0]" />
            <h3 className="pt-0 pl-4 text-md text-[#eff6e0]">Log out</h3>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default observer(SidebarComponent);
