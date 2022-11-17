import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoadingHover from '../../../components/loading-hover-component';

import { StorageApi } from '../../../services/api-master';
import Input from '../../../components/input-component';
import Select from '../../../components/select-component';

function Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errrorMessage, setErrorMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  //   const [data, setData] = useState([]);
  //   const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    bay: yup.string().nullable().required(),
    code: yup.string().nullable().required(),
    rack: yup.string().nullable().required(),
    warehouse: yup.string().nullable().required(),
    level: yup.string().nullable().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onAddStorage = data => {
    setLoading(true);
    StorageApi.store({
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
        setErrorMessage(error.message);
        setShowAlert(true);
      });
  };

  const handleCloseButton = () => {
    setShowAlert(false);
    reset();
  };

  return (
    <div className="">
      {showAlert && (
        <span className="p-2 bg-[#E25450] rounded-[8px] text-center text-white text-[12px]">
          {errrorMessage}{' '}
          <button
            className="bg-transparent text-[13px] font-semibold leading-none outline-none focus:outline-none"
            onClick={() => handleCloseButton()}
            type="button"
          >
            <span className="ml-3 font-bold">Tutup</span>
          </button>
        </span>
      )}
      <form onSubmit={handleSubmit(onAddStorage)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">Add Storage</h1>
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
            className="bg-gray-300 border border-gray-500 text-gray-700 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="level" label="Level" register={register} errors={errors} />
          <Input name="rack" label="Rack" register={register} errors={errors} />
          <Select
            name="warehouse"
            label="Warehouse"
            options={[
              { value: 'pusat', label: 'Gudang Pusat' },
              { value: 'serpong', label: 'Gudang Serpong' },
              { value: 'cilegon', label: 'Gudang Cilegon' },
              { value: 'jaksel', label: 'Gudang Jakarta Selatan' },
            ]}
            placeholder=""
            register={register}
            errors={errors}
          />
          <Input name="bay" label="Bay" register={register} errors={errors} />
        </div>

        {/* <div className="flex gap-2">
          <div className="flex-1" />
          <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
            Reset
          </Button>
          <Button type="submit" size="sm" width="24" colorScheme="primary">
            Filter
          </Button>
        </div> */}
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
