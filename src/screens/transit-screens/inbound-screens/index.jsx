import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalculatorIcon, XIcon } from '@heroicons/react/outline';
import { RequestApi, TransitApi } from '../../../services/api-transit';
import Input from '../../../components/input-component';
import DatePicker from '../../../components/datepicker-component';
import TextArea from '../../../components/textarea-component';
import SimpleTable from '../../../components/simple-table-component';
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
  const [filterData, setFilterData] = useState({
    ...defaultSort,
  });
  const [onOpen, setOnOpen] = useState(false);
  const [onOverview, setOnOverview] = useState(false);
  const [overviewData, setOverviewData] = useState([]);
  const [storageData, setStorageData] = useState();
  const [storeSplit, setStoreSplit] = useState([]);
  const [splice, setSplice] = useState([]);
  let counter = 0;

  useEffect(() => {
    getDetailRequest();
  }, [filterData]);

  const getDetailRequest = () => {
    // if (Object.entries(filterData).length !== 0) {
    Promise.allSettled([
      RequestApi.get({ status: 'PENDING' }).then(res => res),
      RequestApi.get({ ...filterData }).then(res => res),
      StorageApi.get({ warehouse_id: 3 }).then(res => res),
    ])

      .then(result => {
        setOverviewData(result[0].value.data);
        setData(result[1].value.data);
        setStorageData(result[2].value.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.data?.error, icon: 'error' });
      });
    // }
  };

  const onSubmit = data => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }

        if (data[dt] instanceof Date) {
          if (dt.toLowerCase().includes('to')) {
            data[dt] = Moment(data[dt]).endOf('day').format('YYYY-MM-DD');
          } else {
            data[dt] = Moment(data[dt]).startOf('day').format('YYYY-MM-DD');
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    }
    setFilterData(prev => ({ ...prev, data }));
  };
  const onSplit = (idx, qty) => {
    counter += 1;
    const findData = data.find(i => i.id === idx);
    if (qty / counter >= 1) {
      setStoreSplit(prev => [...prev, { id: findData.id / counter }]);
      setSplice(data.filter(i => i.id !== qty));
      setData(data.filter(i => i.id !== qty));
    }
  };

  useEffect(() => {
    setData(prev => [...prev, ...storeSplit, ...splice]);
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
  const onFinalSubmit = () => {
    const body = [];
    TransitApi.inbound(body)
      .then(() => {
        setOnOpen(!onOpen);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  return (
    <div className="bg-white p-5 rounded-[55px] shadow">
      <fieldset className="border border-[#7D8F69] w-full h-full px-8 rounded-[55px] pb-6">
        <legend className="px-2 text-[28px] text-[#7D8F69] font-semibold">Request</legend>

        <form className="grid grid-cols-8 gap-6" onSubmit={handleSubmit(onSubmit)}>
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
        </form>
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
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded z-50 overflow-y-auto ">
            <div className="modal-content py-4 text-left px-6">
              <p className="text-MD font-bold">Dashboard Transit</p>
              <div className="flex-1" />

              <SimpleTable
                columns={[
                  { header: 'No', value: 'activity_name' },
                  { header: 'SKU', value: 'created_by' },
                  { header: 'Product', value: 'request_by' },
                  { header: 'Qty', value: 'id' },
                  {
                    header: ' ',
                    value: '  ',
                    type: 'select',
                    placeholder: 'Rack',
                    name: 'rack_number',
                    data: storageData,
                  },
                  {
                    header: ' ',
                    value: 'b  ',
                    type: 'select',
                    placeholder: 'Bay',
                    name: 'bay',
                    data: storageData,
                  },
                  {
                    header: '  ',
                    value: 'l',
                    type: 'select',
                    placeholder: 'Level',
                    name: 'level',
                    data: storageData,
                  },
                  {
                    header: ' ',
                    value: 'status',
                    name: 'qty',
                    type: 'input',
                  },
                  {
                    header: ' ',
                    value: ' ',
                    type: 'split',
                  },
                ]}
                onSplit={(id, qty) => onSplit(id, qty)}
                datas={data || []}
                storage={storageData}
                register={register}
                control={control}
              />
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
                    onClick={onFinalSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Screen;
