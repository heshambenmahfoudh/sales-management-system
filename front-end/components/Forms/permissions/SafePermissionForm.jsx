'use client'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import {  
  updateUserPermission } from '@/actions/permissions'
import { className } from '@/app/(dummy)/data'
import CheckBoxInput from '@/components/FormInput/CheckBoxInput'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import { useStateContext } from '@/contexts/ContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function SafePermissionForm() {
  const { isLoading, setIsLoading } = useStateContext()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm()
  
   const {data:session} =  useQuery({
       queryKey: ['sessionUser'],
       queryFn:getServerUser,
     })
    const id = watch('user')
     const { data: usersData } = useQuery({
       queryKey: ['usersData',session?.id],
       queryFn: () => fetchingData(`users?session=${session?.id}`),
       enabled:!!session?.id
     })
  const userOptions = usersData?.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  const { data: permissionData } = useQuery({
    queryKey: ['safePermission', id],
    queryFn: () => fetchingData(`users/safes-permissions?user=${id}`)
   , enabled:!!id
  })

  useEffect(() => {
    if (permissionData) {
      Object.entries(permissionData)?.forEach(
        ([key, value]) => {
          setValue(key , value)
        },
      )
    } else {
      reset()
    }
  }, [permissionData, setValue])

const query = useQueryClient()
  
  async function onSubmit(data) {
    try {
      
      setIsLoading(true)
      const updatedPermission = await updateUserPermission(`/users/safes-permissions/${id}`,data)
    if (updatedPermission?.status === 200) {
      reset()
      setIsLoading(false)
      query.invalidateQueries({ queryKey: ['safePermission'] })
      toast.success('User safes permission updated successfully')
    } else {
      setIsLoading(false)
      toast.error(updatedPermission?.error)
    }
  } catch (error) {
    setIsLoading(false)
   }
  }
  return (
   
     <div className="p-3 bg-gray-100 rounded-lg mt-2">
            <h2 className="text-center font-semibold text-17 underline  ">
              Safes Pages
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="  
              max-w-[354px]  mt-3"
              >
                <SelectInput
                  label="Select User"
                  name="user"
                   control={control}
                  className="w-full"
                  options={userOptions}
                  errors={errors}
                  option="User"
                />
              </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-2 mt-6">
                  <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                    <h2>Safes</h2>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <CheckBoxInput
                        label="Display"
                        name="safesDataDisplay"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Create"
                        name="safesDataCreate"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Update"
                        name="safesDataUpdate"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Delete"
                        name="safesDataDelete"
                        register={register}
                        className={className}
                      />
                    </div>
                  </div>
                  <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                    <h2>Deposite Mony</h2>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <CheckBoxInput
                        label="Display"
                        name="safesDepositsDisplay"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Create"
                        name="safesDepositsCreate"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="View"
                        name="safesDepositsView"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Delete"
                        name="safesDepositsDelete"
                        register={register}
                        className={className}
                      />
                    </div>
                  </div>
                  <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                    <h2>Pulled Mony</h2>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <CheckBoxInput
                        label="Display"
                        name="safesPulledDisplay"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Create"
                        name="safesPulledCreate"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="View"
                        name="safesPulledView"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Delete"
                        name="safesPulledDelete"
                        register={register}
                        className={className}
                      />
                    </div>
                  </div>
                  <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                    <h2>Transfer Mony</h2>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <CheckBoxInput
                        label="Display"
                        name="safesTransfersDisplay"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Create"
                        name="safesTransfersCreate"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="View"
                        name="safesTransfersView"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Delete"
                        name="safesTransfersDelete"
                        register={register}
                        className={className}
                      />
                    </div>
                  </div>
                  <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                    <h2>Safes Mony</h2>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <CheckBoxInput
                        label="Display"
                        name="safesMonyDisplay"
                        register={register}
                        className={className}
                      />
                      <CheckBoxInput
                        label="Delete"
                        name="safesMonyDelete"
                        register={register}
                        className={className}
                      />
                    </div>
                  </div>
                 
                </div>
              <div className="mt-8 flex justify-between gap-4 items-center">
                <SubmitButton
                  title="Update permission"
                  isLoading={isLoading}
                 loadingTitle="Updating permission ..."
                />
              </div>
            </form>
        </div>
  )
}