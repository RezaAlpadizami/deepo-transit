import React from 'react';
import { Badge } from '@chakra-ui/react';

function SelectComponent(props) {
  const { name, label, register, errors, idx, booleans } = props;

  return (
    <div className="flex-auto w-full">
      <div>
        <div className="mt-1 flex  shadow-sm">
          <Badge
            className="rounded-[10px] px-2"
            {...register(name)}
            size="sm"
            name={name}
            id={name}
            colorScheme="green"
          >
            {label}
          </Badge>
        </div>
      </div>
      {errors &&
        (Array.isArray(errors[name]?.message) ? (
          errors[name]?.message.map(m => <span className="error d-block">{m.toLowerCase()}</span>)
        ) : errors?.details?.length && !booleans ? (
          <span className="text-red-700 ml-1">
            {
              errors?.details?.map(i => {
                return i[[name.split('.')[2]]]?.message.split('.')[1];
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
