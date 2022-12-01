/* eslint-disable react/no-array-index-key */
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

import menuItem from '../navigation/menu-item';
import { findTree } from '../utils/navigation-utils';

export default function BreadcrumbComponent() {
  const location = useLocation();
  const [menuTree, setMenuTree] = useState([]);

  useEffect(() => {
    setMenuTree(findTree(menuItem, location));
  }, [location.pathname]);

  return (
    <Breadcrumb color="#8e97a7" marginBottom={4} separator=">">
      {menuTree.map((d, idx) => (
        <BreadcrumbItem className="last:text-black" key={idx}>
          <BreadcrumbLink href={d.route}>{d.displayName}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
