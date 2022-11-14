import { types } from 'mobx-state-tree';

const RootStore = types
  .model({
    isLogin: types.boolean,
    isDrawerOpen: types.optional(types.boolean, true),
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
  }));

export default RootStore;
