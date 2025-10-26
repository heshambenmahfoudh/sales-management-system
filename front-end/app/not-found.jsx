'use client'
import React from 'react'
import GridShape from '@/components/GridShape'
import {  ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
      <div
          className="relative flex flex-col items-center 
    justify-center min-h-screen md:p-6 overflow-hidden z-1 bg-white/85 "
        >
          <GridShape />
          <div className="md:mx-auto min-w-full  mx-3 md:min-w-[630px] max-w-full  
          rounded-sm md:p-12 p-6
       bg-white shadow-sm 
      flex justify-center items-center flex-col">
           
            <h1 className=" my-2 font-medium text-black capitalize
             md:text-3xl text-2xl">
              404 - not found
            </h1>
            <div className='
            md:max-w-[350px] 
            md:max-h-[350px]  max-w-[300px] 
            max-h-[300px]'>

            <img src='/images/notfound.png'
             className='w-full h-full' alt="not-found.png"   />
             </div>
           
          <div className="flex justify-between items-center gap-4  my-3">
          <Link
            href="/"
            className="inline-flex items-center cursor-pointer
                    justify-center rounded-sm my-5  px-6 bg-blue-50 py-[7px] text-black
                        text-sm font-medium border-1 border-black/10  shadow-theme-xs
                        gap-4 "
          >
            <Home className=" w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center cursor-pointer
                             justify-center rounded-sm bg-blue-50  px-4 py-[7px] text-black
                                 text-sm font-medium border-1 border-black/10  shadow-theme-xs
                                 gap-4 "
          >
            <ArrowLeft className=" w-4 h-4" />
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
