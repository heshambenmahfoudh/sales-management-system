'use client'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print';

export default function InvoiceButton ({referance}) {
 
const print = useReactToPrint({
    contentRef: referance,
  });

 
  return (
    <div className="flex justify-end mx-3 items-end mb-3 no-print mt-2.5">
          <div className="flex gap-2">
            <button
              onClick={print}
             className="flex items-center gap-2 px-8 border-1 cursor-pointer border-gray-300  py-2
             font-medium text-14  rounded-md bg-white"
            >
                <Printer className='h-[16px]'/>
              Print 
            </button>
          </div>
        </div>
  )
}
