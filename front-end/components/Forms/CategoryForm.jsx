'use client'
import { createNewCategory, updateCategory } from '@/actions/categories'
import { fetchingData } from '@/actions/fetchingData'
import ButtonClose from '@/components/FormInput/CloseButton'
import SelectInput from '@/components/FormInput/SelectInput'
import SubmitButton from '@/components/FormInput/SubmitButton'
import TextAreaInput from '@/components/FormInput/TextAreaInput'
import TextInput from '@/components/FormInput/TextInput'
import FormHeader from '@/components/Headers/FormHeader'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {  useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function CategoryForm({ isUpdate, initialData }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {...initialData,
      brand: initialData?.brand?._id
    },
  })
 
      const { data: brandsData } = useQuery({
      queryKey: ['brandsData'],
      queryFn: () => fetchingData(`brands`),
    })
 const brandOptions =  brandsData?.map(({ _id, title }) => ({
        value: _id,
        label: title,
      }))

  
  async function onSubmit(data) {
    setIsLoading(true)
    if (isUpdate) {
      try {
        
        const response = await updateCategory(isUpdate, data)
        if (response.status === 200) {
          router.push('/dashboard/inventory/categories')
          setIsLoading(false)
        toast.success('Category Updated Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    } else {
      try {
        
        const response = await createNewCategory(data)
        if (response.status === 200) {
          router.push('/dashboard/inventory/categories')
          setIsLoading(false)
        reset()
        toast.success('New Category Created Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false)
    }
    }
  }

  return (
    <div>
      <FormHeader
        linkUrl="/dashboard/inventory/categories"
        titleValue={isUpdate ? 'update category' : 'new category'}
      />
      <form
        className="lg:p-10 p-6 md:mx-auto mx-2.5 my-5 rounded-md 
     bg-white shadow-md max-w-4xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-6 md:gap-y-4 gap-y-2.5 md:grid-cols-2 grid-cols-1  mt-3">
          <SelectInput
            label="Select The Brand"
            name="brand"
            control={control}
            className="w-full"
            options={brandOptions}
            errors={errors}
            option="Brand"
          />
          <TextInput
            label="Category Title"
            register={register}
            name="title"
            errors={errors}
            className="w-full"
          />
          
        </div>
        <div className="mt-6 flex justify-between gap-4 items-center">
          <SubmitButton
            title={isUpdate ? 'Update category' : 'Create category'}
            isLoading={isLoading}
            loadingTitle={
              isUpdate ? 'Updating category ...' : 'Creating category ...'
            }
          />
          <ButtonClose hrefUrl="/dashboard/inventory/categories" />
        </div>
      </form>
    </div>
  )
}


