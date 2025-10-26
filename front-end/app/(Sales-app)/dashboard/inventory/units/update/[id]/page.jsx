import React from 'react'
import UnitForm from '@/components/Forms/UnitForm'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { fetchingData } from '@/actions/fetchingData'

export default async function UpdateUnit({ params}) {
  const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await 
   fetchingData(`users/inventory-permissions?user=${session?.id}`)
   if(!permission?.unitsDataUpdate){
 redirect('/authrization')
   }
    const {id} = await params
  const data = await fetchingData(`units/find/${id}`)
  return <UnitForm isUpdate={id} initialData={data} />
}
