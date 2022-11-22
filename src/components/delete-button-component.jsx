import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

function DeleteButton(props) {
  const { api, id = 1, afterSuccessDeleteTo, textConfirmButton } = props;
  const navigate = useNavigate();

  const deleteData = () => {
    Swal.fire({
      text: textConfirmButton,
      padding: 20,
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonColor: '#246EE5',
      cancelButtonColor: '#FFFFFF',
      confirmButtonText: `<p class="rounded-full bg-[#232323] text-[#fff] px-5 py-2 ml-5">Delete</p>`,
      cancelButtonText: `<p class="rounded-full bg-[#aaa] border-2 border-[#1F2022] text-[#fff] px-5 py-2">Cancel</p>`,
      reverseButtons: true,
    }).then(status => {
      console.log('status', status);
      if (status.isDismissed) return;
      if (status.isConfirmed) {
        api
          .delete(id)
          .then(() => {
            Swal.fire({ text: 'Data deleted successfully', icon: 'success' });
            navigate(`/${afterSuccessDeleteTo}`);
          })
          .catch(error => {
            console.log('error', error);
            if (error.code) {
              Swal.fire({ text: 'Something goes wrong', icon: 'error' });
            }
          });
      }
    });
  };
  return (
    <Button
      onClick={deleteData}
      px={8}
      size="sm"
      className="rounded-full bg-[#aaa] border-2 border-[#1F2022] text-[#fff] mr-6"
    >
      Delete
    </Button>
  );
}

export default DeleteButton;
