import React from 'react';

function NoAccessScreen() {
  return (
    <div className="absolute right-0 bottom-0 left-0 top-0 bg-white grid place-content-center justify-center mx-auto text-center h-full">
      <h1 className="mb-3 font-semibold tracking-wide" style={{ fontSize: '50px', color: '#d2d2d2' }}>
        FORBIDDEN ACCESS
      </h1>
      <p className="mb-4 tracking-wide" style={{ color: '#676464' }}>
        You have no permission to access this page.
      </p>
      <p className="mb-4 tracking-wide" style={{ color: '#676464' }}>
        Please contact administrator to grant you permission to access this page.
      </p>
    </div>
  );
}

export default NoAccessScreen;
