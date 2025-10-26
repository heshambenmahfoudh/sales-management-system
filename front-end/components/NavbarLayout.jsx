"use client";
import Link from "next/link";
import { BiMenu } from "react-icons/bi";
import {  AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import getInitialName from "@/lib/getInitialName";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {  logoutUser } from "@/actions/auth";

export default function NavbarLayout({session}) {
const [show, setShow] = useState(false);

 const router = useRouter()

async function handleLogout() {
 try {
   const response = await logoutUser()
    if (response?.status === 200) {
        toast.success('User logout Successfully')
        router.push('/login')
    }
    } catch (error) {}
  }
  const initials = getInitialName(session?.name);

  return (
    <>
        <header className="bg-blue-900 fixed top-0 right-0 
        w-full left-0 h-16 sm:px-4 px-3 shadow-sm
        flex items-center justify-between md:px-16 text-slate-50 z-50">
          <Link className="font-bold flex items-center gap-3 text-xl md:text-2xl" href="/">
            {/* Sales System */}
            <div className=' rounded-full
            w-[45px] h-[45px] p-0.5 bg-white shadow-md border-1 border-blue-200    '>
              <Image 
                  src="/images/logosales.jpg" 
                  alt="logo" 
                  className="rounded-md" 
                  width={100} 
                  height={100}
              />
          </div>
              <h2 className='text-[20px] font-medium'>Sales System</h2>
          </Link>
                <nav className="hidden md:flex items-center gap-3">
                  <Link href="/">Features</Link>
                  <Link href="/">Pricing</Link>
                  <Link href="/">Free Tools</Link>
                </nav>
        
            <div className="hidden md:flex items-center gap-4  ">
              <div className="flex items-center space-x-4">
                <div className="relative inline-flex items-center
                 justify-center w-10 h-10 
                overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {initials}
                  </span>
                </div>
                <div className="font-medium dark:text-white">
                  <div>{session?.name}</div>
                  <div className="text-sm text-slate-50 dark:text-slate-400">
                   {session?.email}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className="text-white 
                bg-gradient-to-r from-red-400 via-red-500 to-red-600 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                focus:ring-red-300 dark:focus:ring-red-800 font-medium
                 rounded-lg 
                text-sm px-8 py-2.5 text-center mr-2 cursor-pointer"
              >
                Logout
              </button>
              
            </div>
        
          {/* Humberg menu */}
          <button onClick={() => setShow(true)} className="text-[23px] -ml-.5 p-2
          bg-gray-300 rounded-full text-emerald-900 cursor-pointer md:hidden 
          block">
            <BiMenu className="text-3xl" />
          </button>
        </header>
        <div
          className={
            show
              ? "sm:hidden fixed w-60 bg-slate-800 bg-opacity-90 h-screen right-0  z-50 top-0 p-4 text-slate-50"
              : "hidden sm:hidden fixed w-60 bg-slate-800 bg-opacity-90 h-screen right-0  z-50 top-0 p-4 text-slate-50"
          }
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-bold">Sales System</h2>
            <button onClick={() => setShow(false)}>
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>
          <nav className="flex flex-col items-start gap-3 mb-10">
            <Link href="/">Features</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">Free Tools</Link>
          </nav>
        
              <button
                onClick={handleLogout}
                type="button"
                className="text-white 
                bg-gradient-to-r from-red-400 via-red-500 to-red-600 
                hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                text-sm px-8 py-2.5 text-center mr-2 mb-2 cursor-pointer"
              >
                Logout
              </button>
        </div>
      </>
 
  );
}
