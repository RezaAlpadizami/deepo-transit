import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  useMediaQuery,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
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
import Context from '../../../../context';

const schemaSubmitRegistration = yup.object().shape({
  product_id: yup.string().nullable().required(),
  registration_date: yup.date().nullable(),
  notes: yup.string().nullable().max(255).required(),
});

function Screen() {
  const [dataProduct, setDataProduct] = useState([]);
  const [isLarge] = useMediaQuery('(min-width: 1150px)');
  const [isScanning, setIsScanning] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonArray, setJsonArray] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoadingCheckLabel, setIsLoadingCheckLabel] = useState(false);

  const { registrationStore } = useContext(Context);
  const dataLabelRegistered = [...registrationStore.getDataListRegistered()];

  const dynamicPath = localStorage.getItem('dynamicPath');

  const {
    handleSubmit,
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

  useEffect(() => {
    setValue('registration_date', new Date());
  }, [setValue]);

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

  const onSubmitRegistration = async data => {
    const { notes, product_id } = data;
    setLoading(true);

    const arrayJson = jsonArray.map(item => ({
      rfid_number: item.rfid_number,
      product_id: Number(product_id),
      notes,
    }));

    await LabelRegistrationApi.labelRegister(arrayJson)
      .then(() => {
        setLoading(false);
        Swal.fire({
          text: 'Register label berhasil',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: '#50B8C1',
          confirmButtonText: `<p class="rounded bg-[#50B8C1] text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
        setJsonArray([]);
        setValue('notes', '');
        setValue('product_id', '');
        localStorage.removeItem('registered');
        closeConfirmationModal();
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

  const onReset = () => {
    setIsScanning(false);
    setJsonArray([]);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const getTotalProductRegistered = dataLabelRegistered?.reduce((acc, item) => acc + item.qty, 0);

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
            options={[
              { value: null, label: 'None' },
              ...(dataProduct?.map((i, index) => ({
                key: index,
                value: i.id,
                label: i.product_name,
              })) || []),
            ]}
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
                <TableRegistration
                  data={memoizedData}
                  isLarge={isLarge}
                  isLoadingCheckLabel={isLoadingCheckLabel}
                  rfidTable
                />
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
                    dataRfid={memoizedData}
                    setIsLoadingCheckLabel={setIsLoadingCheckLabel}
                  />
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
                    className="rounded-md border border-[#757575] bg-[#fff] hover:bg-[#E4E4E4] text-[#757575] font-semibold"
                    onClick={onReset}
                    isDisabled={isScanning}
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
                    size="sm"
                    px={12}
                    className="rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-semibold"
                    onClick={
                      getTotalProductRegistered <= 0 ? handleSubmit(onSubmitRegistration) : openConfirmationModal
                    }
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
      <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Replace RFID Label</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {getTotalProductRegistered} of {memoizedData.length} RFID Label already registered. Are you sure want to
            replace those RFID Label?
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeConfirmationModal}>
              Close
            </Button>
            <Button
              bg="#50B8C1"
              color="#fff"
              colorScheme="#50B8C1"
              width={20}
              onClick={handleSubmit(onSubmitRegistration)}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Screen;
