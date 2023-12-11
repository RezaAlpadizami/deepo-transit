import React, { useContext, useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Context from '../../../context';
import Input from '../../../components/input-component';

const schemaDynamicPath = yup.object().shape({
  setting: yup.string().nullable(),
});

function Screen() {
  const { register, control, setValue } = useForm({
    resolver: yupResolver(schemaDynamicPath),
  });
  const { registrationStore } = useContext(Context);

  const handleSettingPathChange = e => {
    const newPath = e.target.value;
    registrationStore.setDynamicPath(newPath);
    localStorage.setItem('dynamicPath', newPath);
  };
  const defaultPath = registrationStore?.getDynamicPath();
  const pathUpdated = localStorage.getItem('dynamicPath');

  useEffect(() => {
    if (!pathUpdated) {
      setValue('setting', defaultPath);
    }
    setValue('setting', pathUpdated);
  }, []);

  return (
    <form onChange={handleSettingPathChange}>
      <Input name="setting" label="Setting Path" control={control} register={register} />
    </form>
  );
}

export default Screen;
