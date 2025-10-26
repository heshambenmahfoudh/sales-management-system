'use client'
import GridShape from '@/components/GridShape'
import { ArrowLeft, RefreshCw, ServerCrash } from 'lucide-react'


export default function Error() {
  return (
    <div
      className="relative flex flex-col items-center 
    justify-center min-h-screen md:p-6 overflow-hidden z-1 bg-white/85 "
    >
      <GridShape />
      <div className="md:mx-auto  mx-3 md:w-[630px]  rounded-sm p-12
       bg-white shadow-sm 
      flex justify-center items-center flex-col">
        <div className='p-4 mb-2 rounded-full bg-red-500 w-fit h-fit'>
            <ServerCrash className='text-white  w-7 h-7 ' />
        </div>
        <h1 className=" mt-2 mb-4 font-medium text-black capitalize
         md:text-4xl text-2xl">
          500 - server error
        </h1>
        <p className=" text-center text-gray-700 text-[16px]">
          Sorry! Something went wrong on our server. we'er working to fix the issuse.
        </p>
         <div className='flex justify-between items-center gap-4 md:my-12 my-4'>

                <button
                onClick={ () => window.location.reload()}
                className="inline-flex items-center cursor-pointer
                justify-center rounded-sm bg-blue-50  px-4 py-[7px] text-black
                    text-sm font-medium border-1 border-black/10  shadow-theme-xs gap-4 "
                >
                < RefreshCw className=' w-4 h-4 text-black'/> 
                Refrech Page
                </button>
                <button
                onClick={()=>  window.history.back()}
                className="inline-flex items-center cursor-pointer
                justify-center rounded-sm bg-blue-50  px-4 py-[7px] text-black
                    text-sm font-medium border-1 border-black/10  shadow-theme-xs
                    gap-4 "
                >
                < ArrowLeft className=' w-4 h-4'/> 
                Go Back
                </button>
        </div>
         {/* <!-- Footer --> */}
      <p className=" text-sm text-center text-gray-700">
        &copy; {new Date().getFullYear()} - sales system All rights reserved
      </p>
      </div>
     
    </div>
  )
}
