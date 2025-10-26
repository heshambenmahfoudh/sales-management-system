import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import PaysalaryForm from '@/components/Forms/PaysalaryForm'
import { redirect } from 'next/navigation'

export default async function NewPaySalary() {
  const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   
   const permission = await
    fetchingData(`users/employees-permissions?user=${session?.id}`)
   if(!permission?.employeesPaySalaryDataCreate){
   redirect('/authrization')
   }
  return <PaysalaryForm />
}
