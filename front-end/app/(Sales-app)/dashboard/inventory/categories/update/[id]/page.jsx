import React from 'react'
import CategoryForm from '@/components/Forms/CategoryForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateCategry({ params}) {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
 if(!permission?.categoriesDataUpdate){
 redirect('/authrization')
 }
 const {id} = await params
  const data = await fetchingData(`categories/find/${id}`)
  return <CategoryForm isUpdate={id} initialData={data} />
}
