import React from 'react';
import DatePicker from 'react-datepicker';
import { Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { CalendarIcon } from '@heroicons/react/outline';

import 'react-datepicker/dist/react-datepicker.css';

function InputElement(props) {
  const { errors, name } = props;
  return (
    <InputGroup size="sm">
      <Input
        {...props}
        bg="white"
        size="sm"
        width="auto"
        type="text"
        isInvalid={errors[name]}
        className="w-full text-sm rounded-l-md border-gray-300 px-3 py-1"
      />
      <InputRightElement className="rounded-r-md">
        <CalendarIcon className="w-4 h-4" />
      </InputRightElement>
    </InputGroup>
  );
}

function SelectComponent(props) {
  const { name, label, disabled, register, control, errors, placeholder } = props;
  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-gray-600 block ml-1">
          {label}
        </label>
        <div className="mt-1 flex  shadow-sm">
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
                  onChange={onChange}
                  id={name}
                  customInput={<InputElement errors={errors} />}
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
