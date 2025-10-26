import React from 'react'
import EmployeeForm from '@/components/Forms/EmployeeForm'
import { fetchingData } from '@/actions/fetchingData'
import { getServerUser } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function UpdateEmployee({ params }) {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  
  const permission = await 
  fetchingData(`users/employees-permissions?user=${session?.id}`)
  if(!permission?.employeesDataUpdate){
  redirect('/authrization')
  }
   const {id} = await params
  const data = await fetchingData(`employees/find/${id}`)
  return <EmployeeForm isUpdate={id} initialData={data} />
}
