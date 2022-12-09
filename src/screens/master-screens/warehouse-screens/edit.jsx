import React, { useState, useEffect } from 'react';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import Moment from 'moment';

import Input from '../../../components/input-component';
import { WarehouseApi } from '../../../services/api-master';
import DatePicker from '../../../components/datepicker-component';
import LoadingHover from '../../../components/loading-hover-component';

const schema = yup.object().shape({
  name: yup.string().nullable().required(),
  code: yup.string().nullable().required(),
  address: yup.string().nullable().required(),
  phone: yup.string().nullable().required(),
  capacity: yup.number().nullable().required(),
  last_stock_opname: yup.string().nullable().required(),
  location: yup.string().nullable().required(),
});

function Screen(props) {
  const { displayName, route } = props;

  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading] = useState(false);

  useEffect(() => {
    WarehouseApi.find(id)
      .then(res => {
        setValue('name', res.data.name);
        setValue('code', res.data.code);
        setValue('address', res.data.address);
        setValue('phone', res.data.phone);
        setValue('capacity', res.data.capacity);
        setValue('last_stock_opname', res.data.last_stock_opname ? Moment(res.start_date).toDate() : null);
        setValue('location', res.data.location);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const onEditSaveWarehouse = data => {
    WarehouseApi.update(id, {
      name: data.name,
      code: data.code,
      address: data.address,
      phone: data.phone,
      level: data.level,
      capacity: Number(data.capacity),
      last_stock_opname: data.last_stock_opname ? Moment(data.last_stock_opname).format('YYYY-MM-DD') : null,
      location: data.location,
    })
      .then(() => {
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onEditSaveWarehouse)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <Button
            onClick={() => navigate(-1)}
            paddingX={12}
            size="sm"
            className="bg-[#E3E3E3] border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-2 hover:text-gray-700 hover:bg-[#D9D9D9]"
          >
            Cancel
          </Button>
          <Button
            paddingX={12}
            type="submit"
            size="sm"
            className="bg-[#232323] border border-gray-500 text-white rounded-full border-3 py-4 px-6 mr-60 hover:bg-black"
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
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
