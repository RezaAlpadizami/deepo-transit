import React, { useEffect, useState, useContext } from 'react';

import Swal from 'sweetalert2';
import { Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import Context from '../../../context';
import { CategoryApi } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingHover from '../../../components/loading-hover-component';
import DeleteButton from '../../../components/delete-button-component';

function Screen(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { displayName } = props;
  const { store } = useContext(Context);

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
        <DeleteButton api={CategoryApi} id={id} redirectTo="master/category" />
        <Button
          onClick={() => {
            navigate(`/master/category/${id}/edit`);
            store.setIsLoadEdit(true);
          }}
          px={8}
          type="submit"
          className="ml-4 rounded-full bg-[#232323] text-[#fff]"
        >
          Edit
        </Button>
      </div>

      <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
        <InputDetail value={dataCategoryById.code} label="Code" />
        <InputDetail value={dataCategoryById.name} label="Category" />
      </div>
      {loading && <LoadingHover visible={loading} />}
    </div>
  );
}
export default Screen;
