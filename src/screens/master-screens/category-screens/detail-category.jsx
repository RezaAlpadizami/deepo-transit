import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

import DeleteButton from '../../../components/delete-button-component';
import LoadingHover from '../../../components/loading-hover-component';
import InputDetail from '../../../components/input-detail-component';
import { CategoryApi } from '../../../services/api-master';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;

  const [loading, setLoading] = useState(false);
  const [dataCategoryById, setDataCategoryById] = useState([]);

  useEffect(() => {
    getDetailCategory();
  }, []);

  const getDetailCategory = () => {
    setLoading(true);
    CategoryApi.find(id)
      .then(res => {
        setLoading(false);
        setDataCategoryById(res);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <div className="flex mb-12">
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
        <DeleteButton
          api={CategoryApi}
          afterSuccessDeleteTo="master/category"
          textConfirmButton="Are you sure want to remove this ?"
        />
        <Button
          paddingX={12}
          type="submit"
          size="sm"
          onClick={() => {
            navigate(`/master/category/${id}/edit`);
          }}
          className="bg-white border border-gray-500 text-gray-500 rounded-full border-3 py-4 px-6 mr-60 hover:text-white hover:bg-black"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataCategoryById.code} label="Code" />
        <InputDetail value={dataCategoryById.name} label="Category" />
      </div>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
