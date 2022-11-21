import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import InputDetail from '../../../components/input-detail-component';
import DeleteButton from '../../../components/delete-button-component';
import { ProductApi } from '../../../services/api-master';

import Context from '../../../context';

function ShowScreen(props) {
  const { displayName } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { store } = useContext(Context);

  useEffect(() => {
    ProductApi.find(id)
      .then(res => {
        setData(res);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);
  return (
    <div className="">
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
        <div>
          <DeleteButton api={ProductApi} />
          <Button
            onClick={() => {
              navigate(`/master/product/${id}/edit`);
              store.setIsLoadEdit(true);
            }}
            px={8}
            type="submit"
            className="ml-4 rounded-full bg-[#232323] text-[#fff]"
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail label="SKU" value={data?.sku} />
        <InputDetail label="Name" value={data?.product_name} />
        <InputDetail label="Category" value={data?.category_id} />
        <InputDetail label="Description" value={data?.product_desc} />
      </div>
    </div>
  );
}

export default ShowScreen;
