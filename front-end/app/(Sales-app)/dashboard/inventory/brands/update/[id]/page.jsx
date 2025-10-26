import React from 'react'
import BrandForm from '@/components/Forms/BrandForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateBrand({ params }) {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.brandsDataUpdate){
 redirect('/authrization')
  }
   const {id} = await params
  const brand = await fetchingData(`brands/find/${id}`)

  return <BrandForm isUpdate={id} initialData={brand} />
}
