import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

// import RequestApi from '../../../services/api-master';
import Select from '../../../components/select-component';
import InputDetail from '../../../components/input-detail-component';
import Input from '../../../components/input-component';
import TextArea from '../../../components/textarea-component';
import DatePicker from '../../../components/datepicker-component';
import RequestApi from '../../../services/api-master';

function Screen() {
  //   const { displayName } = props;
  //   const navigate = useNavigate();

  const [data, setData] = useState([]);
  console.log('data', data);

  const schema = yup.object().shape({
    activity_name: yup.string().nullable().required(),
    activity_date: yup.date().nullable().required(),
    notes: yup.string().nullable().required(),
  });

  const {
    register,
    control,
    //   handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    RequestApi.get()
      .then(res => {
        setData(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  //   const onSubmitRequest = data => {
  //     setLoading(true);
  //     RequestApi.store({
  //       name: data.name,
  //       code: data.code,
  //       address: data.address,
  //       phone: data.phone,
  //       capacity: data.capacity,
  //       last_stock_opname: data.last_stock_opname,
  //       location: data.location,
  //     })
  //       .then(() => {
  //         setLoading(false);
  //         Swal.fire({ text: 'Successfully Saved', icon: 'success' });
  //         navigate('/master/warehouse');
  //       })
  //       .catch(error => {
  //         setLoading(false);
  //         Swal.fire({ text: error?.message, icon: 'error' });
  //       });
  //   };

  return (
    <div className="bg-white p-5 rounded-[55px] shadow py-12">
      <div className="grid-cols-2 gap-4 flex">
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request</legend>
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
                ]}
                placeholder=""
                register={register}
                errors={errors}
              />
            </div>
            <div className="w-full">
              <DatePicker
                name="activity_data"
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
        </fieldset>
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69]">Request Detail</legend>
          <div className="flex gap-4 justify-center">
            <div className="w-full col-span-2">
              <Select
                name="product_name"
                label="Product"
                options={[
                  {
                    value: 1,
                    label: 'Sabun',
                  },
                  {
                    value: 2,
                    label: 'Masker',
                  },
                  {
                    value: 3,
                    label: 'Keju',
                  },
                ]}
                placeholder="Select Product"
                register={register}
                errors={errors}
              />
            </div>
            <div className="">
              <Input name="qty" label="QTY" register={register} errors={errors} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              // onClick={()}
              px={8}
              size="sm"
              className="rounded-full bg-[#7D8F69] text-[#fff] mr-6"
            >
              + Add
            </Button>
          </div>
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
              // onClick={()}
              px={8}
              size="sm"
              className="rounded-full bg-white border border-[#7D8F69] text-black mr-6"
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              // onClick={()}
              px={8}
              size="sm"
              className="rounded-full bg-[#7D8F69] text-[#fff] mr-6"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
