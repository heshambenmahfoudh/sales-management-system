
export default function WareHouseSummary({WareHouses}) {
 
  return (
    <div className="flex justify-between flex-col md:flex-row items-center md:gap-4 gap-1 sms:flex-wrap">
        {WareHouses?.map(({ title, productItem },i) => (
          <div
          className="mb-3 shadow w-full rounded-lg border
          border-slate-200 hover:border-blue-400 bg-white py-2 px-4 
          cursor-pointer flex items-center 
            gap-3 justify-between transition-all duration-300"
          key={i}
          >
            <h2 className="text-slate-500 uppercase text-[15.5px]">
              {title}
            </h2>
            <h4 className="text-2xl">{productItem?.length}</h4>
          </div>
        ))}
    </div>
  )
}
  
