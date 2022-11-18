import React, { useMemo } from 'react';

function DeletedList(props) {
  const { datas, columnsData } = props;

  const columns = useMemo(() => datas, []);
  const data = useMemo(() => columnsData, []);

  return (
    <table className="table-auto">
      <thead className=" bg-thead dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {data.map(col => {
            return <th className="uppercase text-[12px] px-5">{col.Header}</th>;
          })}
        </tr>
      </thead>
      <tbody className={`${columns.lenght > 5 ? 'overflow-y-scroll' : 'overflow-y-hidden'}`}>
        {columns.map(col => {
          return (
            <tr>
              {col.cells.map((cell, idx) => (
                <td
                  className={`text-[12px] px-5 text-center  border-b hover:bg-slate-100 dark:bg-gray-900 dark:border-gray-700 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } `}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default DeletedList;
