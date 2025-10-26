'use client';
import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import InvoiceButton from './InvoiceButton';
import InvoiceHeader from './InvoiceHeader';
import InvoiceFooter from './InvoiceFooter';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SaleEarningInvoice  ({saleEarningData  ,saleId})  {
  const invoiceReferance = useRef()
  const {data:session,status} = useSession()
  if (status === 'unauthenticated') {
    return redirect('/')
  }
  
  const date= new Date()
  const dateNow = date.toLocaleDateString('en-GB')  
  const dayNow = date.toLocaleDateString('en-GB',{weekday:'long'})  
  const [timeNow, setTimeNow] = useState('')
useEffect(() => {
  const intervalTimeNow=setTimeNow(date.toLocaleTimeString('en-GB') )
  const timeInterval = setInterval(intervalTimeNow,1000)
  return ()=> clearInterval(timeInterval)
}, [])

  return (
      <div >
            <InvoiceButton saleData={saleEarningData}
             invoiceReferance={invoiceReferance.current} />
      <div className="overflow-x-auto   mx-3   ">
        <div ref={invoiceReferance} className="overflow-auto bg-white min-w-fit 
         p-8 rounded-lg shadow-lg shadow-blue-400 ">
          {/* Header with Logo */}
          <div className='flex justify-between items-center  border-b-[2px]'>
             <InvoiceHeader/>
              <div className="text-center">
                  <h1 className="text-16 font-medium uppercase underline">Sale Earning Invoice# {saleEarningData?.[0]?.order}</h1>
                  <p className='text-16 font-medium capitalize'>{timeNow}</p>
              </div>
              <div >
                  <p className='text-16 font-medium uppercase'>
                  <span className='capitalize'>Date</span> : {dateNow}</p>
                  <p className='text-16 font-medium capitalize'>
                  <span className='capitalize'>Day</span> : {dayNow}</p>
              </div>
          </div>
          {/* Company Info  */}
           <div className="mt-5 mb-7   flex items-center gap-2">
            <h2 className="text-15 font-medium">Name :</h2>
            <p className="text-gray-700 font-medium capitalize">
              {saleEarningData?.[0]?.customer?.name||saleEarningData?.[0]?.cashCustomer}</p>
          </div>
          <div className='flex justify-between items-center gap-4 mt-3 mb-5'>
            <article className='border-1 p-2 w-full text-center bg-blue-50  rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>INVOICE DATE</h2>
              <h1 className='font-medium'>{saleEarningData?.[0]?.date?.slice(0,10)}</h1>
            </article>
            <article className='border-1 p-2 w-full text-center bg-blue-50  rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>ORDER NUMBER</h2>
              <h1 className='font-medium'>{saleId}</h1>
            </article>
            <article className='border-1 p-2 w-full text-center bg-blue-50 rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>STATUS</h2>
              <h1 className='font-medium'>22/2/2020</h1>
            </article>
          </div>

          {/* START HEADER */}
         <div className={`  p-1.5 rounded-t-md 
            flex bg-blue-200  
          justify-between items-center gap-1  text-14 sms:text-13 font-bold text-center `}>
              <h2  className={` text-center min-w-[30px] font-medium uppercase text-14 `}>
              id
              </h2>
              <h2  className={` text-center smd:min-w-[250px] w-full font-medium uppercase text-14 `}>
               product
              </h2>
              <h2  className={` text-center min-w-[150px] font-medium uppercase text-14 `}>
               brand
              </h2>
              <h2  className={` text-center min-w-[100px] font-medium uppercase text-14 `}>
               unit
              </h2>
              <h2  className={` text-center min-w-[60px] font-medium uppercase text-14 `}>
               qty
              </h2>
              <h2  className={` text-center min-w-[60px] font-medium uppercase text-14 `}>
               b_price
              </h2>
              <h2  className={` text-center min-w-[60px] font-medium uppercase text-14 `}>
               s_price
              </h2>
              <h2  className={` text-center min-w-[120px] font-medium uppercase text-14 `}>
               total price
              </h2>
         </div>
          {/* END HEADER */}
          {/* Items Table */}
          <div className="mb-6 rounded-md ">
          {saleEarningData?.map(
            (
              {
                _id,
                product,
                brand,
                unit,
                qty,
                totalPrice,

                 buyPrice,
                salePrice,
              },
              i,
            ) => (
              <article
                key={_id}
                className=" min-h-[40px] p-3 border-b-[1px]  border-gray-200
             gap-1 bg-blue-50 
             flex justify-between items-center text-15  font-medium capitalize"
              >
                <p className="min-w-[30px] text-center text-15 sms:text-14">
                  {i+1}
                </p>
                  <p className=" text-center smd:min-w-[250px] w-full">{product?.title}</p>
                  <p className=" text-center min-w-[150px]">{brand?.title}</p>
                  <p className=" text-center min-w-[100px]">{unit?.title}</p>
                  <p className=" text-center min-w-[60px]">{qty}</p>
                  <p className=" text-center min-w-[60px]">{buyPrice}$</p>
                  <p className=" text-center min-w-[60px]">{salePrice}$</p>
                  <p className=" text-center min-w-[120px]">{totalPrice}$</p>
              </article>
            ),
          )}
          </div>
    
          {/* Totals Section */}
          <div className='flex flex-col flex-start justify-start gap-2 border-1 border-blue-100 bg-blue-50 w-fit p-3 rounded-md'>
            <div className="flex items-center gap-2">
              <h2 className='text-15 font-medium mr-3'>Total :</h2>
              <p className='text-15 font-medium px-5 py-.5 
              
              rounded-md
              '>{saleEarningData?.[0]?.totalItemsPrice}$</p>
            </div>
            <div className="flex items-center gap-2">
              <h2 className='text-15 font-medium mr-5'>Pay    {' '}:</h2>
              <p className='text-15 font-medium px-5 py-.5 
              
              rounded-md
              '>{saleEarningData?.[0]?.pay}$</p>
            </div>
            <div className="flex items-center gap-2">
              <h2 className='text-15 font-medium'>Abider :</h2>
              <p className='text-15 font-medium px-5 py-.5 
              
              rounded-md
              '>{saleEarningData?.[0]?.abider | 0}$</p>
            </div>
          </div>

          {/* Terms & Conditions */}
            <InvoiceFooter/>
        </div>
      </div>
      </div>
  );
};

