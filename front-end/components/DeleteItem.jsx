'use client'
import React, { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { deleteItem } from '@/actions/deleteItem'
import LoadingButton from './LoadingButton'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function DeleteItem({ id }) {
  const [
    isLoading,
    setIsLoading,
  ] = useState()
 
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
      const response = await deleteItem('users/user-logs' ,id)
      if (response.status === 200) {
        toast.success(`User Log Deleted Successfully`)
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
   <div>
      {isLoading ?
        ( 
          <LoadingButton/>
        ):(
      <p 
        className='flex items-center gap-1 cursor-pointer 
         text-red-600 dark:text-red-500'
          onClick={handleDeleteItem}
      >
        <AiFillDelete
          className="text-17" />
        <span className='text-14'>Delete</span>
      </p>
      )}
  </div>
  )
}

