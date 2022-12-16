import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import RequestApi from '../../../services/api-transit';
import Select from '../../../components/select-component';
import LoadingHover from '../../../components/loading-hover-component';
import InputDetail from '../../../components/input-detail-component';
import Input from '../../../components/input-component';
import TextArea from '../../../components/textarea-component';
import DatePicker from '../../../components/datepicker-component';
import ProductApi from '../../../services/api-master';

function Screen() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  // const [dataProduct, setDataProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  // notes: need adjusment be, give back error validation, must input min 255 length for notes
  const schema = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().max(255).required(),
    product_name: yup.string().nullable().required(),
    qty: yup.number().nullable().required(),
  });

  const {
    register: registerProd,
    formState: { errors: errorsProd },
    handleSubmit: handleSubmitProd,
  } = useForm();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    ProductApi.get()
      .then(res => {
        setData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const onAddProd = data => {
    const dataProd = [];
    const totalData = dataProd.push(data);
    console.log('dataproddd', totalData);
  };

  const onSubmitRequest = data => {
    setLoading(true);
    RequestApi.store({
      activity_name: data.activity_name,
      request_by: 'testing',
      warehouse_id: 1,
      notes: data.notes,
      detail: [
        {
          product_id: 1,
          qty: 100,
        },
        {
          product_id: 2,
          qty: 20,
        },
      ],
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate('/request');
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="bg-white p-5 rounded-[55px] shadow py-12">
      <div className="grid-cols-2 gap-4 flex">
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request</legend>
          <form onSubmit={handleSubmit(onSubmitRequest)}>
            <div className="flex gap-4 justify-center">
              <div className="w-full">
                <Select
                  name="activity_name"
                  label="Activity"
                  options={[
                    {
                      value: 1,
                      label: 'INBOUND',
                    },
                    {
                      value: 2,
                      label: 'OUTBOUND',
                    },
                    {
                      value: 3,
                      label: 'RELOCATE-OUT',
                    },
                    {
                      value: 3,
                      label: 'RELOCATE-IN',
                    },
                  ]}
                  placeholder=""
                  register={register}
                  errors={errors}
                />
              </div>
              <div className="w-full">
                <DatePicker
                  name="activity_date"
                  label="Date"
                  placeholder="Date / Month / Year"
                  register={register}
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
            <div>
              <TextArea name="notes" label="Notes" register={register} errors={errors} />
            </div>
          </form>
        </fieldset>

        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request Detail</legend>
          <form onSubmit={handleSubmitProd(onAddProd)}>
            <div className="flex gap-4 justify-center">
              <div className="w-full col-span-2">
                <Select
                  name="product_name"
                  label="Product"
                  options={data?.map(i => {
                    return {
                      value: i.id,
                      label: i.product_name,
                    };
                  })}
                  placeholder=""
                  register={registerProd}
                  errors={errorsProd}
                />
              </div>
              <div className="">
                <Input name="qty" label="QTY" register={registerProd} errors={errorsProd} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button px={8} type="submit" size="sm" className="rounded-full bg-[#7D8F69] text-[#fff] mr-6">
                + Add
              </Button>
            </div>
          </form>
          <div className="border-b border-[#7D8F69] my-6"> </div>
          <div>
            <div className="flex">
              <InputDetail
                value="SKU: ABC1234"
                label="Energizer AA C2"
                customStyleLabel="font-bold text-md mb-0"
                customStyleSpan="text-md"
              />
              <div className="flex gap-20 mt-6">
                <span className="">X</span>
                <Text>100</Text>
              </div>
            </div>
            <div className="flex">
              <InputDetail
                value="SKU: ABC1234"
                label="Energizer AA C2"
                customStyleLabel="font-bold text-md mb-0"
                customStyleSpan="text-md"
              />
              <div className="flex gap-20 mt-6">
                <span className="">X</span>
                <Text>100</Text>
              </div>
            </div>
            <div className="flex">
              <InputDetail
                value="SKU: ABC1234"
                label="Energizer AA C2"
                customStyleLabel="font-bold text-md mb-0"
                customStyleSpan="text-md"
              />
              <div className="flex gap-20 mt-6">
                <span className="">X</span>
                <Text>100</Text>
              </div>
            </div>
          </div>
          <div className="border-b border-[#7D8F69] my-6"> </div>
          <div className="flex justify-between">
            <Text>Total Product</Text>
            <Text>300</Text>
          </div>
        </fieldset>
      </div>
      <div className="flex justify-end mt-6">
        <div className="flex">
          <div>
            <Button
              onClick={() => navigate(-1)}
              px={8}
              size="sm"
              className="rounded-full bg-white border border-[#7D8F69] text-black mr-6"
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button type="submit" px={8} size="sm" className="rounded-full bg-[#7D8F69] text-[#fff] mr-6">
              Submit
            </Button>
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
