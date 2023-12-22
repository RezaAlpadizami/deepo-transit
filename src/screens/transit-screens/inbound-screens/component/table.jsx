import React from 'react';
import { Button } from '@chakra-ui/react';
import LottiesAnimation from '../../../../components/lotties-animation-component';
import Loading from '../../../../assets/lotties/Loading.json';
import { deleteIcon } from '../../../../assets/images';

function SimpleTable(props) {
  const { data, isLarge, loading, register, handleRemove } = props;

  const th = `${isLarge ? 'px-8 text-sm' : 'px-4 text-xs'} text-bold text-[#000] text-center py-1.5 tracking-wide`;
  const td = 'text-[#000] text-center py-1.5 break-words';

  return (
    <div className="w-full h-full max-h-[453px] overflow-y-auto overflow-x-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5] text-bold mx-auto [&>*]:text-xs">
            {/* {!register && ( */}
            <th className={`text-bold text-[#000] text-center w-[5%] ${isLarge ? 'px-9 text-sm' : 'px-4 text-xs'}`}>
              {`${!register ? 'No' : ''}`}
            </th>
            {/* )} */}
            <th className={`${th} w-[20%]`}>SKU</th>
            <th className={`${th} w-[60%]`}>Product</th>
            <th className={`${th} w-[20%]`}>Qty</th>
          </tr>
        </thead>

        <tbody className="h-16">
          {/* <Loading visible={loadi
            ng} isLarge={isLarge} /> */}
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
                <tr key={i} className={i % 2 ? 'bg-[#f3f4f6] [&>*]:text-xs' : 'bg-[#ffff] [&>*]:text-xs'}>
                  <td className={`${td} w-[9%]`}>
                    {!register ? (
                      i + 1
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        bgColor="transparent"
                        _hover={{
                          bgColor: '#EBECF1',
                        }}
                        onClick={() => handleRemove(d.product_id)}
                      >
                        <img src={deleteIcon} alt="delete Icon" className="max-[640px]:w-8 max-[640px]:h-8" />
                      </Button>
                    )}
                  </td>
                  <td className={`${td} w-[20%] px-4 text-sm`}>{d.product_sku}</td>
                  <td className={`${td} w-[60%] text-sm`}>{d.product_name}</td>
                  <td className={`${td} w-[20%] text-sm`}>{d.qty}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center bg-[#fff] py-1.5 text-[#868689] tracking-wide">
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
