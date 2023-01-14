import { types } from 'mobx-state-tree';
import UserStore from './user-store';
import BoundActivity from './bound-activity-store';

const RootStore = types
  .model({
    isLogin: types.boolean,
    isSelectedWarehouse: types.optional(types.boolean, false),
    isDrawerOpen: types.optional(types.boolean, false),
    isLoadEdit: types.optional(types.boolean, false),
    warehouseId: types.optional(types.string, ''),
    activity: types.optional(BoundActivity, {}),
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
    setWarehouseId(id) {
      self.warehouseId = id;
    },
    getWarehouseId() {
      return self.warehouseId;
    },
  }));

export default RootStore;
