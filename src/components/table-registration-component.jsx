// TableRegistration.js
import React, { useContext, useState, useEffect } from 'react';
import Context from '../context';
import LottiesAnimation from './lotties-animation-component';
import Loading from '../assets/lotties/Loading.json';
import { alertCircle, checkSquare } from '../assets/images';

function TableRegistration(props) {
  const { data, isLarge, rfidTable, loading, productRegistered, panel } = props;
  const { registrationStore } = useContext(Context);
  const registeredData = [...registrationStore.getLabelRegistered()];
  const [collectProductRegistered, setCollectProductRegistered] = useState([]);

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

  useEffect(() => {
    const newArray = data.map(d => {
      const matchedRegisteredData = registeredData.find(regData => regData.rfid_number === d.rfid_number);

      if (matchedRegisteredData && matchedRegisteredData.product_name !== null) {
        return matchedRegisteredData;
      }

      return null;
    });

    const filteredArray = newArray.filter(item => item !== null);

    setCollectProductRegistered(filteredArray);

    registrationStore.setProductRegistered(collectProductRegistered);
  }, [data]);

  if (loading) {
    return (
      <div className="w-full h-full max-h-[453px] overflow-y-auto overflow-x-hidden">
        <LottiesAnimation
          animationsData={Loading}
          visible={loading}
          classCustom={`absolute z-[999] ${
            isLarge ? 'right-7 left-[60%] top-[42%]' : 'right-8 left-8'
          } opacity-100 flex flex-col items-center justify-center`}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full max-h-[453px] overflow-y-auto overflow-x-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5] text-bold mx-auto [&>*]:text-md">
            <th className={`text-bold text-[#000] text-center w-[5%] ${isLarge ? 'px-9' : 'px-4 text-sm'}`}>No</th>
            <th className={`${th} w-[45%]`}>{rfidTable ? 'RFID Number' : panel ? 'RFID Number' : 'SKU'}</th>
            <th className={`${th} w-[45%]`}>Product</th>
            <th className={`${th} w-[5%]`}>{rfidTable ? 'In Stock' : panel ? 'Status' : 'Qty'}</th>
          </tr>
        </thead>

        <tbody className="h-16">
          {data.length > 0 && data[0]?.rfid_number !== '' ? (
            data?.map((d, i) => {
              const matchedRegisteredData = registeredData.find(regData => regData.rfid_number === d.rfid_number);
              return (
                <tr
                  key={i}
                  className={`${i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'} ${
                    matchedRegisteredData && matchedRegisteredData.product_name !== null
                      ? null
                      : productRegistered
                      ? '[&>*]:text-black-600'
                      : panel && !d.status
                      ? '[&>*]:text-red-600'
                      : panel && d.status
                      ? '[&>*]:text-green-500'
                      : '[&>*]:text-red-600'
                  } [&>*]:text-xs`}
                >
                  <td className={`${td} w-[5%]`}>{i + 1}</td>
                  <td className={`${td} w-[15%]`}>
                    {rfidTable && matchedRegisteredData && matchedRegisteredData.rfid_number !== undefined
                      ? matchedRegisteredData.rfid_number
                      : rfidTable || panel
                      ? d.rfid_number
                      : d.sku}
                  </td>
                  <td className={`${td} w-[60%]`}>
                    {matchedRegisteredData && matchedRegisteredData.product_name !== null
                      ? matchedRegisteredData.product_name
                      : d.product_name === undefined || d.product_name === ''
                      ? '--Not Registered--'
                      : d.product_name}
                  </td>
                  <td className={`${td} ${panel ? 'w-[100%] flex justify-center' : 'w-[20%]'} `}>
                    {/* {!rfidTable ? d.qty : d.in_stock === undefined ? String(false) : String(d.in_stock)} */}
                    {rfidTable && matchedRegisteredData && matchedRegisteredData.in_stock !== undefined ? (
                      String(matchedRegisteredData?.in_stock)
                    ) : productRegistered ? (
                      d.qty
                    ) : panel && d.status ? (
                      <img src={checkSquare} alt="icon-request" width={10} />
                    ) : panel && !d.status ? (
                      <img src={alertCircle} alt="icon-request" width={10} />
                    ) : d.in_stock === undefined ? (
                      String(false)
                    ) : (
                      String(d.in_stock)
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center bg-[#fff] py-1.5 text-[#868689] tracking-wide">
                {`No ${productRegistered ? 'registered products' : 'data available'}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableRegistration;
