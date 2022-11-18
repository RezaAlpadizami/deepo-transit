import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Moment from 'moment';
import { Button } from '@chakra-ui/react';

import LoadingHover from '../../../components/loading-hover-component';
import InputDetail from '../../../components/input-detail-component';
import { WarehouseApi } from '../../../services/api-master';

function Screen() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  //   const [errrorMessage, setErrorMessage] = useState([null]);
  //   const [showAlert, setShowAlert] = useState(false);
  const [dataWarehouseById, setDataWarehouseById] = useState([]);
  //   const [totalData, setTotalData] = useState([]);

  useEffect(() => {
    getDetailWarehouse();
  }, []);

  const getDetailWarehouse = () => {
    setLoading(true);
    WarehouseApi.find(id)
      .then(res => {
        setLoading(false);
        console.log('res', res);
        setDataWarehouseById(res);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="">
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">Detail Warehouse</h1>
        <div className="flex-1" />
        <Button
          onClick={() => {}}
          paddingX={12}
          size="sm"
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-2 hover:text-white hover:bg-black"
        >
          Delete
        </Button>
        <Button
          paddingX={12}
          type="submit"
          size="sm"
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
        >
          Save
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataWarehouseById.code} label="Code" />
        <InputDetail value={dataWarehouseById.address} label="Address" />
        <InputDetail value={dataWarehouseById.name} label="Name" />
        <InputDetail value={dataWarehouseById.phone} label="Phone Number" />
        <InputDetail value={dataWarehouseById.capacity} label="Capacity" />
        <InputDetail
          value={Moment(dataWarehouseById.last_stock_opname).format('DD MMM, YYYY')}
          label="Last Stock Opname"
        />
        <InputDetail value={dataWarehouseById.location} label="Location" />
      </div>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
