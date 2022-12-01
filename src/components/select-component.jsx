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
            className="w-full text-sm rounded-md border-gray-300 px-3 py-1"
            isDisabled={disabled}
            placeholder={placeholder}
          >
            {options.map((el, idx) => (
              <option key={idx} value={el.value}>
                {el.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : (
          <span className="text-red-700 ml-1">
            {errors[name]?.message.replace(name, label?.toLowerCase() || name.toLowerCase())}
          </span>
        ))}
    </div>
  );
}

export default SelectComponent;
