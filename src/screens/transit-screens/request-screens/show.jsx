import React, { useState, useEffect, useContext } from 'react';

import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
import Moment from 'moment/moment';
import { Text } from '@chakra-ui/react';
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid';
// import { SiExpertsexchange } from 'react-icons/si';

import Context from '../../../context';
import { thousandSeparator } from '../../../utils/helper';
import { RequestApi } from '../../../services/api-transit';
import TextArea from '../../../components/textarea-component';
import InputDetail from '../../../components/input-detail-component';
import Table from '../inbound-screens/component/table';

function Screen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activityStore } = useContext(Context);

  const [dataRequesById, setDataRequestById] = useState([]);
  const [dataRequesByIdDetail, setDataRequestByIdDetail] = useState([]);

  const {
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getDetailRequest();
  }, []);

  const getDetailRequest = () => {
    RequestApi.find(id)
      .then(res => {
        setDataRequestById(res);
        setDataRequestByIdDetail(res.detail);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  const updateDataRequesById = Object.values(
    Array.isArray(dataRequesByIdDetail)
      ? dataRequesByIdDetail.reduce((accu, { product_id, ...item }) => {
          if (!accu[product_id])
            accu[product_id] = {
              qty: 0,
            };

          accu[product_id] = {
            product_id,
            ...accu[product_id],
            ...item,
            qty: accu[product_id].qty + item.qty,
          };

          return accu;
        }, {})
      : []
  );

  const totalQty = Array.isArray(updateDataRequesById)
    ? updateDataRequesById.reduce((acc, item) => acc + item.qty, 0)
    : null;

  return (
    <div>
      <div className="px-5 pb-8">
        <div
          className="cursor-pointer p-2 w-12 flex justify-center hover:bg-gray-200 hover:rounded-lg mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowNarrowLeftIcon className="w-6 h-6 text-[#50B8C1] text-center" />
        </div>
        <div className="grid-cols-2 gap-6 flex max-[640px]:flex-col sm:flex-col lg:flex-row">
          <div className="w-full h-full">
            {/* <h3 className="mx-6 px-4 mb-1 text-gray-400">Request</h3> */}
            <fieldset className="bg-white border border-[#C2C2C2] w-full min-h-[507px] px-8 py-12 rounded-md mx-4 max-[640px]:mx-0 max-[640px]:px-4 max-[640px]:mb-4 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
              <legend className="px-2 text-lg text-gray-400">Request</legend>
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
                  <div className="flex gap-36 max-[640px]:flex-col max-[640px]:gap-2">
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
                <TextArea
                  name="notes"
                  label="Notes"
                  register={register}
                  errors={errors}
                  value={dataRequesById?.notes}
                  disabled
                />
              </div>
            </fieldset>
          </div>
          <div className="w-full h-full">
            {/* <h4 className="mx-6 px-4 mb-1 text-gray-400">Request Detail</h4> */}
            <fieldset className="bg-white border border-[#C2C2C2] w-full min-h-[507px] px-8 py-12 rounded-md mx-4 max-[640px]:mx-0 max-[640px]:px-4 sm:px-6 sm:mx-0 lg:mx-4 lg:px-8">
              <legend className="px-2 text-lg text-gray-400">Request Detail</legend>
              <div>
                {/* <div className="flex justify-between">
                  <Text className="text-gray-400">Product</Text>
                  <Text className="text-gray-400">Qty</Text>
                </div> */}
                {/* {updateDataRequesById.map(({ qty, product_id, product_name, product_sku }) => {
                  return (
                    <div className="flex" key={product_id}>
                      <InputDetail
                        value={`SKU: ${product_sku}`}
                        label={product_name}
                        customStyleLabel="font-bold text-md mb-0"
                        customStyleSpan="text-md"
                      />
                      <div className="flex relative gap-20 mt-6 max-[640px]:gap-6">
                        <span className="absolute right-24 max-[640px]:right-12">
                          <SiExpertsexchange className="w-4 h-4 text-red-200" />
                        </span>
                        <Text>{thousandSeparator(qty)}</Text>
                      </div>
                    </div>
                  );
                })} */}
                <Table
                  // loading={loadtable}
                  data={updateDataRequesById.map(data => {
                    return {
                      product_id: data.product_id,
                      product_name: data.product_name,
                      product_sku: data.product_sku,
                      qty: data.qty,
                    };
                  })}
                  register
                  // isLarge={isLarge}
                />
              </div>
              <div className="border-b border-gray-400 my-6"> </div>
              <div className="flex justify-between font-bold">
                <Text>Total Product</Text>
                <Text>{thousandSeparator(totalQty)}</Text>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="flex justify-end mt-16">
          <div className="flex">
            <div>
              <Link
                onClick={() => {
                  activityStore.setRequestNumber(dataRequesById?.id);
                  activityStore.setActivityName(dataRequesById?.activity_name);
                }}
                hidden={dataRequesById?.status !== 'PENDING'}
                type="button"
                to={`/${dataRequesById?.activity_name}`}
                px={8}
                size="sm"
                className="relative border-none font-bold text-[12px] mr-12 text-[#fff] w-[6rem] h-[1.5rem] leading-[1.5rem] text-center from-[#50B8C1] via-[#50B8C1] to-[#50B8C1] bg-gradient-to-r bg-300% rounded-md z-[1] before:absolute before:-top-[5px] before:-right-[5px] before:-left-[5px] before:-bottom-[5px] before:-z-[1] before:bg-gradient-to-r hover:animate-ani hover:before:blur-[10px] before:from-[#50B8C1] before:via-[#50B8C1] before:to-[#50B8C1] before:bg-400% before:rounded-md before:duration-1000 active:bg-gradient-to-r active:from-[#50B8C1] active:via-[#50B8C1] active:to-[#50B8C1] my-2"
              >
                Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Screen;
