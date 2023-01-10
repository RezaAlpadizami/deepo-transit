import { types } from 'mobx-state-tree';
import UserStore from './user-store';

const RootStore = types
  .model({
    isLogin: types.boolean,
    isSelectedWarehouse: types.optional(types.boolean, false),
    isDrawerOpen: types.optional(types.boolean, false),
    isLoadEdit: types.optional(types.boolean, false),
    request_number: types.optional(types.integer, 0),
    user: types.optional(UserStore, {}),
  })
  .actions(self => ({
    setLogin(isLogin) {
      self.isLogin = isLogin;
    },
    setIsSelectedWarehouse(isSelectedWarehouse) {
      self.isSelectedWarehouse = isSelectedWarehouse;
    },
    setIsDrawerOpen(isOpen) {
      self.isDrawerOpen = isOpen;
    },
    toggleDrawer() {
      self.isDrawerOpen = !self.isDrawerOpen;
    },
    setIsLoadEdit(isLoad) {
      self.isLoadEdit = isLoad;
    },
    setRequestNumber(data) {
      self.request_number = data;
    },
    getRequestNumber() {
      return self.request_number;
    },
  }));

export default RootStore;
