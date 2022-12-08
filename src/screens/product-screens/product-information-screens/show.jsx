import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { ArchiveIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { Steps, Step, useSteps } from 'chakra-ui-steps';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import InputDetail from '../../../components/input-detail-component';
import { ProductApi, WarehouseApi, StorageApi } from '../../../services/api-master';
import RightLeftIcon from '../../../assets/images/right-left-arrow.svg';
import LeftRightIcon from '../../../assets/images/left-right-arrow.svg';

const dummyJourney = [
  {
    activity_name: 'Inbound',
    request_number: '001/JUL/2000',
    date: '2-Juni-2022',
    status: 'done',
  },
  // {
  //   id: 0,
  //   date: '2022-12-06T12:58:14.891Z',
  //   product: {
  //     product_id: 0,
  //     product_sku: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //     product_name: 'string',
  //     product_category: 'string',
  //     product_desc: 'string',
  //   },
  //   warehouse: {
  //     warehouse_id: 0,
  //     warehouse_name: 'string',
  //   },
  //   storage: {
  //     storage_id: 0,
  //     rack: 'string',
  //     bay: 'string',
  //     level: 'string',
  //   },
  // },
];

const dummyProductInfo = [
  {
    warehouse_name: 'Gudang Pusat',
    total_storage: '100',
    storage: [
      {
        Rack: 'A',
        Bay: '01',
        Level: 'B',
        total: '20',
      },
      {
        Rack: 'A',
        Bay: '02',
        Level: 'C',
        total: '30',
      },
    ],
  },
  {
    warehouse_name: 'Gudang Pusat KCP',
    total_storage: '80',
    storage: [
      {
        Rack: 'A',
        Bay: '01',
        Level: 'B',
        total: '20',
      },
      {
        Rack: 'A',
        Bay: '02',
        Level: 'C',
        total: '10',
      },
      {
        Rack: 'B',
        Bay: '01',
        Level: 'B',
        total: '20',
      },
      {
        Rack: 'C',
        Bay: '02',
        Level: 'C',
        total: '30',
      },
    ],
  },
];

function ShowScreen(props) {
  const { displayName } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [warehouse, setWarehouse] = useState();
  console.log('dummmy', dummyJourney);
  console.log('warehouse', warehouse);

  useEffect(() => {
    Promise.allSettled([
      ProductApi.find(id).then(res => {
        return res.data;
      }),
      WarehouseApi.get().then(res => {
        return res.data;
      }),
      StorageApi.get().then(res => {
        return res.data;
      }),
    ])
      .then(result => {
        // console.log('result', result);
        setWarehouse(result[1].value);
        setData(result[0].value);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const steps = [
    { label: 'Inbound', description: '0001/JUL/2022', status: 'inbound' },
    { label: 'Relocate - Out', description: '0001/AUG/2022', status: 'out' },
    { label: 'Relocate - In', description: '0001/SEPT/2022', status: 'in' },
    { label: 'Relocate - In', description: '0001/SEPT/2022', status: 'in' },
    { label: 'Outbond', description: '0001/OKT/2022', status: 'outbound' },
  ];
  const { activeStep } = useSteps({
    initialStep: 1,
  });

  return (
    <div>
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
      </div>

      <div className="grid grid-rows-3 grid-flow-col gap-3">
        <div className="col-span-2 p-4">
          <strong>Detail Product</strong>
          <div className="bg-white h-full rounded-2xl p-4 mt-3">
            <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 grid-cols-2 mt-4">
              <InputDetail value={data?.product_desc} label="Name" swapBold />
              <InputDetail value={data?.product_desc} label="Category" swapBold />
              <InputDetail value={data?.product_desc} label="SKU" swapBold />
              <InputDetail value={data?.product_desc} label="Desc" swapBold />
            </div>
          </div>
        </div>
        <div className="row-span-2 col-span-2 mt-4 p-4 h-[100%]">
          <strong>Storage Details</strong>
          <div className="flex bg-white rounded-2xl h-10 mt-2 px-5 py-2">
            <p>Total Product</p>
            <div className="flex-1" />
            <strong>{data?.category_id}</strong>
          </div>
          <div
            className={`bg-white rounded-2xl mt-5 p-5 h-[40%] ${
              dummyProductInfo.length > 1 ? 'overflow-y-scroll' : ''
            }`}
          >
            <strong className="text-gray-400">Warehouse</strong>
            {dummyProductInfo.map(i => {
              return (
                <div>
                  <div>
                    <div className="flex mb-2 mt-2">
                      <strong>{i.warehouse_name}</strong>
                      <div className="flex-1" />
                      <strong>{i.total_storage}</strong>
                    </div>
                  </div>
                  <div>
                    {i.storage.map(s => {
                      return (
                        <div className="flex">
                          <div className="ml-2 mb-2">
                            <p className="ml-2 mb-2 text-gray-400">Rack</p>
                            <button type="button" className="bg-slate-300 outline outline-1 w-10 rounded-lg ml-2">
                              {s.Rack}
                            </button>
                          </div>
                          <div className="ml-2 mb-2">
                            <p className="ml-5 mb-2 text-gray-400">Bay</p>
                            <button type="button" className="bg-slate-300 outline outline-1 w-10 rounded-lg ml-5">
                              {s.Bay}
                            </button>
                          </div>
                          <div className="ml-2 mb-2">
                            <p className="ml-5 mb-2 text-gray-400">Level</p>
                            <button type="button" className="bg-slate-300 outline outline-1 w-10 rounded-lg ml-5">
                              {s.Level}
                            </button>
                          </div>
                          <div className="flex-1" />
                          <div className="my-auto">
                            <strong>{s.total}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="row-span-2 mt-5 w-[80%] pl-0">
          <strong>Product Journey</strong>
          <div className="bg-white h-full rounded-3xl mt-2 pt-10 pl-3 pr-3">
            <div className="pl-5">
              <Steps colorScheme="blue" size="lg" orientation="vertical" activeStep={activeStep}>
                {steps.map(({ label, description, status }) => {
                  return (
                    // <div className="flex">
                    // {steps && (
                    <Step
                      icon={() =>
                        status === 'inbound' ? (
                          <ArchiveIcon className="h-8 stroke-[#5081ED]" />
                        ) : status === 'in' ? (
                          <img className="h-8" style={{ transform: 'scaleX(-1)' }} alt="right" src={LeftRightIcon} />
                        ) : status === 'out' ? (
                          <img className="h-8" alt="right" src={RightLeftIcon} />
                        ) : (
                          <ShoppingCartIcon className="h-8 stroke-[#5081ED]" />
                        )
                      }
                      label={label}
                      description={`${description} 2-Jun-2022`}
                      key={label}
                    />

                    // )}
                    // <div className="flex-1" />
                    // <div>22 Jun 2022</div>
                    // </div>
                  );
                })}
              </Steps>
            </div>
            {steps.length >= 5 && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={activeStep === steps.length ? () => navigate(`/product-journey/${1}/show`) : () => {}}
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
    </div>
  );
}

export default ShowScreen;
