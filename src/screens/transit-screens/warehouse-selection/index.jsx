import React, { useState, useEffect } from 'react';

import Moment from 'moment';
import Swal from 'sweetalert2';
import { Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-master';

function Screen() {
  const { register, control, handleSubmit } = useForm();
  const [warehouseData, setWarhouseData] = useState([]);
  // const [filterData, setFilterData] = useState({
  //   limit: 10,
  //   offset: 0,
  // });

  useEffect(() => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
        console.log('wareh', warehouseData);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  const onSubmit = data => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }
        if (data[dt] === 'All') {
          // setFilterData({
          //   limit: 10,
          //   offset: 0,
          // });
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
    // setFilterData(prev => {
    //   return {
    //     ...prev,
    //     limit: 10,
    //     offset: 0,
    //     ...data,
    //   };
    // });
  };

  return (
    <div className="mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="font-bold text-xl">Select your work area</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="search" label="" register={register} control={control} />
      </form>
      <h2 className="font-bold mb-2 ml-1">Jakarta</h2>
      <div className="flex gap-x-5 gap-y-9 grid-cols-4 text-center">
        <div className="justify-items-center w-full bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
          <div>
            <Text>JKT - Gudang Pusat</Text>
            <Text>Jl. Melati Blok B No. 1</Text>
            <Text>021 - 5464532</Text>
          </div>
        </div>
        <div className=" justify-items-center w-full bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
          <div>
            <Text>JKT - Gudang Pusat</Text>
            <Text>Jl. Melati Blok B No. 1</Text>
            <Text>021 - 5464532</Text>
          </div>
        </div>
        <div className=" justify-items-center w-full bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
          <div>
            <Text>JKT - Gudang Pusat</Text>
            <Text>Jl. Melati Blok B No. 1</Text>
            <Text>021 - 5464532</Text>
          </div>
        </div>
        <div className=" justify-items-center w-full bg-white py-8 px-8 rounded-[30px] drop-shadow-md">
          <div>
            <Text>JKT - Gudang Pusat</Text>
            <Text>Jl. Melati Blok B No. 1</Text>
            <Text>021 - 5464532</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
