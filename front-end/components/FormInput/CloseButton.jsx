import Link from 'next/link'
import React from 'react'

export default function ButtonClose({
  hrefUrl,
  isClose,
}) {
  return (
    <div>
      {hrefUrl ? (
        <Link
          href={hrefUrl}
          className="px-5 py-2 bg-white text-black border-[1.5px] cursor-pointer
border-gray-300 focus:outline-none  
    font-medium  text-[14px] text-center  rounded-sm "
        >
          Cancel
        </Link>
      ) : (
        <div
          onClick={isClose}
          className="px-5 py-2 bg-white text-black border-[1.5px] cursor-pointer
       border-gray-300 focus:outline-none  
           font-medium  text-[14px] text-center  rounded-sm "
        >
          Cancel
        </div>
      )}
    </div>
  )
}
