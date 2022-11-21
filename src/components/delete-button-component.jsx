import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

function DeleteButton(props) {
  const { api, id = 1, redirectUrl } = props;
  console.log('redirect', redirectUrl);
  const navigate = useNavigate();

  const deleteData = () => {
    Swal.fire({
      title: `Delete Data`,
      //   text: deleteConfirmationWording(mData),
      padding: 20,
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonColor: '#246EE5',
      cancelButtonColor: '#FFFFFF',
      confirmButtonText: `<p class="rounded-full bg-[#232323] text-[#fff] px-5 py-2 ml-5">Delete</p>`,
      cancelButtonText: `<p class="rounded-full bg-[#aaa] outline outline-offset-2 outline-[#1F2022] text-[#fff] px-5 py-2">Cancel</p>`,
      reverseButtons: true,
    }).then(confirmation => {
      if (confirmation.isDismissed) return;
      if (confirmation.isConfirmed) {
        api
          .delete(id)
          .then(() => {
            Swal.fire({ text: 'Data deleted successfully', icon: 'success' });
            navigate(`/${redirectUrl}`);
          })
          .catch(error => {
            if (error.status >= 500) {
              Swal.fire({ text: 'Something goes wrong', icon: 'error' });
            } else if (error.data?.error?.api) {
              Swal.fire({ text: error.data?.error?.api.join('\n'), icon: 'error' });
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
      className="rounded-full bg-[#aaa] outline outline-offset-2 outline-[#1F2022] text-[#fff]"
    >
      Delete
    </Button>
  );
}

export default DeleteButton;
