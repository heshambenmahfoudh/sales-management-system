import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function FormHeader({titleValue ,linkUrl, isHidden}) {
  return (
     <div
        className="flex justify-between items-center  shadow-sm
        bg-white h-[60px]  md:px-8 px-4 sticky top-[60px] z-50 ">
        <h2 className="capitalize  md:text-[16px] text-[14px] font-semibold text-black ">
          {titleValue} 
        </h2>
        {!isHidden && (
          <Link
          href={linkUrl}
          className=" md:text-[16px] p-2 text-[14px] bg-blue-300 rounded-full"
          >
               <X className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        )}
      </div>
  )
}

