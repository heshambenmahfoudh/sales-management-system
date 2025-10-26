import React from 'react'
import WarehouseForm from '@/components/Forms/WarehouseForm'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { fetchingData } from '@/actions/fetchingData'
export default async function UpdateWrehouse({ params}) {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.wareHousesDataUpdate){
 redirect('/authrization')
  }
   const {id} = await params
  const data = await fetchingData(`warehouses/find/${id}`)
  return <WarehouseForm isUpdate={id} initialData={data} />
}
