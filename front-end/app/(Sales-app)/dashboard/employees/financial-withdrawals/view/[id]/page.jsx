import React from 'react'
import WithdrawalsForm from '@/components/Forms/WithdrawlsForm'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'

export default async function ViewWithdrawals({ params }) {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 
 const permission = await
  fetchingData(`users/employees-permissions?user=${session?.id}`)
 if(!permission?.employeesWithdrawalsDataView){
 redirect('/authrization')
 }
  const {id} = await params
  const data = await fetchingData(`employees/withdrawals/find/${id}`)
  return <WithdrawalsForm isUpdate={id} initialData={data} />
}
