import React from 'react'
import SafeForm from '@/components/Forms/SafeForm'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'

export default async function UpdateSafe({ params}) {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/safes-permissions?user=${session?.id}`)
  if(!permission?.safesDataUpdate){
 redirect('/authrization')
 }
 const {id} = await params
  const safe = await fetchingData(`safes/find/${id}`)
  return <SafeForm isUpdate={id} initialData={safe} />
}
