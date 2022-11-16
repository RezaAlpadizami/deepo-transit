import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { CityApi } from '../../../services/api-master';

import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';

const dummy = [
  {
    id: 1,
    warehouse_code: 'W1',
    warehouse_name: 'WarehouseName',
    warehouse_location: 'Jakardah',
    warehouse_address: 'Equity Tower lt. 250',
    warehouse_capacity: '100',
    last_stock_date: '2022-11-15T16:08:23+07:00',
    warehouse_phone: '08123456789',
  },
  {
    id: 2,
    warehouse_code: 'MS 2',
    warehouse_name: 'Moon Storage',
    warehouse_location: 'JakSel',
    warehouse_address: 'Treasury Tower lt. 250',
    warehouse_capacity: '200',
    last_stock_date: '2022-11-15T16:08:23+07:00',
    warehouse_phone: '08123456789',
  },
];
function Screen(props) {
  const { route, displayName } = props;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    name: yup.string().nullable().required(),
    age: yup.string().nullable().required(),
    promotionType: yup.string().nullable().required(),
    start_date: yup.string().nullable().required(),
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
  }, []);

  const getData = (page = 1) => {
    setLoading(true);
    setData(dummy);
    setTotalData(dummy.length);
    CityApi.get({ page })
      .then(() => {
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <div className="">
      <div className="flex">
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
        {/* <Button onClick={() => navigate('/master/city/add')} paddingX={12} size="sm" colorScheme="primary">
          Tambah SKP
        </Button> */}
      </div>
      <form onSubmit={handleSubmit(d => console.log(d))}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 mb-4 grid-cols-4 mt-4">
          <Input name="name" label="Name" placeholder="Input Name" register={register} errors={errors} />
          <Input name="age" label="Age" placeholder="Input Age" register={register} errors={errors} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1" />
          <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
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
            { header: 'Wareouse Code', value: 'warehouse_code', copy: true },
            { header: 'Wareouse Name', value: 'warehouse_name', copy: true },
            { header: 'Wareouse Location', value: 'warehouse_location', copy: true },
            { header: 'Wareouse Address', value: 'warehouse_address', copy: true },
            { header: 'Warehouse Capacity', value: 'warehouse_capacity', copy: true },
            { header: 'Last Stock Date', value: 'last_stock_date', copy: true },
            { header: 'Warehouse Phone', value: 'warehouse_phone', copy: true },
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
          api={CityApi}
          to={route}
          data={data}
          name={displayName}
          totalData={totalData}
          loading={loading}
          checkbox
          onChangePage={page => getData(page)}
        />
      </div>
    </div>
  );
}
export default Screen;
