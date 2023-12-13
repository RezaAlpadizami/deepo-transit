import React from 'react';
import { useMediaQuery } from '@chakra-ui/react';
import { alertCircle, checkSquare } from '../../../assets/images';
import TableRegistration from '../../../components/table-registration-component';

function Screen() {
  const [isLarge] = useMediaQuery('(min-width: 1150px)');

  const dataDummy = [
    {
      id: 1,
      rfid_number: '10bng35hj5',
      product_name: 'Buku Apple Way',
      status: true,
    },
    {
      id: 2,
      rfid_number: '6dghs5jkdj',
      product_name: 'Buku Apple Way',
      status: false,
    },
    {
      id: 3,
      rfid_number: '83gdhs45jf',
      product_name: 'Buku Apple Way',
      status: true,
    },
  ];
  return (
    <div>
      <h4 className="px-5 font-bold text-xl mb-4">RFID Gate Status</h4>
      <div className="grid grid-rows-2 px-5 py-1">
        <div className={`${isLarge ? 'flex gap-6' : ''} row-span-2 justify-center`}>
          <div className="w-full mb-6">
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text-md xl:text-md text-[#1F2937] font-semibold">Product Detected</legend>
              <div className="flex flex-col">
                <div className="flex justify-center align-middle">
                  <p className="text-[180px] font-bold">5</p>
                </div>
              </div>
              <div className="grid grid-cols-2 h-[200px] -mx-8 -my-6">
                <fieldset className="border-t-2 border-r-2">
                  <legend className="px-5 sm:text-xs xl:text-xs flex text-[#1F2937] font-semibold">
                    Pass
                    <span className="ml-1 flex flex-col justify-center">
                      <img src={checkSquare} alt="icon-request" width={10} />
                    </span>
                  </legend>
                  <div className="flex justify-center align-middle">
                    <p className="text-[100px] text-green-500">2</p>
                  </div>
                </fieldset>
                <fieldset className="border-t-2">
                  <legend className="px-5 sm:text-xs xl:text-xs text-[#1F2937] flex font-semibold">
                    Fail
                    <span className="ml-1 flex flex-col justify-center">
                      <img src={alertCircle} alt="icon-request" width={10} />
                    </span>
                  </legend>
                  <div className="flex justify-center align-middle">
                    <p className="text-[100px] text-red-500">1</p>
                  </div>
                </fieldset>
              </div>
            </fieldset>
          </div>
          <div className="w-full mb-6">
            <fieldset
              className={`${
                isLarge ? 'min-h-[453px] pt-4 pb-6' : 'h-1/2 py-2'
              } bg-white w-full rounded-md border border-[#C2C2C2] px-8`}
            >
              <legend className="px-2 sm:text-md xl:text-md text-[#1F2937] font-semibold">Product Details</legend>
              <TableRegistration data={dataDummy} isLarge={isLarge} panel />
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Screen;
