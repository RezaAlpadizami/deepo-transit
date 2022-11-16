import React from 'react';

function SelectDrawer(props) {
  const { children, isOpen, onClose } = props;
  return (
    <div>
      <div
        // absolute fixed
        className={`fixed h-full w-1/4 z-[200] right-0 top-[60px] p-[30px] bg-white ${
          isOpen ? 'translate-x-0 overflow-y-scroll' : 'translate-x-full  '
        } transition-all ease-in-out delay-150 duration-300`}
      >
        <div className="relative mb-5">{children}</div>
      </div>
      {isOpen && <div className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-[100] top-0 right-0" onClick={onClose} />}
    </div>
  );
}

export default SelectDrawer;
