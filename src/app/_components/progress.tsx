"use client";

export function Progress() {
  return (
    <div className="flex cursor-pointer items-center py-10 pl-2 pr-12">
      {/* rank */}
      <h3 className="min-w-[6em] text-xl font-bold">Beginner</h3>
      {/* progress bar */}
      <div className="relative flex min-w-[calc(100%-10em)] flex-grow items-center">
        {/* progress line */}
        <div className="bg-grey relative flex h-[1px] w-full items-center">
          {/* progress dots*/}
          <div className="flex w-full justify-between">
            <span className="relative w-0">
              <span className="bg-grey absolute left-[-4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full" />
            </span>
            <span className="relative w-0">
              <span className="bg-grey absolute left-[-4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full" />
            </span>
            <span className="relative w-0">
              <span className="bg-grey absolute left-[-4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full" />
            </span>
            <span className="relative w-0">
              <span className="bg-grey absolute left-[-4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full" />
            </span>
          </div>
        </div>
        {/* progress marker */}
        <div className="absolute left-0 h-8 w-8 translate-x-[-50%]">
          {/* progress value */}
          <span className="absolute flex h-full w-full items-center justify-center rounded-[50%] bg-primary text-xs">
            1
          </span>
        </div>
      </div>
    </div>
  );
}
