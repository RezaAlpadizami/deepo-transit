import { types } from 'mobx-state-tree';

const UserStore = types
  .model({
    roles: types.array(types.model({ name: types.string })),
  })
  .actions(self => ({
    setProfile(profile) {
      self.roles = profile.roles;
    },
    hasRole(role_name) {
      let has = false;
      if (role_name) {
        has = true;
      }
      return has;
    },
  }));

export default UserStore;
