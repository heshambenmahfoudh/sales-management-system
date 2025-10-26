import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import EmployeesPaySalaryData from '@/components/DataList/EmployeesPaySalaryData'
import { redirect } from 'next/navigation'


export default async function PayingSalaries() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 
 const permission = await 
 fetchingData(`users/employees-permissions?user=${session?.id}`)
 if(!permission?.employeesPaySalaryDataDisplay){
 redirect('/authrization')
 }
 
 const data = await fetchingData(`employees/pay-salaries`,
 )
  return (
    <EmployeesPaySalaryData data={data} permission={permission} />
  )
}
