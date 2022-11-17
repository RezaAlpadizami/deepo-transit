// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@chakra-ui/react';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';

// import { CityApi } from '../../../services/api-master';

// import Datatable from '../../../components/datatable-component';
// import Input from '../../../components/input-component';
// import Select from '../../../components/select-component';
// import DatePicker from '../../../components/datepicker-component';
// import Textarea from '../../../components/textarea-component';

// function Screen() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [totalData, setTotalData] = useState([]);

//   const schema = yup.object().shape({
//     name: yup.string().nullable().required(),
//     age: yup.string().nullable().required(),
//     promotionType: yup.string().nullable().required(),
//     start_date: yup.string().nullable().required(),
//   });

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = (page = 1) => {
//     setLoading(true);
//     CityApi.get({ page })
//       .then(data => {
//         setLoading(false);
//         setData(data.results);
//         setTotalData(data.count);
//       })
//       .catch(e => {
//         setLoading(false);
//         console.log(e);
//       });
//   };

//   return (
//     <div className="">
//       <div className="flex">
//         <h1 className="font-bold text-xl">Surat Keterangan Promosi</h1>
//         <div className="flex-1" />
//         <Button onClick={() => navigate('/master/city/add')} paddingX={12} size="sm" colorScheme="primary">
//           Tambah SKP
//         </Button>
//       </div>
//       <form onSubmit={handleSubmit(d => console.log(d))}>
//         <div className="grid items-start justify-items-center w-full gap-4 gap-y-1 mb-4 grid-cols-4 mt-4">
//           <Input name="name" label="Name" placeholder="Input Name" register={register} errors={errors} />
//           <Input name="age" label="Age" placeholder="Input Age" register={register} errors={errors} />
//           <Select
//             name="promotionType"
//             label="Promotion Type"
//             options={[
//               { value: 'Rafaksi', label: 'Rafaksi' },
//               { value: 'Freebies', label: 'Freebies' },
//             ]}
//             placeholder="Select Promotion"
//             register={register}
//             errors={errors}
//           />
//           <DatePicker
//             name="start_date"
//             label="Start Date"
//             placeholder="Select Date"
//             register={register}
//             control={control}
//             errors={errors}
//           />
//           <Textarea name="age" label="Age" placeholder="Input Age" register={register} errors={errors} />
//         </div>
//         <div className="flex gap-2">
//           <div className="flex-1" />
//           <Button type="button" size="sm" width="24" onClick={() => reset()} colorScheme="blackAlpha" variant="outline">
//             Reset
//           </Button>
//           <Button type="submit" size="sm" width="24" colorScheme="primary">
//             Filter
//           </Button>
//         </div>
//       </form>
//       <div>
//         <Datatable
//           column={[
//             { header: 'Name', value: 'name' },
//             { header: 'Terrain', value: 'terrain' },
//             { header: 'Diameter', value: 'diameter' },
//             { header: 'Gravity', value: 'gravity' },
//           ]}
//           data={data}
//           totalData={totalData}
//           loading={loading}
//           onChangePage={page => getData(page)}
//         />
//       </div>
//     </div>
//   );
// }
// export default Screen;
