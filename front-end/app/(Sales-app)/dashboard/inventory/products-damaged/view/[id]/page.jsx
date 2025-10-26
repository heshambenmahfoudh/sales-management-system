import React from 'react'
import ProductdamagedForm from '@/components/Forms/ProductdamagedForm'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'

export default async function ViewDamagedProduct({ params}) {
const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await
   fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.productsDamagedDataView){
 redirect('/authrization')
  }
   const {id} = await params
  const data = await fetchingData(`products/damaged-products/find/${id}`)
  return <ProductdamagedForm isUpdate={id} initialData={data} />
}
