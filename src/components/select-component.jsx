import React from 'react';
import { Select } from '@chakra-ui/react';

function SelectComponent(props) {
  const { name, label, disabled, register, errors, placeholder, options } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <label htmlFor={name} className="text-sm font-light text-gray-600 block ml-1">
          {label}
        </label>
        <div className="mt-1 flex  shadow-sm">
          <Select
            {...register(name)}
            bg="white"
            size="sm"
            name={name}
            id={name}
            isInvalid={errors[name]}
            className="w-full text-sm rounded-full border-gray-400 px-5 py-2.5 h-full"
            isDisabled={disabled}
            placeholder={placeholder}
          >
            {options.map(el => (
              <option value={el.value}>{el.label}</option>
            ))}
          </Select>
        </div>
      </div>
      {errors[name] && (
        <span className="text-red-700 text-xs ml-1">{errors[name]?.message.replace(name, label.toLowerCase())}</span>
      )}
    </div>
  );
}

export default SelectComponent;
