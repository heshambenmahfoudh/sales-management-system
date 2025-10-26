import React from 'react'
import {  Loader2 } from 'lucide-react'


export default function SubmitButton({
  title,
  isLoading = false,
  isDisabled= false,
  loadingTitle,
  handleClick
}) {
  return (
    <>
      {!handleClick ?(
        <div>
          {isLoading ? (
            <button
              disabled={true}
              className="flex justify-center items-center gap-2 px-5 py-2.5 min-w-full
            cursor-not-allowed disabled:bg-blue-500/80 rounded-lg text-center
             bg-blue-500 text-white"
            >
              <Loader2 className=" h-4 w-4 animate-spin" />
              {loadingTitle}
            </button>
          ) : (
            <button className="px-5 py-2.5 cursor-pointer min-w-full text-center
             rounded-lg bg-blue-500 text-white">
              {title}
            </button>
          )}
        </div>
      ):(
        <button type="button" 
        disabled={isDisabled} 
        onClick={handleClick} className="px-8 py-2 disabled:cursor-not-allowed
         disabled:bg-blue-500/50
         cursor-pointer rounded-lg bg-blue-500 text-white">
            {title}
        </button>
      )}
    </>
  )
}
