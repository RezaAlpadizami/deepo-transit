import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { WarehouseApi } from '../../../services/api-master';
import Datatable from '../../../components/datatable-component';
import Input from '../../../components/input-component';

function Screen(props) {
  const { route, displayName } = props;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const schema = yup.object().shape({
    name: yup.string().nullable().required(),
    age: yup.string().nullable().required(),
    promotionType: yup.string().nullable().required(),
    start_date: yup.string().nullable().required(),
  });

  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = (page = 1) => {
    setLoading(true);
    WarehouseApi.get({ page })
      .then(res => {
        setData(res.data);
        setTotalData(res.query.total);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        Swal.fire({ text: e?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <div className="flex">
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex-1" />
        {/* <Button onClick={() => navigate('/master/city/add')} paddingX={12} size="sm" colorScheme="primary">
          Tambah SKP
        </Button> */}
      </div>
      <form onSubmit={handleSubmit(d => console.log(d))}>
        <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 mb-4 grid-cols-4 mt-4">
          <Input name="name" label="Name" placeholder="Input Name" register={register} errors={errors} />
          <Input name="age" label="Age" placeholder="Input Age" register={register} errors={errors} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1" />
          <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
            Reset
          </Button>
          <Button type="submit" size="sm" width="24" colorScheme="primary">
            Filter
          </Button>
        </div>
      </form>
      <div>
        <Datatable
          columns={[
            { header: 'Id', value: 'id', copy: true },
            { header: 'Wareouse Code', value: 'code', copy: true },
            { header: 'Wareouse Name', value: 'name', copy: true },
            { header: 'Wareouse Location', value: 'location', copy: true },
            { header: 'Wareouse Address', value: 'address', copy: true },
            { header: 'Warehouse Capacity', value: 'capacity', copy: true },
            { header: 'Last Stock Date', value: 'last_stock_opname', copy: true, type: 'date' },
            { header: 'Warehouse Phone', value: 'phone', copy: true },
          ]}
          toolbar={{
            action: {
              view: true,
              delete: true,
              'copy-to-clipboard': true,
              'show-hide-column': true,
              'save-to-excel': true,
            },
          }}
          api={WarehouseApi}
          to={route}
          data={data}
          name={displayName}
          totalData={totalData}
          loading={loading}
          checkbox
          onChangePage={page => getData(page)}
        />
      </div>
    </div>
  );
}
export default Screen;
