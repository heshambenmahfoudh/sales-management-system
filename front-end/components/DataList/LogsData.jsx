'use client'
import { spliteObject } from '@/lib/spliteItem'
import { User } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import FixedHeader from '../Headers/FixedHeader'
import TextInputSearch from '../FormInput/TextInputSearch'
import DeleteItem from '../DeleteItem'

export default function LogsData( {
  data,
  permission
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm() 

  const search = watch('search')
  const fromDate = watch('fromDate')
  const toDate = watch('toDate')
  const newData = useMemo(() => {
    return (
      data?.length > 0 &&
      data?.logs?.filter((item) => {
        const searchValue =
          search === '' ||
          Object.values(spliteObject(item))
            ?.join()
            ?.toLowerCase()
            ?.includes(search?.toLowerCase())
        const existDate = new Date(item?.userLogs?.createdAt)
        const rangeDate =
          (!fromDate || new Date(fromDate) <= existDate) &&
          (!toDate || existDate <= new Date(toDate))
        return searchValue && rangeDate
      })
    )
  }, [data, search, fromDate, toDate])

  return (
    <div>
      <FixedHeader
        textValue="User Logs"
         numberData={ data?.length | 0}
        isHidden={true}
      />
      <div className=" overflow-auto md:mt-6 mt-4  md:mx-5 mx-3 ">
        {data?.length > 0 && (
          <div
            className="grid gap-x-3 md:gap-y-4 gap-y-0.1 
                      md:grid-cols-4 grid-cols-1  "
          >
            <TextInputSearch
              register={register}
              name="search"
              className="w-full"
              placeholder="Search Data"
            />
            <div className="flex items-center">
              <TextInputSearch
                type="date"
                register={register}
                name="fromDate"
                className="w-full"
                placeholder="Enter from date"
              />
              <TextInputSearch
                type="date"
                register={register}
                name="toDate"
                className="w-full"
                placeholder="Enter to date"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full mt-2">
        <div
          className={` bg-gray-300 px-4 pb-4 rounded-xl overflow-auto
      shadow-md  md:mx-5 mx-3 
      ${
        data?.length  > 2
          ? 'md:h-[440px]  h-[400px] '
          : 'h-fit'
      } `}
        >
          {newData?.length > 0 ? (
            newData?.map((item) => (
              <div key={item?.logDate}>
                <div className="sticky top-0 py-3 px-2 bg-gray-300 z-10 ">
                  <h2 className="text-[17px] font-medium text-blue-600 ">
                    {item?.logDate}
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  {item?.userLogs?.map((item) => (
                    <article
                      key={item?._id}
                      className="md:p-3  p-2 rounded-lg border-1 flex justify-between 
                        border-gray-200 bg-white hover:bg-blue-50 gap-2"
                    >
                      <div>
                        <div className="flex items-center mb-2 ">
                          <User className="h-6 w-6 text-blue-500 mr-2" />{' '}
                          <p className="text-blue-600 capitalize font-medium">
                            {item?.user?.name}
                          </p>{' '}
                        </div>
                        <div className="flex items-center mb-0.5 flex-wrap ">
                          <h1 className="mr-1"> Activity:</h1>{' '}
                          <p>{item?.activity}</p>{' '}
                        </div>
                        <div className="flex items-center mb-0.5 flex-wrap ">
                          <h1 className="mr-1"> Device:</h1>{' '}
                          <p>{item?.device}</p>
                        </div>
                        <div className="flex items-center mb-0.5 flex-wrap ">
                          <h1 className="mr-1"> IP Address:</h1>{' '}
                          <p>{item?.ipAdress}</p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end ">
                        <span className="text-blue-700 ">
                          {item?.createdAt?.toString()?.slice(11, 19)}
                        </span>
                        {permission?.logDelete && (
                          <DeleteItem id={item?._id} />
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div
              className="p-4 text-xl mt-6.5 rounded-lg mb-2 bg-white text-center flex 
              justify-center items-center flex-col
              gap-5"
            >
              There is No Data to Display
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
