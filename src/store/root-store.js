import { types } from 'mobx-state-tree';
import UserStore from './user-store';

const RootStore = types
  .model({
    isLogin: types.boolean,
    isDrawerOpen: types.optional(types.boolean, true),
    isLoadEdit: types.optional(types.boolean, false),
    user: types.optional(UserStore, {}),
  })
  .actions(self => ({
    setLogin(isLogin) {
      self.isLogin = isLogin;
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
  }));

export default RootStore;
