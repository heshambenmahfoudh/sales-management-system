import { BsCurrencyDollar} from 'react-icons/bs'
import { SiGoogleanalytics } from 'react-icons/si'
import { SlPeople } from 'react-icons/sl'
import { fetchingData } from '@/actions/fetchingData'

export default async function Statics() {
 const productsData = await fetchingData('products')
 const suppliersData = await fetchingData('suppliers')
 const customersData = await fetchingData('customers')
 const salesData = await fetchingData('sales')
 
 let totalEarning = 0
 const seenOrder = new Set()
 salesData?.forEach(item => {
  if(!seenOrder?.has(item?.order)){
      totalEarning += item?.pay
      seenOrder?.add(item?.order)
  }
 return totalEarning 
});

return (
  <div
         className="grid lg:grid-cols-4 md:grid-cols-3  
        sm:grid-cols-2 grid-cols-1  gap-2 mb-2 parent">
          <div  className="bg-center bg-white  border-1 border-gray-200
          cursor-pointer  shadow bg-cover
          hover:border-blue-400 transition-all duration-300  
           rounded-2xl p-3 h-32  mb-1 sm:mb-0 item"
            style={{ backgroundImage: `url(${'/images/earning.svg'})` }} >
            <span
              className="p-2 mb-1 flex items-center justify-center w-fit
                       rounded-full bg-bg-basic  text-2xl text-blue-400">
           <BsCurrencyDollar />
            </span>
            <h3 className="font-bold text-[14px]">All Earning </h3>
            <div className='flex justify-between items-center'>
                <h1 className="font-bold text-2xl mb-2 ">${totalEarning || 0} </h1>
                <h3 className='font-semibold text-1xl mb-2 flex flex-col  items-center'>
                <span className='ml-1 text-11'>
                  Month {new Date().getMonth()}
                </span>
                <span className='ml-1 text-green-700 text-18'>
                ${0}
                </span>
                </h3>
            </div>
           
          </div>
          <div
            className="bg-center  cursor-pointer  border-1 border-gray-200 shadow
          hover:border-blue-400 transition-all duration-300  bg-white rounded-2xl p-3 
          h-32  mb-1 sm:mb-0 item"
          >
            <span
              className="p-2 mb-1 flex items-center justify-center w-fit
            rounded-full bg-white text-blue-400   text-2xl "
            >
           <SiGoogleanalytics />
            </span>
            <h3 className="font-bold text-[14px]">Total Products</h3>
            <div className='flex justify-between items-center'>
                <h1 className="font-bold text-2xl mb-2 ">{productsData?.length | 0} </h1>
            </div>
          </div>
           <div
            className="bg-center  cursor-pointer  border-1 border-gray-200 shadow
          hover:border-blue-400 transition-all duration-300  bg-white rounded-2xl p-3 h-32  mb-1 sm:mb-0 item"
          >
            <span
              className="p-2 mb-1 flex items-center justify-center w-fit
            rounded-full bg-bg-basic text-2xl text-blue-400"
            >
           <SlPeople />
            </span>
            <h3 className="font-bold text-[14px]">Total Suppliers</h3>
            <div className='flex justify-between items-center'>
                <h1 className="font-bold text-2xl mb-2 ">{suppliersData?.length | 0} </h1>
            </div>
           
          </div>
          <div
            className="bg-center  cursor-pointer  border-1 border-gray-200 shadow
          hover:border-blue-400 transition-all duration-300  bg-white rounded-2xl p-3 h-32  mb-1 sm:mb-0 item"
          >
            <span
              className="p-2 mb-1 flex items-center justify-center w-fit
            rounded-full bg-bg-basic text-2xl text-blue-400"
            >
           <SlPeople />
            </span>
            <h3 className="font-bold text-[14px]">Total Customers</h3>
            <div className='flex justify-between items-center'>
                <h1 className="font-bold text-2xl mb-2 ">{customersData?.length | 0} </h1>
              
            </div>
           
          </div>
         
  </div>
  )
}

