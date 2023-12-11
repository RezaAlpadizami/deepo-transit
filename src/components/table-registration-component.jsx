// TableRegistration.js
import React from 'react';
import LottiesAnimation from './lotties-animation-component';
import Loading from '../assets/lotties/Loading.json';

function TableRegistration(props) {
  const { data, isLarge, rfidTable, loading, productRegistered } = props;

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

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
            <th className={`${th} w-[45%]`}>{rfidTable ? 'RFID Number' : 'SKU'}</th>
            <th className={`${th} w-[45%]`}>Product</th>
            <th className={`${th} w-[5%]`}>{rfidTable ? 'In Stock' : 'Qty'}</th>
          </tr>
        </thead>

        <tbody className="h-16">
          {data.length > 0 && data[0]?.rfid_number !== '' ? (
            data?.map((d, i) => {
              return (
                <tr
                  key={i}
                  className={`${i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'} ${
                    d.product_name === undefined ? '[&>*]:text-red-600' : null
                  } [&>*]:text-xs`}
                >
                  <td className={`${td} w-[5%]`}>{i + 1}</td>
                  <td className={`${td} w-[15%]`}>{rfidTable ? d.rfid_number : d.sku}</td>
                  <td className={`${td} w-[60%]`}>
                    {d.product_name === undefined ? '--Not Registered--' : d.product_name}
                  </td>
                  <td className={`${td} w-[20%]`}>
                    {!rfidTable ? d.qty : d.in_stock === undefined ? String(false) : String(d.in_stock)}
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
