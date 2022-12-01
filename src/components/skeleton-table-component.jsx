import React from 'react';

function LoadSkeleton() {
  return (
    <div className="absolute z-[999] w-full bg-white">
      <div className=" border shadow ml-3 rounded-lg mx-auto h-full pb-0.5 animate-pulse">
        <div className="flex w-full shadow-sm">
          <div className="h-9 rounded-lg bg-gray-300 w-[8.5%]" />
          <div className="h-9 ml-3 rounded-lg bg-gray-300  w-[6%] " />
          <div className="h-9 ml-3 rounded-lg bg-gray-300  w-[5.5%]" />
          <div className="h-9 ml-3 rounded-lg bg-gray-300 w-[11%] " />
          <div className="h-9 ml-3 rounded-lg bg-gray-300  w-[12%] " />
        </div>
        <div className=" w-full shadow-sm pt-8">
          <div className="flex">
            <div className="h-5 rounded-lg bg-gray-300 w-[2%]" />
            <div className="h-5 ml-3 rounded-lg bg-gray-300  w-[78%] " />
          </div>
          <div className="flex pt-5">
            <div className="h-5 rounded-lg bg-gray-300 w-[2%]" />
            <div className="h-5 ml-3 rounded-lg bg-gray-300  w-[78%] " />
          </div>
        </div>
        <div className=" w-full shadow-sm">
          <div className="flex pt-5">
            <div className="h-5 rounded-lg bg-gray-300 w-[10%]" />
            <div className="w-[50%]" />
            <div className="h-5 ml-3 rounded-lg bg-gray-300  w-[20%] " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadSkeleton;
