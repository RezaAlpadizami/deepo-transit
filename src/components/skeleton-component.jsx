import React from 'react';

function LoadSkeleton() {
  return (
    <div className="absolute right-0 top-[19%] left-[16%] bottom-0 z-[999] w-full">
      <div className=" border border-blue-300 shadow rounded-md p-4 w-full mx-auto h-full">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6">
            <div className="h-5 bg-slate-500 rounded w-20" />
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
                <div className="h-5 bg-slate-500 rounded col-span-1" />
              </div>
              <div className="ml-[70%] flex pt-12">
                <div className="h-5 bg-slate-500 rounded w-[20%]" />
                <div className="h-5 bg-slate-500 rounded w-[20%] ml-3" />
              </div>
              <div className="flex ml-10">
                <div className="h-9 bg-slate-500 rounded w-[10%]" />
                <div className="h-9 bg-slate-500 rounded w-[10%] ml-8" />
                <div className="h-9 bg-slate-500 rounded w-[10%] ml-8" />
                <div className="h-9 bg-slate-500 rounded w-[10%] ml-8" />
              </div>
            </div>
            <div className="rounded-full bg-slate-500 h-10 w-full" />
            <div className="rounded-full bg-slate-500 h-10 w-full" />
            <div className="rounded-full bg-slate-500 h-10 w-full" />
            <div className="rounded-full bg-slate-500 h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadSkeleton;
