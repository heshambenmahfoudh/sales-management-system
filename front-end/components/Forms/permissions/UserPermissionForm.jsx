import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import { updateUserPermission } from '@/actions/permissions'
import { className } from '@/app/(dummy)/data'
import CheckBoxInput from '@/components/FormInput/CheckBoxInput'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import { useStateContext } from '@/contexts/ContextProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'


export default function UserPermissionForm() {
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
  const usersOptions = usersData?.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  const { data: permissionData } = useQuery({
    queryKey: ['userPermission', id],
    queryFn: () =>   fetchingData(`users/users-permissions?user=${id}`)
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
    const updatedPermission = await updateUserPermission(`/users/users-permissions/${id}`,data)
  if (updatedPermission?.status === 200) {
    reset()
    setIsLoading(false)
    query.invalidateQueries({ queryKey: ['userPermission'] })
    toast.success('User users permission updated successfully')
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
          Users Pages
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
              options={usersOptions}
              errors={errors}
              option="User"
            />
          </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-2 mt-6">
              <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                <h2>Users</h2>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <CheckBoxInput
                    label="Display"
                    name="userDataDisplay"
                    register={register}
                    className={className}
                  />
                  <CheckBoxInput
                    label="Create"
                    name="userDataCreate"
                    register={register}
                    className={className}
                  />
                  <CheckBoxInput
                    label="Update"
                    name="userDataUpdate"
                    register={register}
                    className={className}
                  />
                  <CheckBoxInput
                    label="Delete"
                    name="userDataDelete"
                    register={register}
                    className={className}
                  />
                </div>
              </div>
              <div className="w-full border-1 border-blue-300 p-3 pt-2  rounded-lg">
                <h2>Users Permissions</h2>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <CheckBoxInput
                    label="Display"
                    name="userPermissionDisplay"
                    register={register}
                    className={className}
                  />
                  <CheckBoxInput
                    label="Update"
                    name="userPermissionUpdate"
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
