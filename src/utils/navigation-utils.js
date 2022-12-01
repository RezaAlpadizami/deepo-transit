import { matchPath } from 'react-router-dom';

export const findTree = (items, location) => {
  const tree = [];
  let loop = true;

  items.forEach(d => {
    if (loop && tree.length === 0) {
      if (d.route && matchPath(d.route, location.pathname)) {
        tree.push(d);
        loop = false;
      } else if (d.routes?.length > 0) {
        const res = findTree(d.routes, location);

        if (res.length > 0) tree.push(d);

        res.forEach(r => {
          tree.push(r);
        });
      }
    }
  });
  return tree;
};

export const findParent = (items, location) => {
  return findTree(items, location).length > 0 ? findTree(items, location)[0] : null;
};
