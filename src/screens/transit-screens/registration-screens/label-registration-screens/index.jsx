import React, { useState, useEffect, useMemo } from 'react';
import { useMediaQuery, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../../../../components/select-component';
import InputComponent from '../../../../components/input-component';
import DatePicker from '../../../../components/datepicker-component';
import { ProductApi } from '../../../../services/api-master';
import TableRegistration from '../../../../components/table-registration-component';
import FilePicker from '../../../../components/file-local-picker-component';
// import Loading from '../../../assets/lotties/Loading.json';
// import LottiesAnimation from '../../../components/lotties-animation-component';

const dummyProductRegistered = [];
const schemaSubmitRegistration = yup.object().shape({
  product_id: yup.string().nullable().required(),
  registration_date: yup.date().nullable().required(),
  notes: yup.string().nullable().max(255),
});

function Screen() {
  const [dataProduct, setDataProduct] = useState([]);
  //   const [error, setErrors] = useState(false);
  //   const [loadingRFID, setLoadingRFID] = useState(false);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  const cachedRfidData = localStorage.getItem('fileContent');
  const [jsonArray, setJsonArray] = useState([]);
  const [dummyRfidRegister, setDummyRfidRegister] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const {
    // handleSubmit,
    // reset,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRegistration),
  });

  useEffect(() => {
    if (cachedRfidData !== null) {
      const lines = cachedRfidData.split('\n');
      console.log('lines', lines);
      const newJsonArray = lines.filter(line => line.trim() !== '').map(line => ({ rfid_number: line.trim() }));
      setJsonArray(newJsonArray);
    } else {
      console.log('No data in localStorage');
    }
  }, [cachedRfidData]);

  useEffect(() => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  useEffect(() => {
    setLoadingTable(true);
    if (jsonArray.length > 0) {
      setDummyRfidRegister(jsonArray);
      setLoadingTable(false);
    }
    setLoadingTable(false);
  }, [jsonArray]);

  const memoizedData = useMemo(() => {
    return dummyRfidRegister.map(i => {
      return {
        key: i.product_id,
        rfid_number: i.rfid_number,
        product_id: i.product_id,
        product_name: i.product_name,
        product_sku: i.sku,
        in_stock: i.in_stock,
      };
    });
  }, [dummyRfidRegister]);

  const handleFileSelect = fileContent => {
    const lines = fileContent.split('\n');
    const newJsonArray = lines.filter(line => line.trim() !== '').map(line => ({ rfid_number: line.trim() }));
    setJsonArray(newJsonArray);
  };

  return (
    <div>
      <div className="px-5">
        <div className={`${isLarge ? 'grid grid-cols-3' : ''} w-full pb-2`}>
          <DatePicker name="registration_date" label="Date" register={register} control={control} errors={errors} />
        </div>
        <div className="grid grid-cols-3 space-x-[53%]">
          <InputComponent name="notes" label="Notes" register={register} control={control} errors={errors} />
          <Select
            name="product_id"
            label="Product"
            placeholder="Product"
            options={dataProduct?.map((i, index) => {
              return {
                key: index,
                value: i.id,
                label: i.product_name,
              };
            })}
            register={register}
            errors={errors}
            isDefaultOptions
          />
        </div>
      </div>
      <div className="grid grid-rows-2 px-5 py-1">
        <div className={`${isLarge ? 'flex gap-6' : ''} row-span-2 justify-center`}>
          <div className="w-full mb-6">
            {/* <h1 className="px-3 text-gray-400">Request Detail</h1> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text- xl:text-xl text-[#1F2937] font-semibold">Product Registered</legend>
              {/* <LoadingComponent visible={loadingRequest} /> */}
              {/* <LottiesAnimation
                animationsData={Loading}
                visible={loadingRequest}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              /> */}
              {/* {!loadingRequest ?  */}
              <TableRegistration data={dummyProductRegistered} isLarge={isLarge} productRegistered />
              {/* //    : null} */}
            </fieldset>
          </div>
          <div className="w-full mb-6">
            {/* <h2 className="px-3 text-gray-400">RFID Detected</h2> */}
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text-xl xl:text-xl text-[#1F2937] font-semibold">RFID Detected</legend>
              {/* <LoadingComponent visible={loadingRFID} /> */}
              {/* <LottiesAnimation
                visible={loadingTable}
                animationsData={Loading}
                classCustom="h-full z-[999] opacity-100 flex flex-col items-center justify-center"
              /> */}
              {/* {!loadingTable ? ( */}
              <TableRegistration loading={loadingTable} data={memoizedData} isLarge={isLarge} rfidTable />
              {/* ) : null} */}
            </fieldset>
          </div>
        </div>

        <div className="">
          <div className="w-full rounded-md">
            <div className="flex w-full py-2">
              <div className="grid grid-cols-2 gap-28 sm:space-x-[20%] md:space-x-[60%] xl:space-x-[70%] w-full bg-white px-4 py-6 rounded-md border border-[#C2C2C2]">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="max-sm:text-xs xl:text-lg w-1/2 flex-1">Total Product Registered</div>
                    <div className="font-bold">12</div>
                  </div>
                  <div className="flex">
                    <div className="max-sm:text-xs xl:text-lg w-1/2 flex-1">
                      {isLarge ? 'Total RFID Detected' : 'Total RFID'}
                    </div>
                    <div className="font-bold">10</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <FilePicker onFileSelect={handleFileSelect} />
                  {/* <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size="sm"
                    px={12}
                    className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-semibold"
                    onClick={() => {}}
                  >
                    Scan
                  </Button> */}
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size="sm"
                    px={12}
                    className="rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-semibold"
                    onClick={() => {}}
                  >
                    Submit
                  </Button>
                </div>
              </div>
              {/* 
              <div className="grid w-1/2">
                <div
                  className={`${isLarge ? 'grid grid-cols-3 justify-place-end pl-8' : 'flex flex-wrap my-2 '} my-auto `}
                >
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 5 : 2}
                    className="rounded-full border border-gray-300 bg-[#fff] hover:bg-[#E4E4E4] text-primarydeepo font-bold"
                    onClick={scanning ? stopScanning : startScanning}
                    isDisabled={requestDetailData.length === 0}
                  >
                    {scanning ? <StopIcon className="h-6 animate-pulse" /> : <p className="tracking-wide">Scan</p>}
                  </Button>

                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 2}
                    className={`rounded-full border border-gray-300 bg-[#fff] hover:bg-[#E4E4E4] text-[#2f3e46] font-bold ${
                      isLarge ? 'mx-4' : 'mx-2'
                    } `}
                    onClick={onReset}
                    isDisabled={scanning}
                  >
                    <p className="tracking-wide">Reset</p>
                  </Button>

                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size={isLarge ? 'sm' : 'xs'}
                    px={isLarge ? 6 : 3}
                    className={`rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold ${
                      isLarge ? '' : 'mt-2'
                    } `}
                    onClick={onSubmitRFID}
                    isDisabled={onDisabled()}
                  >
                    Next
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
          {/* {error && (
            <p className="text-[#a2002d] text-xs w-full pl-4">
              {totalRequest !== totalRFID
                ? 'The amount of data in Request Detail does not match the data in RFID Detected.'
                : ''}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Screen;
