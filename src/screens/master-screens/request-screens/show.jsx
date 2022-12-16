import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import { useParams } from 'react-router-dom';

import * as yup from 'yup';
import Moment from 'moment/moment';
import Swal from 'sweetalert2';
import { Button, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import RequestApi from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import TextArea from '../../../components/textarea-component';

function Screen() {
  const [dataRequesById, setDataRequestById] = useState([]);

  const schema = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().required(),
  });

  const {
    register,
    // control,
    //   handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getDetailRequest();
  }, []);

  const getDetailRequest = () => {
    RequestApi.find(1)
      .then(res => {
        setDataRequestById(res);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  const totalQty = dataRequesById?.detail?.reduce((accumulator, object) => {
    return accumulator + object.qty;
  }, 0);

  return (
    <div className="bg-white p-5 rounded-[55px] shadow py-12">
      <div className="grid-cols-2 gap-4 flex">
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request</legend>
          <div className="flex flex-col">
            <div className="w-full">
              <InputDetail
                value={dataRequesById.request_number}
                label="Request Number"
                customStyleLabel="text-gray-400 text-md"
                customStyleSpan="font-bold text-md"
              />
            </div>
            <div>
              <div className="flex gap-36">
                <div>
                  <InputDetail
                    value={dataRequesById.activity_name}
                    label="Activity"
                    customStyleLabel="text-gray-400 text-md"
                    customStyleSpan="font-bold text-md"
                  />
                </div>
                <div>
                  <InputDetail
                    value={Moment(dataRequesById.activity_date).format('DD MMM, YYYY')}
                    label="Date"
                    customStyleLabel="text-gray-400 text-md"
                    customStyleSpan="font-bold text-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <TextArea name="notes" label="Notes" register={register} errors={errors} />
          </div>
        </fieldset>
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request Detail</legend>
          <div>
            <div className="flex justify-between">
              <Text className="text-gray-400">Product</Text>
              <Text className="text-gray-400">Qty</Text>
            </div>
            {dataRequesById?.detail?.map(({ qty, product_id, product_name, product_sku }) => {
              return (
                <div className="flex" key={product_id}>
                  <InputDetail
                    value={`SKU: ${product_sku}`}
                    label={product_name}
                    customStyleLabel="font-bold text-md mb-0"
                    customStyleSpan="text-md"
                  />
                  <div className="flex gap-20 mt-6">
                    <span className="">X</span>
                    <Text>{qty}</Text>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-b border-[#7D8F69] my-6"> </div>
          <div className="flex justify-between">
            <Text>Total Product</Text>
            <Text>{totalQty}</Text>
          </div>
        </fieldset>
      </div>
      <div className="flex justify-end mt-6">
        <div className="flex">
          <div>
            <Button
              // onClick={()}
              px={8}
              size="sm"
              className="rounded-full bg-[#7D8F69] text-[#fff] mr-6"
            >
              Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
