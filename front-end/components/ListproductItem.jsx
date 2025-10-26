import React from 'react'
import { ProPurchaseHeader } from '@/app/(dummy)/data'
import InformationHeader from './Headers/InformationHeader'
import { AiFillDelete } from 'react-icons/ai'
import toast from 'react-hot-toast'


export default function ListproductItem({data ,setData }) {
  
   function handleDeleteProduct (id) {
     setData(data?.filter((item) => item?._id !== id))
     toast.success("Product Deleted Successfully")
   }


  return (
    <>
        {data && data?.length > 0 && (
            <div
              className={`my-4 rounded-md shadow-sm sm:col-span-2 
                overflow-auto `}>
              <InformationHeader
                data={ProPurchaseHeader}
                fixedSize="min-w-[1120px]"
              />
              <>
                { data && data?.length > 0 && data?.map(({_id,
                title,
                product,
                sku,
                unit,
                unitTitle,
                price,
                qty,
                totalPrice}, i) => (
                  <article
                    key={i}
                    className=" px-3 py-3  border-1 border-t-0 border-gray-400 
                    min-w-[1120px] nax-h-fit
             gap-1 bg-white hover:bg-gray-100
             flex justify-between items-center  "
                  >
                    <p
                      className=" text-center min-w-[200px] font-medium capitalize
                       text-[14px]
              "
                    >
                      {sku}
                    </p>
                    <p
                      className=" text-center min-w-[200px] font-medium capitalize
                       text-[14px]
              "
                    >
                      {title || product?.title}
                    </p>
                    <p
                      className=" text-center min-w-[100px]  font-medium capitalize text-[14px]
                    "
                    >
                      {unitTitle || unit?.title}
                    </p>
                   
                    <p
                      className=" text-center min-w-[100px] font-medium capitalize text-[14px]
                    "
                    >
                      {price} $
                    </p>

                    <p
                      className=" text-center min-w-[100px] font-medium capitalize text-[14px]
                    "
                    >
                      {qty}
                    </p>
                    <p
                      className=" text-center min-w-[100px] font-medium capitalize text-[14px]
                    "
                    >
                      {totalPrice}$
                    </p>
                    <p  
                    className='flex items-center gap-1 cursor-pointer 
                                   text-red-600 dark:text-red-500 min-w-[80px]'
                    onClick={() => handleDeleteProduct(_id)}
                                   >
                      <AiFillDelete
                        className="cursor-pointer  text-red-600 text-17"
                      />
                      <span className='text-[14px] font-medium'>Delete</span>
                    </p>
                  </article>
                ))}
              </>
            </div>
        )}
    </>
  )
}

