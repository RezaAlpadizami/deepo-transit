import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Moment from 'moment';
import { Button } from '@chakra-ui/react';

import DeleteButton from '../../../components/delete-button-component';
import LoadingHover from '../../../components/loading-hover-component';
import InputDetail from '../../../components/input-detail-component';
import { WarehouseApi } from '../../../services/api-master';

function Screen(props) {
  const { displayName } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataWarehouseById, setDataWarehouseById] = useState([]);

  useEffect(() => {
    getDetailWarehouse();
  }, []);

  const getDetailWarehouse = () => {
    setLoading(true);
    WarehouseApi.find(id)
      .then(res => {
        setLoading(false);
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
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton api={WarehouseApi} redirectTo="master/warehouse" />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/warehouse/${id}/edit`);
          }}
          size="sm"
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
        >
          Edit
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
