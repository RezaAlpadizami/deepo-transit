import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

import LoadingHover from '../../../components/loading-hover-component';
import InputDetail from '../../../components/input-detail-component';
import { StorageApi } from '../../../services/api-master';
import DeleteButton from '../../../components/delete-button-component';

function Screen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataStorageById, setDataStorageById] = useState([]);

  useEffect(() => {
    getDetailStorage();
  }, []);

  const getDetailStorage = () => {
    setLoading(true);
    StorageApi.find(id)
      .then(res => {
        setLoading(false);
        setDataStorageById(res);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">Detail Warehouse</h1>
        <div className="flex-1" />
        <DeleteButton
          api={StorageApi}
          id={id}
          afterSuccessDeleteTo="master/storage"
          textConfirmButton="Are you sure want to remove this ?"
        />
        <Button
          paddingX={12}
          type="submit"
          onClick={() => {
            navigate(`/master/storage/${id}/edit`);
          }}
          size="sm"
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataStorageById.code} label="Code" />
        <InputDetail value={dataStorageById.level} label="Level" />
        <InputDetail value={dataStorageById.rack_number} label="Rack" />
        <InputDetail value={dataStorageById.warehouse_id} label="Warehouse" />
        <InputDetail value={dataStorageById.bay} label="Bay" />
      </div>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
