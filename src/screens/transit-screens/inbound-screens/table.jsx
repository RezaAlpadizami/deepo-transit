import React from 'react';

function SimpleTable(props) {
  const { data, isLarge } = props;

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

  return (
    <div className="w-full h-full max-h-60 overflow-y-auto overflow-x-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#bbc9ff] text-bold mx-auto">
            <th className={`text-bold text-[#000] text-center w-[5%] ${isLarge ? 'px-9 text-sm' : 'px-4 text-xs'}`}>
              NO
            </th>
            <th className={`${th} w-[15%]`}>SKU</th>
            <th className={`${th} w-[60%]`}>PRODUCT</th>
            <th className={`${th} w-[20%]`}>QTY</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data?.map((d, i) => {
              return (
                <tr key={i} className={i % 2 ? 'bg-[#f3f4f6]' : 'bg-[#ffff]'}>
                  <td className={`${td} w-[5%]`}>{i + 1}</td>
                  <td className={`${td} w-[15%]`}>{d.product_sku}</td>
                  <td className={`${td} w-[60%]`}>{d.product_name}</td>
                  <td className={`${td} w-[20%]`}>{d.qty}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center bg-[#f3f4f6] py-1.5 text-[#868689] tracking-wide">
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
