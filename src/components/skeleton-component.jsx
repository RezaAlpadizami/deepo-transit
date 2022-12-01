import React from 'react';

function LoadSkeleton() {
  return (
    <div className="absolute z-[999] w-full">
      <div className=" border bg-white shadow rounded-md w-full mx-auto h-full pb-0.5">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6">
            <div className="h-5 bg-gray-300 rounded w-20" />
            <div className="space-y-3">
              <div className="grid grid-cols-4 w-[80%]">
                <div className="flex-auto w-full">
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="h-4 rounded-md bg-gray-300 px-3 w-20" />
                  </div>
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="w-full h-5 rounded-md bg-gray-300 mt-2" />
                  </div>
                </div>
                <div className="flex-auto w-full">
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="h-4 rounded-md bg-gray-300 px-3 w-20" />
                  </div>
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="w-full h-5 rounded-md bg-gray-300 mt-2 ml-2" />
                  </div>
                </div>
                <div className="flex-auto w-full">
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="h-4 rounded-md bg-gray-300 px-3 w-20" />
                  </div>
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="w-full h-5 rounded-md bg-gray-300 mt-2 ml-2" />
                  </div>
                </div>
                <div className="flex-auto w-full">
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="h-4 rounded-md bg-gray-300 px-3 w-20" />
                  </div>
                  <div className="mt-1 flex  shadow-sm">
                    <div size="sm" width="auto" className="w-full h-5 rounded-md bg-gray-300 mt-2 ml-2" />
                  </div>
                </div>
              </div>
              <div className="ml-[66%] flex pt-12">
                <div className="h-9 bg-gray-300 rounded-lg w-[20%]" />
                <div className="h-9 bg-gray-300 rounded-lg w-[20%] ml-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadSkeleton;
