import React, { useState, useEffect, useCallback } from 'react';

import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { useForm } from 'react-hook-form';
import { Text, Button } from '@chakra-ui/react';
import LocalStorage from 'local-storage';

import CookieService from '../../../services/cookies/cookie-service';
import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-transit';
import Search from '../../../assets/images/magnify-glass.svg';

function Screen() {
  const { register, control, handleSubmit } = useForm();
  const [warehouseData, setWarhouseData] = useState([]);
  const [isSelected, setIsSelected] = useState(-1);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(null);
  const [filterData, setFilterData] = useState({
    limit: 50,
    offset: 0,
  });

  const cookies = new Cookies();

  useEffect(() => {
    WarehouseApi.get({ ...filterData })
      .then(res => {
        setWarhouseData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, [filterData]);

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

  const clickAddressCard = data => {
    setIsSelected(data.id);
    setIsSelectedWarehouse(data);
  };

  const getDebounce = func => {
    let timer;
    return (...args) => {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleContinue = () => {
    cookies.set('warehouse_id', isSelected, {
      path: '/',
      maxAge: 12 * 24 * 390,
    });
    LocalStorage.set('Warehouse', JSON.stringify(isSelectedWarehouse));
    CookieService.getCookies('warehouse_id');

    window.location.reload();
  };

  const onSubmit = data => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    }

    setFilterData(prev => {
      return {
        ...prev,
        limit: 50,
        offset: 0,
        search: ' ',
        ...data,
      };
    });
  };

  const opt = useCallback(getDebounce(onSubmit), []);

  return (
    <div className="max-[640px]:w-[280px]">
      <div className="flex justify-center mb-6 max-[640px]:text-center">
        <h1 className="font-bold text-2xl">SELECT YOUR WORK AREA</h1>
      </div>
      <div className=" bg-white pb-12 px-8 max-h-[600px] 2xl:max-h-[520px] rounded-[20px] overflow-y-scroll scrollbar drop-shadow-md">
        <div
          className="sticky top-0
          pt-12 h-24 bg-white w-[100%] z-10 transition-all duration-500"
        >
          <form onChange={handleSubmit(opt)} className="max-[640px]:w-full">
            <Input
              name="search"
              placeholder="Search Warehouse or Location"
              addOnRight
              register={register}
              control={control}
              icon={<img src={Search} alt="search" className="h-6" />}
            />
          </form>
        </div>
        {groupingByLocation.map(group => {
          return (
            <div className="mt-10 mx-1">
              <h2 className="font-bold mb-2 ml-1 my-6 text-lg">{group.location}</h2>
              <div className="grid gap-x-5 gap-y-9 grid-cols-4 max-[640px]:grid-cols-1 text-center">
                {group.data.map(d => {
                  return (
                    <div
                      className={`justify-items-center w-full ${
                        isSelected === d.id ? 'border border-primarydeepo text-primarydeepo' : 'border border-gray-300'
                      } bg-white py-4 px-4 rounded-[20px] drop-shadow-md cursor-pointer`}
                      onClick={() => clickAddressCard(d)}
                    >
                      <div className="text-[14px] max-[640px]:text-[12px]">
                        <Text>{`${group.location} - ${d.name}`}</Text>
                        <Text className="my-2">{`${d.address !== null ? d.address : '-'}`}</Text>
                        <Text>{`${d.phone}`}</Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-6 mx-12">
        <div className="max-[640px]:fixed max-[640px]:bottom-0 max-[640px]:right-0 flex">
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
