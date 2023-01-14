import React from 'react';
import { Tr, Td } from '@chakra-ui/react';

function NoContent() {
  return (
    <Tr className="bg-gray-100 w-full">
      <Td className="w-10 text-center px-2 h-[170px]" colSpan={9} rowSpan={5} />
    </Tr>
  );
}

export default NoContent;
