'use client'
import Link from 'next/link'
import {Edit2Icon,Eye} from 'lucide-react'
import { AiFillDelete } from 'react-icons/ai'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import { deleteItem } from '@/actions/deleteItem'

export default function ActionData({
  onUpdated 
  ,onDeleted,
  onView,
  onViewInvoice,
  linkToUpdate,
  linkToView,
  id,
  endPoint,
  resourceName,
  linkViewInvoice=''}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  async function handleDeleteItem() {
   
    setIsLoading(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteItem(endPoint ,id)
         if (response.status === 200) {
           toast.success(`${resourceName} Deleted Successfully`)
           router.refresh()
           setIsLoading(false)
          }else{
                toast.error(response.error)
            setIsLoading(false)
          }
        } catch (error) {
          setIsLoading(false)
        }
      } else {
          setIsLoading(false);
      }
    });
  }

  return (
   <div className='flex justify-center items-center gap-3 min-w-[150px] 
                text-center font-medium capitalize '>
    {
      !onDeleted &&
      !onUpdated &&
      !onView &&
      !onViewInvoice 
      ? (
          <>
              Not Allowed
          </>
          ) : (
          <>
              {!isLoading  && (
                <>
                  {onUpdated &&linkToUpdate&& (
                    <Link href={linkToUpdate}
                      className="
                                gap-1 cursor-pointer
                                flex items-center font-medium
                                 text-blue-600
                                 dark:text-blue-500"
                      >
                          <Edit2Icon 
                          className="w-4 h-4" />
                          <span className='text-14'>Edit</span>
                      </Link>
                  )}
                   {onViewInvoice  &&linkViewInvoice&&(
                       <Link href={linkViewInvoice}
                          className=" gap-1 cursor-pointer flex items-center font-medium text-blue-600
                                  dark:text-blue-500">
                           <Eye 
                           className="w-4 h-4" />
                           <span className='text-14'>Invoice</span>
                       </Link>
                  )}
                  {onView &&linkToView&& (
                    <Link href={linkToView}
                      className="
                                gap-1 cursor-pointer
                                flex items-center font-medium
                                 text-blue-600
                                 dark:text-blue-500"
                      >
                          < Eye 
                          className="w-4 h-4" />
                          <span className='text-14'>View</span>
                      </Link>
                  )}
                </>
              )}
              {onDeleted && (
                <div>
                      {  isLoading ?
                              ( 
                                <LoadingButton/>
                              ):(
                                  <p 
                                  className='flex items-center gap-1 cursor-pointer 
                                   text-red-600 dark:text-red-500'
                                  onClick={() => handleDeleteItem(id)}
                                  >
                                    <AiFillDelete
                                      className="text-17" />
                                    <span className='text-14'>Delete</span>
                                  </p>
                        )
                      }
                </div>
              )}
          </>
        )
      }
   </div>
  )
}
