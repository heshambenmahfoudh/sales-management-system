import React from 'react'
import { PUBLIC_FOLDER } from '../(dummy)/data'

const Image = ({img,size }) => {
  return (
    <p className={`min-w-[${size}px] flex 
    
     justify-center items-center`}>
      <img
          src={img ?  img :'/imagePerson.webp' }
          className="rounded-lg  w-[98px] h-[50px] "
          alt=""
          />
     </p>
  )
}

export default Image