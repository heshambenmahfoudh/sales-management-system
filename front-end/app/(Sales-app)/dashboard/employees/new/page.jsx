import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import EmployeeForm from '@/components/Forms/EmployeeForm'
import { redirect } from 'next/navigation'

export default async function NewEmployee() {
  const session = await getServerUser()
   if (!session) {
 redirect('/login')
 }
 
 const permission = await 
 fetchingData(`users/employees-permissions?user=${session?.id}`)
 if(!permission?.employeesDataCreate){
  redirect('/authrization')
 }
  return <EmployeeForm />
}
