import React from 'react'

export default function Earning({salesEarningsData}) {
 let totalEarning = 0
 let totalSales = 0
 salesEarningsData?.forEach(item => {
  totalSales += (item?.salePrice * item?.qty) 
  totalEarning += (item?.salePrice - item?.buyPrice) * item?.qty
});
  return (
    <div className=" px-8 flex items-center justify-start -mt-2
      gap-2.5 md:px-4   md:gap-4">
        <div className=" flex items-center md:gap-1.5 gap-1" >
            <div
                className="mb-3 shadow w-full rounded-lg border
                border-slate-200 hover:border-blue-400 bg-white py-2 px-3
                cursor-pointer flex items-center 
                    gap-5 justify-between transition-all duration-300"
                >
            <h2 className="text-slate-500 uppercase text-[16px]">
              total sales
            </h2>
            <h4 className="text-[16px]">{totalSales}</h4>
          </div>
        </div>
        <div className=" flex items-center gap-1.5 sms:gap-1"  >
              <div
           className="mb-3 shadow w-full rounded-lg border
                border-slate-200 hover:border-blue-400 bg-white py-2 px-3
                cursor-pointer flex items-center 
                    gap-5 justify-between transition-all duration-300"
          >
            <h2 className="text-slate-500 uppercase text-[16px]">
              total earning
            </h2>
            <h4 className="text-[16px]">{totalEarning}</h4>
          </div>
        </div>
      </div>
  )
}
