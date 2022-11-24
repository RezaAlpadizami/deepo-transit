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
    setMenuTree(findTree(menuItem, location.pathname));
  }, [location.pathname]);

  return (
    <Breadcrumb bg="#e2e7ef" color="#8e97a7" marginBottom={4} paddingX={4} paddingY={2} borderRadius={5} shadow="inner">
      {menuTree.map((d, idx) => (
        <BreadcrumbItem key={idx}>
          <BreadcrumbLink href={d.route}>{d.displayName}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
