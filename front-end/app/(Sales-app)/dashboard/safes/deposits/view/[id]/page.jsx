import React from 'react'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import DepositemonyForm from '@/components/Forms/DepositemonyForm'

export default async function ViewDeposite({ params }) {
  const session =await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await 
   fetchingData(`users/safes-permissions?user=${session?.id}`)
   if(!permission?.safesDepositsView){
 redirect('/authrization')
    }
 const {id} = await params
  const deposite = await fetchingData(`mony-deposites/find/${id}`)
  return <DepositemonyForm isUpdate={id} initialData={deposite} />
}
