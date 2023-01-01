import React, { useState, useEffect } from 'react';

import Moment from 'moment';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Text, Button } from '@chakra-ui/react';

import Search from '../../../assets/images/magnify-glass.svg';
import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-master';

function Screen() {
  const navigate = useNavigate();
  const { register, control, handleSubmit } = useForm();
  const [warehouseData, setWarhouseData] = useState([]);
  const [isSelected, setIsSelected] = useState(-1);
  // const [filterData, setFilterData] = useState({
  //   limit: 10,
  //   offset: 0,
  // });
  const cookies = new Cookies();

  useEffect(() => {
    WarehouseApi.get()
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  const groupingByLocation = warehouseData.reduce((acc, cur) => {
    const { location, code, ...rest } = cur;
    const prevCat = acc.find(x => x.location === location);
    if (!prevCat) {
      acc.push({ location, data: [rest] });
    } else {
      const prevSubCat = prevCat.data.find(x => x.code === code);
      if (!prevSubCat) {
        prevCat.data.push(rest);
      }
    }
    return acc;
  }, []);

  const clickAddressCard = id => {
    setIsSelected(id);
  };

  const handleContinue = () => {
    cookies.set('warehouse_id', isSelected, {
      maxAge: 3600,
      path: '/',
    });
    navigate('/request');
  };

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
        <Input
          name="search"
          placeholder="Search Warehouse or Location"
          addOnRight
          register={register}
          control={control}
          icon={<img src={Search} alt="search" className="h-6" />}
        />
      </form>
      {groupingByLocation.map(data => {
        return (
          <div>
            <h2 className="font-bold mb-2 ml-1 my-6">{data.location}</h2>
            <div className="grid gap-x-5 gap-y-9 grid-cols-4 text-center">
              {data.data.map(d => {
                return (
                  <div
                    className={`justify-items-center w-full ${
                      isSelected === d.id ? 'border border-primarydeepo text-primarydeepo' : ''
                    } bg-white py-8 px-8 rounded-[30px] drop-shadow-md cursor-pointer`}
                    onClick={() => clickAddressCard(d.id)}
                  >
                    <div>
                      <Text>{`${data.location} - ${d.name}`}</Text>
                      <Text>{`${d.address}`}</Text>
                      <Text>{`${d.phone}`}</Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex justify-end mt-24 mx-12">
        <div className="flex">
          <div>
            <Button
              onClick={() => handleContinue()}
              type="submit"
              px={8}
              size="md"
              className="mr-14 text-white bg-gradient-to-r from-secondarydeepo to-primarydeepo hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
