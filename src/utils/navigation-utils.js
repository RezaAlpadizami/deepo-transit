export const findTree = (items, path) => {
  const tree = [];
  let loop = true;

  items.forEach(d => {
    if (loop) {
      if (d.route === path) {
        tree.push(d);
        loop = false;
      } else if (d.routes?.length > 0) {
        const res = findTree(d.routes, path);

        if (res.length > 0) tree.push(d);

        res.forEach(r => {
          tree.push(r);
        });
      }
    }
  });
  return tree;
};

export const findParent = (items, path) => {
  return findTree(items, path).length > 0 ? findTree(items, path)[0] : null;
};
