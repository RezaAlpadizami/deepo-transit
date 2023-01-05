import React, { useEffect, useState, useCallback } from 'react';
import XLSX from 'xlsx';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useTable, useRowSelect, usePagination, useSortBy } from 'react-table';
import { ChevronLeftIcon, ChevronRightIcon, ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid';
import Input from './input-component';
import Select from './select-component';
import Checkbox from './checkbox-component';
import { hasProperty } from '../utils/helper';
import TableComponent from './table-component';
import DatePicker from './datepicker-component';
import Toolbar from './action-toolbar-component';

function DataTable(props) {
  const {
    columns: propsColumn = [],
    limit = 10,
    toolbar,
    noToolbar,
    filterParams,
    to,
    api,
    checkbox,
    displayName,
    name,
    filters,
    onSort = () => {},
    onActionButton = () => {},
    identifierProperties = 'id',
    hasButtonAction,
    onSearch,
    filterEnd,
  } = props;

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm();

  const [pages, setPages] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loadingHover, setLoadingHover] = useState(false);
  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };

  const [filter, setFilter] = useState([]);
  const [filterData, setFilterData] = useState({
    limit: 10,
    offset: 0,
    ...defaultSort,
  });
  useEffect(() => {
    setLastPage(Math.ceil(totalData / limit));
  }, [totalData, limit]);

  const data = React.useMemo(() => datas, [JSON.stringify(datas)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map(d => {
        return {
          Header: d.header,
          accessor: d.value,
          Cell: props => {
            const { value, row } = props;
            if (d.type === 'date') {
              return Moment(value).format('DD MMM YYYY');
            }
            if (d.type === 'link' && to) {
              return (
                <Link
                  type="button"
                  className="mr-4 text-blue-400"
                  to={`${to}/${row.original[identifierProperties]}/show`}
                >
                  {value}
                </Link>
              );
            }
            if (d.type === 'scrollable') {
              return (
                <div className="max-h-[85px] max-w-[250px] overflow-y-auto no-scrollbar::-webkit-scrollbar no-scrollbar whitespace-pre-line p-2">
                  <span>{value?.length > 25 ? `${value.substring(0, 30)} . . .` : value}</span>
                </div>
              );
            }
            if (d.type === 'action-button' && row.original.request_number) {
              return (
                <Button
                  className="text-white bg-gradient-to-r from-processbtnfrom to-processbtnto hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  onClick={() => {
                    onActionButton(row.original.id, row.original);
                  }}
                  type="button"
                  px={8}
                  size="sm"
                >
                  Process
                </Button>
              );
            }

            return value;
          },
        };
      }),
    [JSON.stringify(propsColumn), to]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    getToggleHideAllColumnsProps,
    allColumns,
  } = useTable({ columns, data }, useSortBy, usePagination, useRowSelect, hooks => {
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
  });

  useEffect(() => {
    getData();
  }, [filterData, filterParams]);

  const getData = () => {
    setLoadingHover(true);
    api
      .get({ ...filterData, ...filterParams })
      .then(res => {
        setLoadingHover(false);
        setDatas(res.data);
        setTotalData(res.query.total);
      })
      .catch(error => {
        setLoadingHover(false);
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  useEffect(() => {
    if (Array.isArray(filters)) {
      setFilter([...filters]);
    }
  }, [filters]);

  const changePage = page => {
    setPages(page);
    setFilterData({ ...filterData, offset: (page - 1) * limit });
  };

  const isActionToolbarExclude = action => {
    let force = false;
    let exclude = false;
    if (toolbar) {
      if (hasProperty(toolbar, 'action')) {
        force = true;
        if (
          !hasProperty(toolbar.action, action) ||
          (hasProperty(toolbar.action, action) && toolbar.action[action] === false)
        ) {
          exclude = true;
        } else {
          exclude = false;
        }
      }
    }
    return [force, exclude];
  };
  const checkPermissionAction = action => {
    let act;
    switch (action) {
      case 'view':
        act = 'view';
        break;
      case 'delete':
        act = 'delete';
        break;
      case 'save-to-excel':
        act = 'SaveDataToExcel';
        break;
      case 'copy-to-clipboard':
        act = 'CopyToClipboard';
        break;
      case 'show-hide-column':
        act = 'ShowHideColumn';
        break;
      default:
        break;
    }
    return act;
  };

  const enableAction = action => {
    const actions = {
      add: 'add',
      view: 'view',
      edit: 'edit',
      delete: 'delete',
      'save-to-excel': 'download',
      'show-hide-column': 'showHideColumn',
      'copy-to-clipboard': 'copyClipboard',
    };
    if (Object.keys(actions).includes(action)) {
      const [force, status] = isActionToolbarExclude(action);
      if (!force) {
        return checkPermissionAction(action);
      }
      return !status;
    }
    return false;
  };
  const renderToolbar = () => {
    if (!noToolbar && toolbar) {
      return (
        enableAction('view') ||
        enableAction('save-to-excel') ||
        enableAction('copy-to-clipboard') ||
        enableAction('edit') ||
        enableAction('delete') ||
        enableAction('add') ||
        enableAction('show-hide-column')
      );
    }
    return false;
  };

  const deleteData = () => {
    Promise.allSettled([
      selectedFlatRows.map(d => {
        return new Promise((resolve, reject) => {
          api
            .delete(d.original[identifierProperties])
            .then(r => resolve(r))
            .catch(e => reject(e));
        });
      }),
    ]).then(result => {
      const success = [];
      const failed = [];
      if (result.value) {
        result.forEach(r => {
          if (r.status === 'fulfilled') {
            setTimeout(() => {
              setLoadingHover(false);
              success.push(true);
            }, 500);
          } else {
            result.reason.data.error.api.map(m => failed.push(m));
            failed.push(true);
          }
        });
      } else if (result.value === 'undefined') {
        Swal.fire({ text: `Something When Wrong`, icon: 'error' });
      }
      if (success.length > 0) {
        Swal.fire({ text: 'Data Deleted Successfully', icon: 'success' });
      } else if (failed.length > 0) {
        Swal.fire({ text: 'Something Went Wrong', icon: 'error' });
      }
      setFilterData(prev => ({
        ...prev,
        offset: 0,
      }));
    });
  };

  const download = () => {
    setLoadingHover(true);
    const wb = XLSX.utils.table_to_book(document.getElementById('mytable'), {
      sheet: `${displayName}`,
    });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    function s2ab(data) {
      const buf = new ArrayBuffer(data.length);
      const view = new Uint8Array(buf);
      // eslint-disable-next-line no-bitwise, no-plusplus
      for (let i = 0; i < data.length; i++) view[i] = data.charCodeAt(i) & 0xff;
      return buf;
    }
    setTimeout(() => {
      setLoadingHover(false);
    }, 500);
    return saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${displayName}.xlsx`);
  };
  const onReset = () => {
    reset();
    setFilterData({
      limit: 10,
      offset: 0,
      ...defaultSort,
    });
  };

  const getDebounce = func => {
    let timer;
    return (...args) => {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const onSubmit = data => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }
        if (data[dt] === 'All') {
          setFilterData({
            limit: 10,
            offset: 0,
            ...defaultSort,
          });
          delete data[dt];
        }
        if (data[dt] instanceof Date) {
          if (dt.toLowerCase().includes('to')) {
            data[dt] = Moment(data[dt]).endOf('day').format('YYYY-MM-DD');
          } else {
            data[dt] = Moment(data[dt]).startOf('day').format('YYYY-MM-DD');
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    }
    setFilterData(prev => {
      return {
        ...prev,
        limit: 10,
        offset: 0,
        ...data,
      };
    });
  };
  const opt = useCallback(getDebounce(onSubmit), []);

  const onSubmitRequestProcess = row => {
    setLoadingHover(true);
    api
      .createRequestProcess(row.original.id)
      .then(() => {
        setLoadingHover(false);
        getData();
        Swal.fire({
          text: `Request ${row.original.request_number} berhasil di process`,
          icon: 'success',
          buttonsStyling: false,
          confirmButtonColor: 'primarydeepo',
          confirmButtonText: `<p class="rounded bg-secondarydeepo text-[#fff] px-5 py-2 ml-5 font-bold">OK</p>`,
        });
      })
      .catch(error => {
        setLoadingHover(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };
  return (
    <>
      {download && (
        <div style={{ display: 'none' }}>
          <TableComponent
            id="mytable"
            data={data}
            columns={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
            keys={data.filter(i => i[columns.map(i => i.accessor)])}
            header={propsColumn.filter(i => i.value)}
          />
        </div>
      )}
      {filter && filter.length !== 0 && (
        <div className="">
          <div className="flex">
            <h1 className="font-bold text-xl">{displayName}</h1>
          </div>
          <div>
            <form className={`${onSearch ? 'mb-10' : ''}`} onChange={onSearch ? handleSubmit(opt) : ''}>
              <div className="px-4">
                <div className={` ${filterEnd ? 'flex justify-between' : 'grid grid-cols-6'} gap-4  mt-4`}>
                  {filter.map((item, idx) => {
                    if (item.type === 'addtext') {
                      return (
                        <div className={`${item.col ? `col-span-${item.col}` : ''}`} key={`component${idx}`}>
                          <p className="text-md font-bold">{item.text}</p>
                          <Button
                            _hover={{
                              shadow: 'md',
                              transform: 'translateY(-5px)',
                              transitionDuration: '0.2s',
                              transitionTimingFunction: 'ease-in-out',
                            }}
                            type="button"
                            size="sm"
                            px={8}
                            className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold mt-2"
                            onClick={() => onReset()}
                          >
                            Reset
                          </Button>
                        </div>
                      );
                    }
                    if (item.type === 'date_picker') {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <DatePicker
                            name={item.name}
                            label={item.label}
                            placeholder={item.placeholder}
                            register={register}
                            control={control}
                            errors={errors}
                          />
                        </div>
                      );
                    }
                    if (item.type === 'input:addOn') {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <Input
                            name={item.name}
                            placeholder={item.placeholder}
                            addOnleft
                            register={register}
                            control={control}
                            icon={<img src={item.icon} alt={`${item.alt}`} className="h-6" />}
                          />
                        </div>
                      );
                    }
                    if (item.type === 'select') {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <Select
                            name={item.name}
                            label={item.label}
                            placeholder={item.label}
                            options={item.data}
                            register={register}
                            control={control}
                            errors={errors}
                            disabled={item.disabled}
                          />
                        </div>
                      );
                      // eslint-disable-next-line no-else-return
                    } else {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <Input name={item.name} label={item.label} register={register} control={control} />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              {!onSearch && (
                <div className="col-md-3 offset-md-9 px-0">
                  <div className="flex justify-end mt-3 px-4 py-3">
                    <Button
                      _hover={{
                        shadow: 'md',
                        transform: 'translateY(-5px)',
                        transitionDuration: '0.2s',
                        transitionTimingFunction: 'ease-in-out',
                      }}
                      type="button"
                      size="sm"
                      px={8}
                      className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#8335c3] font-bold"
                      onClick={() => onReset()}
                    >
                      Reset
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
                      px={8}
                      className="ml-4 rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Filter
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {renderToolbar() && (
        <Toolbar
          selectedData={selectedFlatRows}
          defaultShow={propsColumn}
          getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
          columns={allColumns}
          navTo={{ path: to, id: selectedFlatRows?.find(i => i)?.original.id }}
          displayName={displayName}
          name={name}
          onAdd={enableAction('add')}
          onEdit={enableAction('edit')}
          copyItem={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
          copyClipboard={enableAction('copy-to-clipboard')}
          view={enableAction('view')}
          onDelete={enableAction('delete') && deleteData}
          onDownload={enableAction('save-to-excel') && download}
          onShowHideColumn={enableAction('show-hide-column')}
        />
      )}

      <div className="overflow-x-auto relative px-6 pb-11 bg-white rounded-b-3xl drop-shadow-md">
        <table {...getTableProps()} className="table-auto w-full text-sm text-left text-gray-500 border-t">
          <thead className="text-xs text-black uppercase bg-thead">
            {headerGroups.map((headerGroup, idxgroup) => (
              <tr key={idxgroup} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, columnidx) => (
                  <th key={columnidx} {...column.getHeaderProps(column.getSortByToggleProps())} className="py-3 px-6">
                    <div
                      className="flex"
                      onClick={() =>
                        onSort({
                          sort_by: column.id,
                          sort_order: column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : 'desc',
                        })
                      }
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowSmDownIcon className="ml-2 h-4" />
                          ) : (
                            <ArrowSmUpIcon className="ml-2 h-4" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
                {hasButtonAction && <th> </th>}
              </tr>
            ))}
          </thead>

          {!loadingHover && (
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    key={i}
                    {...row.getRowProps()}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}border-b hover:bg-slate-100`}
                  >
                    {row.cells.map((cell, idx) => (
                      <td key={idx} {...cell.getCellProps()} className="py-2 px-6">
                        {cell.render('Cell')}
                      </td>
                    ))}
                    {hasButtonAction && (
                      <td className="text-black py-1 px-6">
                        <Button
                          onClick={e => onSubmitRequestProcess(row, row.id, e)}
                          type="submit"
                          px={8}
                          size="sm"
                          className="text-white bg-gradient-to-r from-processbtnfrom to-processbtnto hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-secondarydeepo font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Process
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {loadingHover && (
          <div className="w-full">
            <div className="bg-[#fff]">
              <div className="flex p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
              <div className="flex mt-1 p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
              <div className="flex mt-1 p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
              <div className="flex mt-1 p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
              <div className="flex mt-1 p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
              <div className="flex mt-1 p-3">
                <div className="h-5 rounded-lg bg-gray-100 w-[5%]" />
                <div className="h-5 ml-3 rounded-lg bg-gray-100 w-[95%] " />
              </div>
            </div>
          </div>
        )}

        <nav className="flex justify-between items-center bg-white pl-4" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 ">
            {totalData <= 0 ? null : (
              <>
                Showing <span className="font-semibold text-gray-900 ">{`${limit * (pages - 1) + 1} - `}</span>
                <span className="font-semibold text-gray-900">
                  {pages * limit > totalData ? totalData : pages * limit}
                </span>{' '}
                of <span className="font-semibold text-gray-900 ">{totalData}</span>
              </>
            )}
          </span>
          <ul className="inline-flex items-center text-sm -space-x-px py-4 mr-8">
            <li>
              <button
                type="button"
                disabled={pages === 1}
                onClick={() => (pages === 1 ? {} : changePage(pages - 1))}
                className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </li>
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
                  <li key={i}>
                    <button
                      type="button"
                      disabled={pages === i + p}
                      onClick={() => changePage(i + p)}
                      className={`${
                        pages === i + p ? 'bg-secondarydeepo text-white' : 'bg-thead'
                      } py-2 px-3 mx-0.5 leading-tight text-black bg-secondarydeepo rounded-lg hover:bg-thead hover:text-white disabled:text-white`}
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
            <li>
              <button
                type="button"
                disabled={pages === lastPage}
                onClick={() => (pages === lastPage ? {} : changePage(pages + 1))}
                className="block py-2 px-3 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">Next</span>
                {totalData <= 0 ? null : <ChevronRightIcon className="w-5 h-5" />}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default observer(DataTable);
