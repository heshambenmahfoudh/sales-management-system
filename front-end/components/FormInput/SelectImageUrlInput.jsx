import { ImageIcon, XCircle } from 'lucide-react'
import React from 'react'



export default function SelectImageUrlInput({
  chaneValue,
  imageUrl,
  setImageUrl,
  isLoadingImageUrl,
  register,
  errors,
  className = 'sm:col-span-2',
  name = 'imageUrl',
  isRequired = true,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-[14px] font-medium leading-5 text-gray-700 mb-2 "
      >
        Image Url
      </label>
      <div
        className="w-full gap-2  mb-3 mt-2
        "
      >
        {imageUrl ? (
          <div className="relative mb-6 ">
            <button
              type="button"
              className="absolute top-1 right-1 cursor-pointer 
                       bg-slate-100 text-red-600 rounded-full "
              onClick={() => setImageUrl('')}
            >
              <XCircle className="w-6 h-6" />
            </button>
            <img
              className="rounded-xl md:max-h-[170px] max-h-[140px] w-full 
                border-[2px] border-gray-300 "
              src={imageUrl && imageUrl}
              alt="imageUrl"
            />
          </div>
        ) : (
          <label
            className=" md:min-h-[170px] min-h-[140px] w-full  rounded-xl 
            border-[2px] border-gray-300
            flex justify-center items-center gap-2 cursor-pointer"
          >
            <input
              type="file"
              {...register(`${name}`, { required: isRequired })}
              name={name}
              onChange={chaneValue}
              accept="image/*"
              className="hidden"
            />
            <ImageIcon className="w-5 h-5" />
            <h2 className="text-[19px]">
              {isLoadingImageUrl ? 'Uploading...' : 'Upload'}
            </h2>
          </label>
        )}

        {errors[`${name}`] && (
          <span className="text-sm text-red-600 ">Image Url is required</span>
        )}
      </div>
    </div>
  )
}
