import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { ArchiveIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import Moment from 'moment';
import { Steps, Step, useSteps } from 'chakra-ui-steps';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductInfoApi, ProductJourney } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import RightLeftIcon from '../../../assets/images/right-left-arrow.svg';
import LeftRightIcon from '../../../assets/images/left-right-arrow.svg';

function ShowScreen(props) {
  const { displayName } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [dataJourney, setDataJourney] = useState([]);
  const [storageDetails, setStorageDetails] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      ProductJourney.find(id).then(res => {
        return res;
      }),
      ProductInfoApi.find(id).then(res => {
        return res;
      }),
    ])
      .then(result => {
        if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled') {
          setDataJourney(result[0].value.journey);
          setData(result[1].value);
          const filterWarehouse = [
            ...new Map(
              result[1].value?.product.product_info.map(i => [JSON.stringify(i.warehouse_id), i.warehouse_id])
            ).values(),
          ];

          const body = {
            storage_details: filterWarehouse.map(f => {
              return {
                list: result[1].value.product.product_info
                  .filter(s => s.warehouse_id === f)
                  .map(i => {
                    return {
                      warehouse: i.warehouse_name,
                      warehouse_id: i.warehouse_id,
                      total: 5,
                      storage: [
                        {
                          rack: i.rack,
                          bay: i.bay,
                          level: i.level,
                          total: i.qty || 2,
                        },
                      ],
                    };
                  }),
              };
            }),
          };
          setStorageDetails(body.storage_details);
        } else if (result[0].status === 'rejected' && result[1].status === 'rejected') {
          Swal.fire({ text: 'Something Went Wrong', icon: 'error' });
        }
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const steps = dataJourney.length > 5 ? dataJourney.splice(-Number(`${dataJourney.length - 5}`)) : dataJourney;
  const { activeStep } = useSteps({
    initialStep: dataJourney.length,
  });
  return (
    <>
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3">
        <div className="col-span-2">
          <div className="col-span-2 px-4">
            <strong>Detail Product</strong>
            <div className="bg-white h-full rounded-2xl p-4 mt-3">
              <div className="grid ml-10 grid-cols-2 py-3">
                <InputDetail value={data?.product.product_name} label="Name" swapBold />
                <InputDetail value={data?.product.product_category} label="Category" swapBold />
                <InputDetail value={data?.product.product_sku} label="SKU" swapBold />
                <InputDetail value={data?.product.product_desc || '-'} label="Desc" swapBold />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 px-4 mt-4">
          <div className="grid grid-row-2">
            <strong>Storage Details</strong>
            <div>
              <div className="flex bg-white rounded-2xl h-10 mt-2 px-5 py-2">
                <p>Total Product</p>
                <div className="flex-1" />
                <strong className="mr-5">{data?.qty}</strong>
              </div>
            </div>
            <div className="h-80">
              <div
                className={`bg-white rounded-2xl mt-5 p-5 h-full ${
                  storageDetails.length > 1 ? 'overflow-y-scroll' : ''
                }`}
              >
                <strong className="text-gray-400">Warehouse</strong>
                {storageDetails.length > 0
                  ? storageDetails.map(i => {
                      return i.list.map(c => {
                        return (
                          <>
                            <div className="flex mb-2 mt-2">
                              <strong>{c.warehouse}</strong>
                              <div className="flex-1" />
                              <strong className="mr-5">{c.total}</strong>
                            </div>
                            {c.storage.map(s => {
                              return (
                                <div className="grid grid-cols-8 ">
                                  <div className="mb-3">
                                    <p className="mb-2 text-gray-400">Rack</p>
                                    <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                      {s.rack}
                                    </button>
                                  </div>
                                  <div className="mb-3">
                                    <p className="mb-2 text-gray-400 w-20">Bay</p>
                                    <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                      {s.bay}
                                    </button>
                                  </div>
                                  <div>
                                    <p className="mb-2 text-gray-400 w-20">Level</p>
                                    <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                      {s.level}
                                    </button>
                                  </div>
                                  <div className="col-span-4" />
                                  <div className="my-auto mr-5 flex">
                                    <div className="flex-1" />
                                    <strong>{s.total}</strong>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      });
                    })
                  : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-2 pl-1">
          <strong>Product Journey</strong>
          <div className="bg-white h-full rounded-3xl mt-2 pt-10 pl-3 pr-3">
            <div className="pl-5">
              <Steps colorScheme="blue" size="lg" orientation="vertical" activeStep={activeStep}>
                {steps.map(item => {
                  return (
                    <Step
                      icon={() =>
                        item.status.toLowerCase() === 'inbound' ? (
                          <ArchiveIcon className="h-8 stroke-[#5081ED]" />
                        ) : item.status.toLowerCase() === 'relocate - in' ? (
                          <img className="h-8" style={{ transform: 'scaleX(-1)' }} alt="right" src={LeftRightIcon} />
                        ) : item.status.toLowerCase() === 'relocate - out' ? (
                          <img className="h-8" alt="right" src={RightLeftIcon} />
                        ) : (
                          <ShoppingCartIcon className="h-8 stroke-[#5081ED]" />
                        )
                      }
                      label={item.status}
                      description={`${item.request_number} ${Moment(item.date).format('DD-MMM-YYYY')}`}
                      key={item.status}
                    />
                  );
                })}
              </Steps>
            </div>
            {steps.length >= 5 && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={activeStep === steps.length ? () => navigate(`/product-journey/${id}/show`) : () => {}}
                  className={`${
                    activeStep === steps.length ? 'bg-[#232323] text-white ' : 'bg-gray-500 text-gray-200 '
                  } border border-gray-500 text-md rounded-xl border-3 py-1 px-8 hover:bg-black mt-5`}
                >
                  More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowScreen;
