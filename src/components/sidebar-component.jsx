import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ChevronRightIcon } from '@heroicons/react/solid';

import Context from '../context';
import menuItem from '../navigation/menu-item';
import { findParent, findTree } from '../utils/navigation-utils';

function SidebarComponent() {
  const { store } = useContext(Context);
  const location = useLocation();
  const [menuParent, setMenuParent] = useState(null);

  useEffect(() => {
    setMenuParent(findParent(menuItem, location.pathname));
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
        store.isDrawerOpen ? 'w-64' : '-translate-x-64 w-0'
      } bg-slate-700 transition-all ease-in-out delay-150 duration-300 `}
    >
      <div className="">
        <ul className="text-white">
          {menuParent?.routes?.map(
            d =>
              d.showmenu && (
                <Link to={d.route}>
                  <li
                    className={`${
                      findTree([d], location.pathname).length > 0
                        ? 'bg-slate-800 hover:font-bold'
                        : 'hover:bg-slate-600'
                    } flex px-5 py-3 items-center`}
                  >
                    <d.icon className="w-5 h-5" />
                    <span className="ml-2 flex-auto">{d.displayName}</span>
                    {d.routes && findTree([d.routes], location.pathname).length > 0 && (
                      <ChevronRightIcon
                        className={`w-5 h-5 transition-transform ease-out duration-300 ${
                          findTree([d], location.pathname).length > 0 ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    )}
                  </li>
                  {d.routes?.length > 0 && (
                    <ul
                      className={`transition-all ease-in-out duration-300 bg-slate-800 overflow-hidden ${
                        findTree([d], location.pathname).length > 0 ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {d.routes.map(
                        r =>
                          r.showmenu && (
                            <Link to={r.route}>
                              <li
                                className={`${
                                  findTree([r], location.pathname).length > 0 ? 'font-bold' : ''
                                } pl-12 pr-5 py-3 hover:bg-slate-900`}
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
      </div>
    </aside>
  );
}

export default observer(SidebarComponent);
