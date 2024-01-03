import React from 'react';
import LottiesAnimation from '../../../../components/lotties-animation-component';
import Loading from '../../../../assets/lotties/Loading.json';

function SimpleTable(props) {
  const { data, isLarge, loading } = props;

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

  return (
    <div className="w-full px-8 h-full max-h-60 overflow-y-auto overflow-x-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5] text-bold mx-auto">
            <th className={`text-bold text-[#000] text-center w-[5%] ${isLarge ? 'px-9 text-xs' : 'px-4 text-xs'}`}>
              NO
            </th>
            <th className={`${th} w-[15%] text-xs`}>SKU</th>
            <th className={`${th} w-[60%] text-xs`}>PRODUCT</th>
            <th className={`${th} w-[20%] text-xs`}>QTY</th>
          </tr>
        </thead>

        <tbody className="h-16">
          <LottiesAnimation
            animationsData={Loading}
            isLarge={isLarge}
            visible={loading}
            classCustom={`absolute bg-white z-[999] ${
              isLarge ? 'right-7 left-[52%]' : 'right-8 left-8'
            } opacity-100 flex flex-col items-center justify-center`}
          />
          {data.length > 0 ? (
            data?.map((d, i) => {
              return (
                <tr key={i} className={i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'}>
                  <td className={`${td} w-[5%] text-xs`}>{i + 1}</td>
                  <td className={`${td} w-[15%] text-xs`}>{d.product_sku}</td>
                  <td className={`${td} w-[60%] text-xs`}>{d.product_name}</td>
                  <td className={`${td} w-[20%] text-xs`}>{d.qty}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-1.5 text-[#868689] tracking-wide">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SimpleTable;
