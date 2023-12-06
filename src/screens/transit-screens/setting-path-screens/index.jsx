import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Context from '../../../context';
import Input from '../../../components/input-component';

function Screen() {
  const { store } = useContext(Context);

  const handleSettingPathChange = data => {
    const settingPathValue = data.target.value;
    store.setSettingPath(settingPathValue);

    console.log(settingPathValue);
  };
  const {
    // handleSubmit,
    // reset,
    register,
    control,
    // formState: { errors },
  } = useForm();
  return (
    <div>
      <Input
        name="setting"
        label="Setting Path"
        control={control}
        register={register}
        onChange={handleSettingPathChange}
      />
    </div>
  );
}

export default Screen;
