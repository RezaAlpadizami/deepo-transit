import React from 'react';
import { ProductApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';

function Screen(props) {
  const { route, displayName } = props;

  return (
    <div className="">
      <Datatable
        filters={[
          {
            name: 'item_code',
            label: 'Item Code',
          },
          {
            name: 'sku',
            label: 'SKU',
          },
          {
            name: 'name',
            label: 'Name',
          },
          {
            name: 'name',
            label: 'Name',
          },
          {
            name: 'sku',
            label: 'SKU',
          },
          {
            name: 'category',
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
          { header: 'Item Code', value: 'sku', copy: true, type: 'link' },
          { header: 'SKU', value: 'product_name', copy: true },
          { header: 'Name', value: 'category_id', copy: true },
          { header: 'Category', value: 'product_desc', copy: true },
          { header: 'Description', value: 'description', copy: true },
          { header: 'Qty', value: 'quantity', copy: true },
        ]}
        toolbar={{
          action: {
            'copy-to-clipboard': true,
            'show-hide-column': true,
            'save-to-excel': true,
          },
        }}
        api={ProductApi}
        to={route}
        name={displayName}
        checkbox
      />
    </div>
  );
}
export default Screen;
