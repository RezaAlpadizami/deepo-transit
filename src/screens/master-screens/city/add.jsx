import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

import Confirmation from '../../../components/confirmation-component';

function Screen() {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Button onClick={() => setConfirm(true)} paddingX={12} size="sm" colorScheme="blue">
        PROFILE ADD
      </Button>
      <Confirmation
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          Swal.fire({
            title: 'Success',
            text: 'Data has successfully saved',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#246ee5',
          });
        }}
        header="Submit Quotation"
        wording="Are you sure want to submit this quotation"
        confirmText="OK"
      />
    </>
  );
}
export default Screen;
