import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalculatorIcon, XIcon } from '@heroicons/react/outline';
import { RequestApi, TransitApi } from '../../../services/api-transit';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import TextArea from '../../../components/textarea-component';
import { StorageApi } from '../../../services/api-master';
import MagnifyClass from '../../../assets/images/magnify-glass.svg';
import ModalTableOverview from '../../../components/modal-overview-table-component';

function Screen() {
  const schema = yup.object().shape({
    request_number: yup.string().nullable(),
    activity_date: yup.date().nullable(),
    notes: yup.string().nullable(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };
  const [data, setData] = useState([]);
  const [filterData] = useState({
    ...defaultSort,
  });
  // setFilterData
  const [onOpen, setOnOpen] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [overviewData, setOverviewData] = useState([]);
  const [storageData, setStorageData] = useState();
  const [storeSplit, setStoreSplit] = useState([]);
  const [splice, setSplice] = useState([]);
  const [counter, setCounter] = useState(1);
  const [id, setId] = useState();
  useEffect(() => {
    getDetailRequest();
  }, [filterData]);

  const getDetailRequest = () => {
    // if (Object.entries(filterData).length !== 0) {
    Promise.allSettled([
      RequestApi.get({ status: 'PENDING' }).then(res => res),
      RequestApi.get({ ...filterData }).then(res => res),
      StorageApi.get({ warehouse_id: 2 }).then(res => res),
      // TransitApi.get({ warehouse_id: 2, product_id: 2 }).then(res => res),
    ])
      .then(result => {
        setOverviewData(result[0].value.data);
        setData(result[1].value.data);
        setStorageData(result[2].value.data);
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

      setSplice(data.filter(i => i.id !== qty));
    }
  };

  console.log('storeSplit', storeSplit);
  useEffect(() => {
    console.log('id', id);
    console.log('setData', [...storeSplit, ...splice]);
    setData([...storeSplit, ...splice]);
  }, [storeSplit]);

  const onSubmitRFID = () => {
    Promise.allSettled(
      data.map(i => {
        return new Promise((resolve, reject) => {
          TransitApi.store([{ request_id: i.id, product_id: i.id, qty: i.id, storage_id: i.id, warehouse_id: i.id }])
            .then(res => resolve(res))
            .catch(err => reject(err));
        });
      })
    ).then(res => {
      const success = [];
      const failed = [];
      res.forEach(result => {
        if (result.status === 'fulfilled') {
          success.push(true);
        } else {
          failed.push(true);
        }
      });
      if (failed.length > 0) {
        setOnOpen(!onOpen);
        // Swal.fire({ text: 'There is some problem occured', icon: 'error' });
      } else {
        setOnOpen(!onOpen);
      }
    });
  };
  const onFinalSubmit = data => {
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
            <div className="font-bold">160</div>
            <div className="font-bold">179</div>
          </div>
          <div className="flex py-4">
            <Button px={12} size="sm" className="rounded-2xl bg-[#432009] text-[#fff] font-bold">
              Scan
            </Button>
            <Button
              px={12}
              size="sm"
              className="rounded-2xl ml-4 bg-[#526C55] text-[#fff] font-bold"
              onClick={onSubmitRFID}
              disabled={false}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      {onOverview && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster "
          // onClick={onOverview ? () => setOnOverview(!onOverview) : null}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 overflow-y-auto ">
            <div className="grid justify-items-end">
              <XIcon className="h-6 stroke-2" onClick={() => setOnOverview(!onOverview)} />
            </div>
            <div className="modal-content py-4 text-left px-6">
              <div className="grid grid-cols-3 mb-4">
                <p className="text-MD font-bold">Request Overview</p>
                <div />
                <Input
                  name="request"
                  placeholder="Request Number"
                  addOnleft
                  icon={<img src={MagnifyClass} alt="magnify" className="h-6" />}
                  register={register}
                  control={control}
                />
              </div>
              <ModalTableOverview
                datas={overviewData || []}
                storage={storageData}
                register={register}
                control={control}
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
              {/* <TableContainer> */}
              <table variant="simple">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th isNumeric>Qty || ID</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((d, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.request_by}</td>
                        <td>{d.status}</td>
                        <td>{d.id}</td>

                        <td>
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* </tableContainer> */}

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
