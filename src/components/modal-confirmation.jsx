import React from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

function ModalConfirmation({ isOpen, onClose, memoizedData, productRegistered, setIsTriggerHandleSubmit }) {
  const handleConfirmation = () => {
    setIsTriggerHandleSubmit(true);

    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Replace RFID Label</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {productRegistered} of {memoizedData.length} RFID Label already registered. Are you sure want to replace those
          RFID Label?
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            bg="#50B8C1" // Set the background color
            color="#fff"
            colorScheme="#50B8C1"
            width={20}
            onClick={handleConfirmation}
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalConfirmation;
