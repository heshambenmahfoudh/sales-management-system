import React from 'react'

const StatusData = ({list,resourceName , size}) => {
  console.log('list',list?.length);
  return (
    <div> {list?.length <= 0 && (
            <div
              className={`  p-6 text-center text-18 border-b-[1px] 
              min-w-[${size}px] border-gray-200
            gap-2 bg-white 
            `}
            >
              No {resourceName} Here
            </div>
          )}</div>
  )
}

export default StatusData