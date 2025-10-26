import React from 'react'
import PaysalaryForm from '@/components/Forms/PaysalaryForm'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'

export default async function ViewPaySalary({ params }) {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 
 const permission = await 
 fetchingData(`users/employees-permissions?user=${session?.id}`)
 if(!permission?.employeesPaySalaryDataView){
 redirect('/authrization')
 }
 const {id} = await params
  const data = await fetchingData(`employees/pay-salaries/find/${id}`)
  return <PaysalaryForm isUpdate={id} initialData={data} />
}
