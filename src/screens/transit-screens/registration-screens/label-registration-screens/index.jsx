import React, { useState, useEffect, useMemo } from 'react';
import { useMediaQuery, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../../../../components/select-component';
import InputComponent from '../../../../components/input-component';
import DatePicker from '../../../../components/datepicker-component';
import { ProductApi } from '../../../../services/api-master';
import TableRegistration from '../../../../components/table-registration-component';
import FilePicker from '../../../../components/file-local-picker-component';
import LabelRegistrationApi from '../../../../services/api-label-registration';
import LoadingHover from '../../../../components/loading-hover-component';

const schemaSubmitRegistration = yup.object().shape({
  product_id: yup.string().nullable().required(),
  registration_date: yup.date().nullable(),
  notes: yup.string().nullable().max(255),
});

function Screen() {
  const [dataProduct, setDataProduct] = useState([]);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  const [isScanning, setIsScanning] = useState(() => {
    return localStorage.getItem('isScanning') === 'true' || false;
  });

  const [dataLabelRegistered, setDataLabelRegistered] = useState([]);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonArray, setJsonArray] = useState([]);

  const dynamicPath = localStorage.getItem('dynamicPath');

  const {
    handleSubmit,
    // reset,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaSubmitRegistration),
  });

  const toggleScan = () => {
    const newIsScanning = !isScanning;
    setIsScanning(newIsScanning);
    localStorage.setItem('isScanning', newIsScanning.toString());
  };

  const onFileChange = newFileContent => {
    setLoadingFile(true);

    const lines = newFileContent.split('\n');
    const newJsonArray = lines.filter(line => line.trim() !== '').map(line => ({ rfid_number: line.trim() }));
    setJsonArray(newJsonArray);
    setLoadingFile(false);
  };

  useEffect(() => {
    ProductApi.get()
      .then(res => {
        setDataProduct(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  }, []);

  const memoizedData = useMemo(() => {
    return jsonArray.map(i => {
      return {
        key: i.product_id,
        rfid_number: i.rfid_number,
        product_id: i.product_id,
        product_name: i.product_name,
        product_sku: i.sku,
        in_stock: i.in_stock,
      };
    });
  }, [jsonArray]);

  const getDataLabelRegistered = () => {
    LabelRegistrationApi.get()
      .then(res => {
        setDataLabelRegistered(res.data);
      })
      .catch(error => {
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  const onSubmitRegistration = data => {
    const { notes, product_id } = data;
    setLoading(true);

    const arrayJson = jsonArray.map(item => ({
      rfid_number: item.rfid_number,
      product_id: Number(product_id),
      notes,
    }));

    LabelRegistrationApi.labelRegister(arrayJson)
      .then(() => {
        setLoading(false);
        Swal.fire({
          text: 'Register label berhasil',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: '#50B8C1',
          confirmButtonText: `<p class="rounded bg-[#50B8C1] text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
        getDataLabelRegistered();
        setJsonArray([]);
        setValue('notes', '');
        setValue('product_id', '');
      })
      .catch(error => {
        setLoading(false);
        if (error.message === 'Validation Failed') {
          Swal.fire({ text: 'Notes or rfid number still empty', icon: 'error' });
        } else {
          Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
        }
      });
  };

  const getTotalProductRegistered = dataLabelRegistered.reduce((acc, item) => acc + item.qty, 0);

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
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text- xl:text-xl text-[#1F2937] font-semibold">Product Registered</legend>
              <TableRegistration data={dataLabelRegistered} isLarge={isLarge} productRegistered />
            </fieldset>
          </div>
          <div className="w-full mb-6">
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text-xl xl:text-xl text-[#1F2937] font-semibold">RFID Detected</legend>
              {loadingFile ? (
                <div>Loading...</div>
              ) : (
                <TableRegistration data={memoizedData} isLarge={isLarge} rfidTable />
              )}
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
                    <div className="font-bold">{getTotalProductRegistered}</div>
                  </div>
                  <div className="flex">
                    <div className="max-sm:text-xs xl:text-lg w-1/2 flex-1">
                      {isLarge ? 'Total RFID Detected' : 'Total RFID'}
                    </div>
                    <div className="font-bold">{jsonArray.length}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <FilePicker
                    onFileChange={onFileChange}
                    isScanning={isScanning}
                    toggleScan={toggleScan}
                    dynamicPath={dynamicPath}
                  />
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
                    onClick={handleSubmit(onSubmitRegistration)}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}

export default Screen;
