import React from 'react';
import { ProductInfoApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  return (
    <div className="">
      <Datatable
        identifierProperties="product_id"
        filters={[
          {
            name: 'product_id',
            label: 'Item Code',
            col: 2,
          },
          {
            name: 'product_sku',
            label: 'SKU',
            col: 2,
          },
          {
            name: 'product_name',
            label: 'Name',
            col: 2,
          },
          {
            name: 'product_category',
            label: 'Category',
            col: 1,
          },
          {
            name: 'qty',
            label: 'Qty',
            col: 1,
          },
          {
            name: 'warehouse',
            label: 'Warehouse',
            col: 1,
          },
          {
            name: 'rack',
            label: 'Rack',
            col: 1,
          },
          {
            name: 'bay',
            label: 'Bay',
            col: 1,
          },
          {
            name: 'level',
            label: 'level',
            col: 1,
          },
        ]}
        columns={[
          { header: 'SKU', value: 'product_sku', copy: true, type: 'link' },
          { header: 'Name', value: 'product_name', copy: true },
          { header: 'Category', value: 'product_category', copy: true },
          { header: 'Description', value: 'product_desc', copy: true },
          { header: 'Qty', value: 'qty', copy: true },
          { header: 'warehouse', value: 'warehouse' },
          { header: 'rack', value: 'rack' },
          { header: 'bay', value: 'bay' },
          { header: 'level', value: 'level' },
        ]}
        toolbar={{
          action: {
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={ProductInfoApi}
        to={route}
        displayName={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
