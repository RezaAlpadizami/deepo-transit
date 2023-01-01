import React from 'react';
import DatePicker from 'react-datepicker';
import { Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { CalendarIcon } from '@heroicons/react/outline';

import 'react-datepicker/dist/react-datepicker.css';

function InputElement(props) {
  const { errors, name, disabled } = props;
  return (
    <InputGroup size="sm">
      <Input
        {...props}
        bg="white"
        size="sm"
        width="auto"
        type="text"
        isInvalid={errors[name]}
        variant={disabled ? 'filled' : 'outline'}
        className={` ${disabled ? 'bg-gray-200' : ''} w-full text-sm border-gray-400 py-5 rounded-full px-8`}
        focusBorderColor="primarydeepo"
      />
      <InputRightElement className="rounded-r-full w-14 bg-primarydeepo h-full">
        <CalendarIcon color="white" className="w-5 h-5 mt-0.5" />
      </InputRightElement>
    </InputGroup>
  );
}

function SelectComponent(props) {
  const { name, label, disabled, register, control, errors, placeholder } = props;
  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-black block ml-1">
          {label}
        </label>
        <div className="mt-1 flex">
          <Controller
            name={name}
            render={({ field: { onChange, value, name } }) => {
              return (
                <DatePicker
                  name={name}
                  disabled={disabled}
                  placeholderText={placeholder}
                  selected={value}
                  value={value}
                  autoComplete="off"
                  onChange={onChange}
                  id={name}
                  customInput={<InputElement disabled errors={errors} />}
                  className="py-6"
                />
              );
            }}
            refs={register}
            control={control}
          />
        </div>
      </div>
      {errors[name] && (
        <span className="text-red-700 text-xs ml-1">{errors[name]?.message.replace(name, label.toLowerCase())}</span>
      )}
    </div>
  );
}

export default SelectComponent;
