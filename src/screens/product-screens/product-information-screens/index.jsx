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
          },
          {
            name: 'product_sku',
            label: 'SKU',
          },
          {
            name: 'product_name',
            label: 'Name',
          },
          {
            name: 'product_category',
            label: 'Category',
          },
          {
            name: 'qty',
            label: 'Qty',
          },
          {
            name: 'warehouse',
            label: 'Warehouse',
          },
          {
            name: 'rack',
            label: 'Rack',
          },
          {
            name: 'bay',
            label: 'Bay',
          },
          {
            name: 'level',
            label: 'level',
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
        name={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
