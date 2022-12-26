import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalculatorIcon, XIcon } from '@heroicons/react/outline';
import Moment from 'moment';
import { StopIcon } from '@heroicons/react/solid';
import { RequestApi, TransitApi } from '../../../services/api-transit';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import TextArea from '../../../components/textarea-component';
import { StorageApi } from '../../../services/api-master';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
import Datatable from '../../../components/datatable-component';
import Select from '../../../components/select-component';
import LoadingComponent from '../../../components/loading-component';
import { toCalculate } from '../../../utils/helper';

const totalRFID = 110;
const swalButton = Swal.mixin({
  customClass: {
    confirmButton: 'rounded rounded-2xl bg-cyan-500 w-20 text-[#fff] font-bold',
    cancelButton: 'rounded rounded-2xl bg-red-500 w-20 ml-2 text-[#fff] font-bold',
  },
  buttonsStyling: false,
});
function Screen() {
  const friend = yup.object({
    rack: yup.string().required('Required').default(''),
    name: yup.string().required('Required').default(''),
  });

  const schema = yup.object({
    friends: yup.array().of(friend).min(1, 'Must have at least one friend').max(4, 'That is too many friends'),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: 'test',
  });
  console.log('fields', fields);
  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };
  const [data, setData] = useState([]);
  const [storeSplit, setStoreSplit] = useState([]);
  const [transitData, setTransitData] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [requestDetailData, setRequestDetailData] = useState();
  const [requestId, setRequestId] = useState('');
  const [totalRequest, setTotalRequest] = useState(0);
  const [counter, setCounter] = useState(1);
  const [timer, setTimer] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    getDetailRequest();
  }, []);

  useEffect(() => {
    if (requestId !== '') {
      setLoadingRequest(true);

      RequestApi.find(requestId)
        .then(res => {
          setTransitData(res.detail);
          setValue('activity_date', res?.activity_date ? Moment(res?.activity_date).toDate() : null);
          setValue('request_number', res?.request_number ? res?.request_number : '-');
          setTotalRequest(toCalculate(res.detail, 'qty'));
          setRequestDetailData(res.detail);
          setLoadingRequest(false);
        })
        .catch(error => {
          Swal.fire({ text: error?.message, icon: 'error' });
        });
    }
  }, [requestId]);

  const startScanning = () => {
    setScanning(true);

    setTimer(
      setInterval(() => {
        TransitApi.get().then(() => {});
      }, 5000)
    );
    setIsScanned(false);
  };
  const stopScanning = () => {
    setScanning(false);
    setIsScanned(true);
    clearInterval(timer);
  };

  const getDetailRequest = () => {
    // if (Object.entries(filterData).length !== 0) {
    Promise.allSettled([
      RequestApi.get({ ...defaultSort }).then(res => res),
      StorageApi.get({ warehouse_id: 2 }).then(res => res),
      // TransitApi.get({ warehouse_id: 2, product_id: 2 }).then(res => res),
    ])
      .then(result => {
        setData(result[1].value.data);
        // setStorageData(result[2].value.data);
        // console.log('result', result);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.error, icon: 'error' });
      });
  };

  const onSplit = (idx, qty) => {
    setId(qty);
    const findData = data.find(i => i.id === qty);
    if (qty / counter !== 1 && qty / counter > 1) {
      setStoreSplit(prev => {
        if (prev.length === 0) {
          return [
            { ...findData, ...{ child_qty: findData.id / counter } },
            ...prev,
            { child_qty: findData.id / counter },
          ];
        }
        return [...prev, { child_qty: findData.id / counter }];
      });

      setData(data.filter(i => i.id !== qty));
    }
  };

  useEffect(() => {
    setData(prev => {
      if (storeSplit.find(i => i.id === id)?.id > prev.find(i => i.id !== id)?.id) {
        return [...storeSplit, ...prev];
      }
      return [...prev, ...storeSplit];
    });
  }, [storeSplit]);

  const onSubmitRFID = () => {
    let pass = onOpen;
    if (totalRFID === totalRequest) {
      pass = true;
    } else {
      swalButton
        .fire({
          html: '<b> Jumlah data pada Request Detail tidak sesuai dengan data pada RFID Detected. Lanjutkan proses ? <b>',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
        })
        .then(result => {
          if (result.isConfirmed) {
            setOnOpen(!pass);
          }
        });
    }
    return pass;
  };

  const onProcess = idx => {
    if (idx) {
      setRequestId(idx);

      setOnOverview(!onOverview);
    }
  };

  const onFinalSubmit = data => {
    // console.log('default', defaultData);
    console.log('onFinalSubmit', data);
    const body = [];
    TransitApi.inbound(body)
      .then(() => {
        // setOnOpen(!onOpen);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  console.log('transitData', transitData);

  return (
    <div className="bg-white p-5 rounded-[55px] shadow">
      <fieldset className="border border-[#7D8F69] w-full h-full px-8 rounded-[55px] pb-6">
        <legend className="px-2 text-[28px] text-[#7D8F69] font-semibold">Request</legend>
        <div className="grid grid-cols-8 gap-6">
          <button
            type="submit"
            onClick={() => setOnOverview(!onOverview)}
            className="bg-[#526C55] h-[130px] w-[150px] rounded-lg grid place-content-center ml-6 mt-2 col-span-2 "
          >
            <p className="text-lg text-[#fff] font-bold">Request</p>
            <CalculatorIcon className="h-20 w-15 bg-[#526C55] stroke-[#fff]" />
          </button>

          <div className="col-span-3">
            <Input
              name="request_number"
              label="Request Number"
              register={register}
              control={control}
              errors={errors}
              disabled
            />
            <DatePicker
              name="activity_date"
              label="Date"
              register={register}
              control={control}
              errors={errors}
              disabled
            />
          </div>
          <div className="col-span-3">
            <TextArea name="notes" label="Notes" register={register} control={control} errors={errors} />
          </div>
        </div>
      </fieldset>

      <div className="grid-cols-2 gap-4 flex">
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69] font-semibold">Request Detail</legend>
          <LoadingComponent visible={loadingRequest} />
          {!loadingRequest ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>SKU</Th>
                    <Th>Product</Th>
                    <Th isNumeric>Qty</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {requestDetailData?.map((d, i) => {
                    return (
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{d.product_sku}</Td>
                        <Td>{d.product_name}</Td>
                        <Td isNumeric>{d.qty}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : null}
        </fieldset>
        <fieldset className="border border-[#7D8F69] w-full h-full px-8 py-12 rounded-[55px]">
          <legend className="px-2 text-[28px] text-[#7D8F69] font-semibold">RFID Detected</legend>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>SKU</Th>
                  <Th>Product</Th>
                  <Th isNumeric>Qty</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((d, i) => {
                  return (
                    <Tr key={i}>
                      <Td>{i + 1}</Td>
                      <Td>{d.request_by}</Td>
                      <Td>{d.status}</Td>
                      <Td isNumeric>{d.id}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </fieldset>
      </div>
      <div className="border border-[#7D8F69] w-full h-full px-8 rounded-[55px] py-2 mt-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="pt-2">
            <div>Total Request</div>
            <div>Total RFID Detected</div>
          </div>
          <div className="pt-2">
            <div className="font-bold">{totalRequest}</div>
            <div className="font-bold">{totalRFID}</div>
          </div>
          <div className="flex py-4">
            <Button
              px={12}
              size="sm"
              className="rounded-2xl bg-[#432009] text-[#fff] font-bold"
              onClick={scanning ? stopScanning : startScanning}
            >
              {scanning ? <StopIcon className="h-6 animate-pulse" /> : <p className="tracking-wide">Scan</p>}
            </Button>

            <Button
              px={12}
              size="sm"
              className="rounded-2xl ml-4 bg-[#526C55] text-[#fff] font-bold"
              onClick={onSubmitRFID}
              disabled={!isScanned}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      {onOverview && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="rounded rounded-2xl border shadow-lg modal-container bg-white w-[80%] mx-auto z-50 overflow-y-auto ">
            <div className="grid justify-items-end">
              <XIcon className="h-6 stroke-2" onClick={() => setOnOverview(!onOverview)} />
            </div>
            <div className="modal-content py-4 text-left px-6">
              <Datatable
                api={RequestApi}
                filterParams={{ status: 'PENDING' }}
                filterEnd
                filters={[
                  {
                    name: 'text',
                    type: 'addtext',
                    text: 'Request Overview',
                  },
                  {
                    name: 'request_number',
                    placeholder: 'Request Number',
                    icon: MagnifyClass,
                    alt: 'magnify',
                    type: 'input:addOn',
                    col: 2,
                  },
                ]}
                columns={[
                  { header: 'Request Number', value: 'request_number', copy: true, type: 'link' },
                  { header: 'User', value: 'request_by', copy: true },
                  { header: 'Activity', value: 'activity_name', copy: true },
                  { header: 'Date', value: 'activity_date', copy: true, type: 'date' },
                  { header: 'Notes', value: 'notes', copy: true, type: 'scrollable' },
                  { header: 'Status', value: 'status', copy: true },
                  { header: ' ', value: ' ', type: 'action-button' },
                ]}
                onSearch
                onActionButton={(idx, data) => onProcess(idx, data)}
              />
            </div>
          </div>
        </div>
      )}
      {onOpen && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 overflow-y-auto h-80">
            <form className="modal-content py-4 text-left px-6" onSubmit={handleSubmit(onFinalSubmit)}>
              <p className="text-MD font-bold">Dashboard Transit</p>
              <div className="flex-1" />
              <TableContainer>
                <Table varianT="simple">
                  <Thead>
                    <Tr>
                      <Th>No</Th>
                      <Th>SKU</Th>
                      <Th>ProducT</Th>
                      <Th>QTy(ID val)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transitData?.map((d, i) => {
                      console.log('ddd', d);
                      return (
                        <Tr key={i}>
                          <Td>{i + 1}</Td>
                          <Td>{d.request_by}</Td>
                          <Td>{d.status}</Td>
                          <Td>{d.id}</Td>
                          <Td>
                            <div className="w-20">
                              <Select
                                name="rack"
                                placeholder="Rack"
                                options={[
                                  {
                                    value: 'asd',
                                    label: '123',
                                  },
                                ]}
                                register={register}
                                control={control}
                              />
                            </div>
                          </Td>

                          <Td>
                            {d.id ? (
                              <Button
                                size="md"
                                className="text-[#fff] font-bold bg-[#29A373] rounded-2xl"
                                key={i}
                                onClick={() => {
                                  setCounter(count => count + 1);
                                  onSplit(i + 1, d.id);
                                }}
                                px={6}
                              >
                                Split
                              </Button>
                            ) : null}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>

              <div className="grid place-items-end pt-4">
                <div>
                  <Button
                    px={12}
                    size="sm"
                    className="rounded-2xl ml-4 bg-red-500 text-[#fff] font-bold"
                    onClick={() => setOnOpen(!onOpen)}
                  >
                    Cancel
                  </Button>
                  <Button
                    px={12}
                    size="sm"
                    className="rounded-2xl ml-4 bg-[#526C55] text-[#fff] font-bold"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Screen;
