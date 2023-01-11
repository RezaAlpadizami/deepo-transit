import { types } from 'mobx-state-tree';

const BoundActivity = types
  .model('BoundActivity', {
    request_number: types.optional(types.integer, 0),
    groups: types.optional(
      types.array(
        types.model({
          isAllocate: types.optional(types.boolean, false),
          product_id: types.optional(types.integer, 0),
        })
      ),
      []
    ),
  })
  .actions(self => ({
    setRequestNumber(data) {
      self.request_number = data;
    },
    getRequestNumber() {
      return self.request_number;
    },
    setAllocate(data) {
      self.groups = data;
      console.log('groups', data);
    },
  }));
export default BoundActivity;
