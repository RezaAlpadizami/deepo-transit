import { types } from 'mobx-state-tree';

const UserStore = types
  .model({
    roles: types.array(types.model({ name: types.string })),
  })
  .actions(self => ({
    setProfile(profile) {
      self.roles = profile.roles;
    },
    hasRole(roleName) {
      let has = false;
      if (roleName) {
        has = true;
      }
      return has;
    },
  }));

export default UserStore;
