import React from 'react'
import PulledmonyForm from '@/components/Forms/PulledmonyForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function ViewMonyPulled({ params}) {
 const session =await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/safes-permissions?user=${session?.id}`)
  if(!permission?.safesPulledView){
  redirect('/authrization')
   }
   
  const {id} = await params
  const data = await fetchingData(`mony-pulleds/find/${id}`)

  return <PulledmonyForm isUpdate={id} initialData={data} />
}
