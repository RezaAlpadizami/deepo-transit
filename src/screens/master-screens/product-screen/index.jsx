/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import Moment from 'moment';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { ProductApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';
import TextArea from '../../../components/textarea-component';
import LoadSkeleton from '../../../components/skeleton-component';

function Screen(props) {
  const { route, displayName } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };

  const [filterData, setFilterData] = useState({
    limit: 10,
    offset: 0,
    ...defaultSort,
  });

  const schema = yup.object().shape({
    name: yup.string().nullable(),
    age: yup.string().nullable(),
    promotionType: yup.string().nullable(),
    start_date: yup.string().nullable(),
  });

  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, [filterData]);

  const getData = () => {
    setLoading(true);

    ProductApi.get({ ...filterData })
      .then(res => {
        setData(res.data);
        setTotalData(res.query.total);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };
  const onReset = () => {
    reset();
    setFilterData({
      limit: 10,
      offset: 0,
      ...defaultSort,
    });
  };

  const onSubmit = data => {
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }
        if (data[dt] === 'All') {
          setFilterData({
            limit: 10,
            offset: 0,
            ...defaultSort,
          });
          delete data[dt];
        }
        if (data[dt] instanceof Date) {
          if (dt.toLowerCase().includes('to')) {
            data[dt] = Moment(data[dt]).endOf('day').format('YYYY-MM-DD');
          } else {
            data[dt] = Moment(data[dt]).startOf('day').format('YYYY-MM-DD');
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    }
    setFilterData(prev => {
      return {
        ...prev,
        limit: 10,
        offset: 0,
        ...data,
      };
    });
  };

  return (
    <div className="">
      {loading && <LoadSkeleton />}
      <div className="flex">
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 mb-4 grid-cols-4 mt-4">
          <Input name="sku" label="SKU" placeholder="Input SKU" register={register} errors={errors} />
          <Input name="name" label="Name" placeholder="Input Name" register={register} errors={errors} />
          <Select
            name="category"
            label="Category"
            placeholder="Pilih Category"
            options={[
              {
                value: '',
                label: 'Category Code',
              },
              {
                value: '',
                label: 'Category Name',
              },
            ]}
            register={register}
            errors={errors}
          />
          <TextArea
            name="category"
            label="Product Description"
            placeholder="Input Category"
            register={register}
            errors={errors}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1" />
          <Button
            type="button"
            size="sm"
            width="24"
            onClick={() => onReset()}
            colorScheme="blackAlpha"
            variant="outline"
          >
            Reset
          </Button>
          <Button type="submit" size="sm" width="24" colorScheme="primary">
            Filter
          </Button>
        </div>
      </form>
      <div>
        <Datatable
          columns={[
            { header: 'Id', value: 'id', copy: true },
            { header: 'SKU', value: 'sku', copy: true },
            { header: 'Name', value: 'product_name', copy: true },
            { header: 'Category', value: 'category_id', copy: true },
            { header: 'Product Description', value: 'product_desc', copy: true },
          ]}
          toolbar={{
            action: {
              view: true,
              delete: true,
              'copy-to-clipboard': true,
              'show-hide-column': true,
              'save-to-excel': true,
            },
          }}
          api={ProductApi}
          to={route}
          data={data}
          name={displayName}
          offset={filterData.offset}
          onChangePage={(page, offset) => setFilterData({ ...filterData, offset })}
          totalData={totalData}
          loading={loading}
          onSort={sort => setFilterData({ limit: 10, offset: 0, ...sort })}
          checkbox
        />
      </div>
    </div>
  );
}
export default observer(Screen);
