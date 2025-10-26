'use client'
import {BsSearch}  from 'react-icons/bs'
import { AiOutlineMenu } from 'react-icons/ai'
import { useStateContext } from '@/contexts/ContextProvider'
import getInitialName from '@/lib/getInitialName'
import SearchInput from './FormInput/SearchInput'
import { useQuery } from '@tanstack/react-query'
import { getServerUser } from '@/actions/auth'

export default function Navbar() {
  
 const {setActiveMenu}=useStateContext()
const {data:user} =  useQuery({
    queryKey: ['sessionUser'],
    queryFn:getServerUser,
  })
const initial = getInitialName(user?.name)

return (
  <div className='md:px-4 h-[60px]  px-3 py-2.5 border-b-1  border-gray-400
       flex justify-between sticky top-0 z-50
       items-center  gap-3 bg-blue-400 min-w-full'>
        <div className='flex items-center gap-3'>
        <span 
        className="text-[23px] -ml-.5 p-2
        bg-gray-300 rounded-full text-emerald-900 cursor-pointer"
        onClick={()=> setActiveMenu(prev => !prev)}
        >
          <AiOutlineMenu  />
        </span>
        <div className='sm:w-[300px] w-[240px] px-2 py-1.5 bg-gray-100 sms:mx-auto  gap-2 rounded-xl
          flex items-center'>
          <span className='text-gray-500'> <BsSearch/></span>
          <SearchInput   placeholder='Enter Search' />
        </div>
        </div>
        <div className='flex  items-center justify-center gap-2'>
        <h1 className=' capitalize hidden sm:flex font-medium underline text-white'>
          {user?.name}</h1>
          <div className='bg-blue-50 text-full text-center  w-10
                          h-10 border-1 font-medium  flex justify-center
                          items-center border-gray-300 rounded-[50%]'>
              {user?.imageUrl ? (
            <img
                src={  user?.imageUrl }
                className="rounded-[50%]  "
                alt=""
                />
              ):(
                <>
                {initial}
                </>
              )}
          </div>
          </div>
  </div>
  )
}


