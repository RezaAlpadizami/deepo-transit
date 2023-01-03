import React, { useState, useEffect, useCallback } from 'react';

import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Text, Button } from '@chakra-ui/react';

import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-master';
import Search from '../../../assets/images/magnify-glass.svg';
import LoadingHover from '../../../components/loading-hover-component';

function Screen() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, reset } = useForm();
  const [warehouseData, setWarhouseData] = useState([]);
  const [isSelected, setIsSelected] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    limit: 10,
    offset: 0,
  });
  const [filterParams, setFilterParams] = useState({
    location: null,
  });

  const cookies = new Cookies();

  useEffect(() => {
    setLoading(true);
    WarehouseApi.get({ ...filterData, ...filterParams })
      .then(res => {
        setLoading(false);
        setWarhouseData(res.data);
      })
      .catch(error => {
        setLoading(false);
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

  const clickAddressCard = data => {
    setIsSelected(data.id);
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
        if (data[dt] === ' ') {
          reset();
          setFilterData({
            limit: 10,
            offset: 0,
          });
          delete data[dt];
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
          setFilterParams({ location: data.name });
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

    setFilterParams(prev => {
      return {
        ...prev,
        location: null,
        ...data,
      };
    });
  };

  const opt = useCallback(getDebounce(onSubmit), []);

  return (
    <div className="mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="font-bold text-2xl">SELECT YOUR WORK AREA</h1>
      </div>
      <form onChange={handleSubmit(opt)}>
        <Input
          name="name"
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
                    onClick={() => clickAddressCard(d)}
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
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
