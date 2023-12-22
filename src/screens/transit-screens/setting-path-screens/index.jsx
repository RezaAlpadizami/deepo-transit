import React, { useContext, useEffect, useState } from 'react';
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

  const [isInputEnabled, setIsInputEnabled] = useState(false);

  const toggleInput = () => {
    setIsInputEnabled(!isInputEnabled);
  };

  const handleSettingPathChange = e => {
    if (isInputEnabled) {
      const newPath = e.target.value;
      registrationStore.setDynamicPath(newPath);
      localStorage.setItem('dynamicPath', newPath);
    }
  };

  const defaultPath = registrationStore?.getDynamicPath();
  const pathUpdated = localStorage.getItem('dynamicPath');

  useEffect(() => {
    if (!pathUpdated) {
      setValue('setting', defaultPath);
    }
    setValue('setting', pathUpdated);
  }, [defaultPath, pathUpdated]);

  return (
    <form onChange={handleSettingPathChange}>
      <Input name="setting" label="Setting Path" control={control} register={register} disabled={!isInputEnabled} />
      <div className="my-4 mx-2 flex justify-end">
        <button className="p-2 text-white text-xs rounded-md bg-[#50B8C1]" type="button" onClick={toggleInput}>
          {isInputEnabled ? 'Disabled' : 'Change Path'}
        </button>
      </div>
    </form>
  );
}

export default Screen;
