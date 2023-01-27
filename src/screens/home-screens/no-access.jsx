import React from 'react';
import { useNavigate } from 'react-router-dom';

function Screen() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full grid place-content-center justify-center mx-auto text-center">
      <div className="pb-4">
        <div className="flex">
          <h3 className="text-xl font-bold"> 404 |</h3>
          <p className="ml-2">Page Not Found</p>
        </div>
        <p className="text-sm text-gray-500">Sorry, page you looking for is not available</p>
      </div>

      <div className="flex mt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-secondarydeepo px-4 rounded-xl text-white py-1 font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Screen;
