import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table';
import Moment from 'moment';
import { observer } from 'mobx-react-lite';
import { Link } from '@chakra-ui/react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

import { Checkbox } from './checkbox-component';

function DataTable(props) {
  const {
    data: propsData = [],
    column: propsColumn = [],
    onChangePage = () => {},
    totalData = 0,
    limit = 10,
    // offset = 0,
    loading = false,
    hasViewAction,
    checkbox,
  } = props;

  const location = useLocation();
  const [pages, setPages] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setLastPage(Math.ceil(totalData / limit));
  }, [totalData, limit]);

  // useEffect(() => {
  //   setPages(offset / limit + 1);
  // }, [offset]);

  const data = React.useMemo(() => propsData, [JSON.stringify(propsData)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map(d => {
        return {
          Header: d.header,
          accessor: d.value,
          Cell: props => {
            const { value } = props;
            if (d.type === 'date') {
              return Moment(value).format('DD MMM YYYY');
            }
            return value;
          },
        };
      }),
    [JSON.stringify(propsColumn)]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      if (checkbox) {
        hooks.visibleColumns.push(column => {
          return [
            {
              id: 'selection',
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <Checkbox {...getToggleAllRowsSelectedProps()} style={{ width: '15px', height: '15px' }} />
              ),
              Cell: ({ row }) => (
                <Checkbox {...row.getToggleRowSelectedProps()} style={{ width: '15px', height: '15px' }} />
              ),
            },
            ...column,
          ];
        });
      }
    }
  );

  const changePage = page => {
    setPages(page);
    onChangePage(page);
  };

  return (
    <div className="overflow-x-auto relative px-6 pb-11 bg-white rounded-b-3xl">
      <table {...getTableProps()} className="table-auto w-full text-sm text-left text-gray-500 border-t">
        <thead className="text-xs text-black uppercase bg-thead">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-6">
                  {column.render('Header')}
                </th>
              ))}
              {hasViewAction && (
                <th className="py-3 px-6" width={150}>
                  {' '}
                </th>
              )}
            </tr>
          ))}
        </thead>
        {!loading && (
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b hover:bg-slate-100`}
                >
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="py-2 px-6">
                      {cell.render('Cell')}
                    </td>
                  ))}

                  {hasViewAction && (
                    <td className="py-1 px-6 border-none hover: text-blue-400 no-underline">
                      <Link type="button" className="mr-4" href={`${location.pathname}/${row.original.id}`}>
                        View Detail
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {loading && (
        <div className="w-full">
          <div className="">
            <div className=" border-b border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-64 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-80" />
            </div>
            <div className=" border-b border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-52 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-60" />
            </div>
            <div className=" border-b border-gray-300 p-3 bg-white">
              <div className="animate-pulse rounded-full w-64 bg-slate-200 h-3" />
            </div>
            <div className="border-b border-gray-300 p-3 bg-gray-50">
              <div className="rounded-full bg-slate-200 h-3 w-56" />
            </div>
          </div>
        </div>
      )}

      <nav className="flex justify-end items-center bg-white pl-4" aria-label="Table navigation">
        {/* still be maintained temporarily, if there is a design change in the future */}
        {/* <span className="text-sm font-normal text-gray-500">
          {totalData <= 0 ? null : (
            <>
              Showing
              <span className="font-semibold text-gray-900">
                {limit * (page - 1) + 1}-{page * limit}
              </span>{' '}
              of <span className="font-semibold text-gray-900">{totalData}</span>
            </>
          )}
        </span> */}
        <ul className="inline-flex items-center text-sm -space-x-px py-4 mr-8">
          {/* <li>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => (page === 1 ? {} : changePage(page - 1))}
              className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </li> */}
          {lastPage > 7 && pages >= 4 && (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => changePage(1)}
                  className="py-2 px-3 leading-tight text-black rounded-lg bg-gray-100 mr-1  hover:bg-gray-700 hover:text-white"
                >
                  1
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="py-2 px-3 leading-tight text-black rounded-lg mr-0.5 bg-gray-100 hover:bg-gray-700 hover:text-white"
                >
                  ...
                </button>
              </li>
            </>
          )}
          {Array(
            lastPage > 7 && lastPage - pages < 3 ? 5 : lastPage > 7 && pages >= 4 ? 3 : lastPage > 7 ? 5 : lastPage
          )
            .fill('')
            .map((_, i) => {
              const p =
                lastPage > 7 && lastPage - pages < 3 ? lastPage - 4 : lastPage > 7 && pages >= 4 ? pages - 1 : 1;

              return (
                <li>
                  <button
                    type="button"
                    disabled={pages === i + p}
                    onClick={() => changePage(i + p)}
                    className={`${
                      pages === i + p ? 'bg-gray-700 text-white' : 'bg-white'
                    } py-2 px-3 mx-0.5 leading-tight text-black bg-gray-100 rounded-lg hover:bg-gray-700 hover:text-white disabled:text-white`}
                  >
                    {i + p}
                  </button>
                </li>
              );
            })}
          {lastPage > 7 && lastPage - pages >= 3 && (
            <>
              <li>
                <button
                  type="button"
                  className="py-2 px-3 mr-1 ml-0.5 leading-tight text-black rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white"
                >
                  ...
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => changePage(lastPage)}
                  className="py-2 px-3 leading-tight text-black rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white"
                >
                  {lastPage}
                </button>
              </li>
            </>
          )}
          {/* <li>
            <button
              type="button"
              disabled={page === lastPage}
              onClick={() => (page === lastPage ? {} : changePage(page + 1))}
              className="block py-2 px-3 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}

export default observer(DataTable);
