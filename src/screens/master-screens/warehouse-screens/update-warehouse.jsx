import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LoadingHover from '../../../components/loading-hover-component';
import { WarehouseApi } from '../../../services/api-master';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';

function Screen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errrorMessage, setErrorMessage] = useState([null]);
  const [showAlert, setShowAlert] = useState(false);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const schema = yup.object().shape({
    name: yup.string().nullable().required(),
    code: yup.string().nullable().required(),
    address: yup.string().nullable().required(),
    phone: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    capacity: yup.number().nullable().required(),
    last_stock_opname: yup.date().nullable().required(),
    location: yup.string().nullable().required(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onEditSaveWarehouse = data => {
    setLoading(true);
    WarehouseApi.update(id, {
      name: data.name,
      code: data.code,
      address: data.address,
      phone: data.phone,
      capacity: data.capacity,
      last_stock_opname: data.last_stock_opname,
      location: data.location,
    })
      .then(() => {
        setLoading(false);
        navigate('/master/warehouse');
      })
      .catch(error => {
        setLoading(false);
        setErrorMessage(error.status);
      });
  };

  const handleCloseButton = () => {
    setShowAlert(false);
    reset();
  };

  return (
    <div className="">
      {showAlert && (
        <div className="flex justify-center">
          <span className="p-2 bg-[#E25450] rounded-[8px] text-center text-white text-[12px] items-center">
            {errrorMessage}{' '}
            <button
              className="bg-transparent text-[13px] font-semibold leading-none outline-none focus:outline-none"
              onClick={() => handleCloseButton()}
              type="button"
            >
              <span className="ml-3 font-bold">Tutup</span>
            </button>
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit(onEditSaveWarehouse)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">Update Warehouse</h1>
          <div className="flex-1" />
          <Button
            onClick={() => reset()}
            paddingX={12}
            size="sm"
            className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-2 hover:text-white hover:bg-black"
          >
            Cancel
          </Button>
          <Button
            paddingX={12}
            type="submit"
            size="sm"
            className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="address" label="Address" register={register} errors={errors} />
          <Input name="name" label="Name" register={register} errors={errors} />
          <Input name="phone" label="Phone Number" register={register} errors={errors} />
          <Input name="capacity" label="Capacity" register={register} errors={errors} />
          <DatePicker
            name="last_stock_opname"
            label="Last Stock Opname"
            placeholder="Date / Month / Year"
            register={register}
            control={control}
            errors={errors}
          />
          <Input name="location" label="Location" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
