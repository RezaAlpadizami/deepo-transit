import React, { useContext } from 'react';

import LocalStorage from 'local-storage';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircleIcon, ChevronDownIcon, OfficeBuildingIcon } from '@heroicons/react/solid';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Button,
  useMediaQuery,
} from '@chakra-ui/react';

import Context from '../context';
import logo from '../assets/images/logo.svg';
import menuItem from '../navigation/menu-item';
import { findTree } from '../utils/navigation-utils';
import CookieService from '../services/cookies/cookie-service';
import HamburgerMenu from '../assets/images/hamburger-icon.svg';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [isLarge] = useMediaQuery('(min-width: 1224px)');

  const getWarehouse = () => JSON.parse(LocalStorage.get('Warehouse'));
  const id = getWarehouse()?.id.toString() || '';
  store.setWarehouseId(id);

  const handleChangeWarehouse = () => {
    CookieService.removeCookies();
    LocalStorage.remove('Warehouse');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="relative flex p-5">
      {isLarge ? (
        <div className="mx-3 mt-0.5 cursor-pointer z-10" onClick={() => store.toggleDrawer()}>
          <img src={logo} alt="logo" />
        </div>
      ) : (
        <div className="mx-1 h-8 cursor-pointer z-20" onClick={() => store.toggleDrawer()}>
          <img src={HamburgerMenu} alt="hamburger-icon" className="h-8" />
        </div>
      )}
      <ul className="flex ml-5 flex-auto">
        {menuItem
          .filter(item => item.showmenu)
          .map((v, i) => {
            console.log('vvvv', v);
            if (v.routes && !isShouldDisplay(v.routes)) return null;
            return (
              <li className="px-2" key={i}>
                <Link
                  to={v.route}
                  className={
                    findTree([v], location).length > 0
                      ? 'font-bold text-secondarydeepo border-b-2 border-secondarydeepo'
                      : ''
                  }
                >
                  {v.displayName}
                </Link>
              </li>
            );
          })}
      </ul>
      <div className="flex mr-4">
        <UserCircleIcon className="w-6 h-6 m-auto" />
        <Popover colorScheme="#caf0f8">
          <PopoverTrigger>
            <Button rightIcon={<ChevronDownIcon className="w-[15px] bg-red" />} type="button" size="sm">
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
            <PopoverFooter className="py-1">
              <button
                onClick={handleChangeWarehouse}
                type="button"
                className="block w-full py-2 px-4 text-sm text-white bg-gray-300 rounded-md hover:bg-secondarydeepo"
              >
                Change Area
              </button>
            </PopoverFooter>
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
