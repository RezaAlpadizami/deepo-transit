import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

import Context from '../context';

function LoadSkeleton() {
  const { store } = useContext(Context);

  return (
    <div
      className={`${
        store?.isDrawerOpen ? 'w-[83%]' : 'w-full'
      }absolute shadow rounded-md  bg-white z-[999] grid items-start justify-items-center grid-cols-1 h-full`}
    >
      <div className=" w-full mx-auto ">
        <div className="animate-pulse flex">
          <div className="flex-1 space-y-6">
            <div className="flex">
              <div className="h-8 bg-gray-300 rounded w-[15%]" />
              <div className="flex-1" />
              <div className="h-10 bg-gray-300 rounded-full  w-[8%] " />
              <div className="h-10 bg-gray-300 rounded-full w-[8%] ml-5 mr-10" />
            </div>
            <div className="pl-4 h-full">
              <div className="space-y-3 pt-5 w-[80%]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-5 bg-gray-300 rounded col-span-1 w-20" />
                  <div className="h-5 bg-gray-300 rounded col-span-1 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-6 bg-gray-300 rounded col-span-1" />
                  <div className="h-6 bg-gray-300 rounded col-span-1" />
                </div>
              </div>
              <div className="space-y-3 pt-12 w-[80%]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-5 bg-gray-300 rounded col-span-1 w-20" />
                  <div className="h-5 bg-gray-300 rounded col-span-1 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-6 bg-gray-300 rounded col-span-1" />
                  <div className="h-20 bg-gray-300 rounded col-span-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(LoadSkeleton);
