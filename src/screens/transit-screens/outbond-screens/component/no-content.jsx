import React from 'react';
import { Tr, Td } from '@chakra-ui/react';
import FaceFrown from '../../../../assets/images/face-frown.svg';

function NoContent() {
  return (
    <Tr className="bg-gray-100 w-full">
      <Td className="w-10 text-center px-2 h-[170px]" colSpan={9} rowSpan={5}>
        <div className="justify-center-item">
          <img className="h-20 mx-auto" src={FaceFrown} alt="face-frown" />
          <p className="text-gray-400 tracking-widest font-semibold pt-2"> No Content </p>
        </div>
      </Td>
    </Tr>
  );
}

export default NoContent;
