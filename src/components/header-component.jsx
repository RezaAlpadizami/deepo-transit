import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, ChevronDownIcon, OfficeBuildingIcon } from '@heroicons/react/solid';
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Button } from '@chakra-ui/react';

import LocalStorage from 'local-storage';
import Context from '../context';
import menuItem from '../navigation/menu-item';
import logo from '../assets/images/logo.svg';
import { findTree } from '../utils/navigation-utils';

function Header() {
  const { store } = useContext(Context);
  const location = useLocation();

  const getWarehouse = () => JSON.parse(LocalStorage.get('Warehouse'));
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
      <div className="flex mr-4">
        <UserCircleIcon className="w-6 h-6 m-auto" />
        <Popover>
          <PopoverTrigger>
            <Button rightIcon={<ChevronDownIcon className="w-[15px]" />} type="button" size="sm">
              Administrator
            </Button>
          </PopoverTrigger>
          <PopoverContent marginEnd={6} width="auto">
            <PopoverArrow />
            <PopoverBody className="py-3 px-4 text-sm text-secondarydeepo">
              <div className="flex">
                <OfficeBuildingIcon className="w-10 h-10" />
                <div>
                  <p>{getWarehouse()?.name}</p>
                  <p className="font-medium truncate text-center">
                    {getWarehouse()?.address !== null ? getWarehouse()?.address : '-'}
                  </p>
                </div>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
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
