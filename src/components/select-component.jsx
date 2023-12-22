import React from 'react';
import { Select } from '@chakra-ui/react';

function SelectComponent(props) {
  const {
    name,
    label,
    disabled,
    register,
    errors,
    placeholder,
    options,
    idx,
    booleans,
    isAllocate,
    onChangeValue = () => {},
  } = props;

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
            iconColor={`${isAllocate ? '#50B8C1' : 'gray'}`}
            className={`w-full text-sm rounded-md ${
              isAllocate ? 'border-[#50B8C1] text-[#50B8C1]' : 'border-gray-400'
            }  px-5 py-1.5 h-full`}
            disabled={disabled}
            focusBorderColor={`${isAllocate ? '#50B8C1' : '#184D47'}`}
            onChange={e => onChangeValue(e.target.value)}
            placeholder={!placeholder ? `Select ${label}` : placeholder}
          >
            {options?.map((el, idx) => (
              <option key={idx} value={el.value}>
                {el.label}
              </option>
            )) || []}
          </Select>
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : errors?.details?.length && !booleans ? (
          <span className="text-red-700 ml-1">
            {
              errors?.details?.map(i => {
                return i[[name.split('.')[2]]]?.message;
              })[idx]
            }
          </span>
        ) : (
          <span className="text-red-700 ml-1">
            {errors[name]?.message.replace(name, label?.toLowerCase() || name.toLowerCase())}
          </span>
        ))}
    </div>
  );
}

export default SelectComponent;
