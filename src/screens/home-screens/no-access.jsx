import React from 'react';

function NoAccessScreen() {
  return (
    <div className="d-flex flex-column w-100 justify-content-center align-items-center" style={{ height: '50vh' }}>
      <h1 className="mb-3" style={{ fontSize: '50px', color: '#d2d2d2' }}>
        FORBIDDEN ACCESS
      </h1>
      <p style={{ color: '#676464' }}>You have no permission to access this page.</p>
      <p style={{ color: '#676464' }}>Please contact administrator to grant you permission to access this page.</p>
    </div>
  );
}

export default NoAccessScreen;
