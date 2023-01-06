import Cookies from 'universal-cookie';

const cookies = new Cookies();

const setCookies = isSelected =>
  cookies.set('warehouse_id', isSelected, {
    path: '/warehouse',
    expires: new Date(Date.now() + 2592000),
  });
const getCookies = () => cookies.get('warehouse_id');
const removeCookies = () => cookies.remove('warehouse_id');
const isSelectedWarehouse = () => cookies.get('warehouse_id') !== undefined;

const CookieService = {
  setCookies,
  getCookies,
  isSelectedWarehouse,
  removeCookies,
};

export default CookieService;
