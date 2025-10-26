import React from "react";
import ThemeLink from "./ThemeLink";
export default function Hero() {
  
  return (
    <div className=" bg-gradient-to-b from-blue-900 flex flex-col py-14 md:py-32 px-4 md:px-16 text-slate-50 items-center gap-6">
      <div className="flex flex-col sm:space-y-8 space-y-6  items-center
       md:max-w-4xl w-full mx-auto text-center ">
        <h2 className="text-xl md:text-4xl font-bold md:mt-14 mt-10 ">
          Sales management software for growing businesses.
        </h2>
         <p className="text-base md:text-xl text-[15px]">
          Increase your sales and keep track of every unit with our powerful
          warehouse management, order fulfillment, and sales control software.
        </p>
        <div className="py-8 flex md:gap-4 gap-2.5 items-center 
        flex-wrap  justify-center">
          <>
            <ThemeLink
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-300
               text-white  "
              title="Access the Sales System"
              href="/dashboard/home/overview"
              />
              <ThemeLink
                className="bg-slate-50 hover:bg-slate-100 focus:ring-slate-300 text-slate-900"
                 title="Access Your Account"
                href="/dashboard/settings/setting-profile/update"
              />
          </>
        </div>
      </div>
      <div className="md:w-[90%] md:h-[90%] opacity-75  
      w-[95%] h-[95%] mx-auto rounded-xl">
        <img src='/images/previewDash.png' className="w-full h-full
         rounded-xl object-cover object-center mx-auto" alt="Sales App" />
      </div>
    </div>
  );
}
