import { Flex, Text } from '@chakra-ui/react';
import * as React from 'react';

function Contents(props, { index, ...rest }) {
  const { dataWarehouse } = props;
  return (
    <Flex height="100%" rounded="md" width="100%" {...rest} position="relative">
      <div className="flex flex-col text-left gap-y-4">
        <h2 className="text-gray-400">Warehouse</h2>
        <div className="flex gap-x-[19.5rem] font-bold">
          <h3>{dataWarehouse.name}</h3>
          <p className="font-bold">100</p>
        </div>
        {dataWarehouse?.storage?.map(({ rack_number, level, bay }) => {
          return (
            <div className="flex gap-x-5">
              <div className="flex flex-col items-center gap-y-2">
                <h4 className="text-gray-400">Rack</h4>
                <div className="px-6 py-1 bg-gray-200 rounded-full font-bold border border-black">
                  <Text>{rack_number}</Text>
                </div>
              </div>
              <div className="flex flex-col items-center gap-y-2">
                <h4 className="text-gray-400">Bay</h4>
                <div className="px-6 py-1 bg-gray-200 rounded-full font-bold border border-black">
                  <Text>{bay}</Text>
                </div>
              </div>
              <div className="flex flex-col items-center gap-y-2">
                <h4 className="text-gray-400">Level</h4>
                <div className="px-6 py-1 bg-gray-200 rounded-full font-bold border border-black">
                  <Text>{level}</Text>
                </div>
              </div>
              <p className="font-bold ml-[17rem] mt-11">50</p>
            </div>
          );
        })}
      </div>
    </Flex>
  );
}

export default Contents;
