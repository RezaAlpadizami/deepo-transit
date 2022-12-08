import { Flex, Text } from '@chakra-ui/react';
import * as React from 'react';

function Contents(props, { index, ...rest }) {
  const { dataGetJourney } = props;
  return (
    <Flex height="100%" rounded="md" width="100%" {...rest} position="relative">
      <div className="flex flex-col text-left gap-y-4">
        <h2 className="text-gray-400">Warehouse</h2>
        <div className="flex gap-x-[19.5rem] font-bold">
          <h3>{dataGetJourney?.warehouse_name}</h3>
          <p className="font-bold">100</p>
        </div>
        <div className="flex gap-x-5">
          <div className="flex flex-col items-center gap-y-2">
            <h4>Rack</h4>
            <div className="px-5 py-2 bg-gray-200 rounded-full font-bold">
              <Text>{dataGetJourney?.rack}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h4>Bay</h4>
            <div className="px-5 py-2 bg-gray-200 rounded-full font-bold">
              <Text>{dataGetJourney?.bay}</Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h4>Level</h4>
            <div className="px-5 py-2 bg-gray-200 rounded-full font-bold">
              <Text>{dataGetJourney?.level}</Text>
            </div>
          </div>
          <div>
            <p className="font-bold ml-7 mt-11">50</p>
          </div>
        </div>
      </div>
    </Flex>
  );
}

export default Contents;
