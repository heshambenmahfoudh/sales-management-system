import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import EmployeesWithdrawlsData from '@/components/DataList/EmployeesWithdrawlsData'
import { redirect } from 'next/navigation'

export default async function WithdrawalsData() {
 const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   
   const permission = await
    fetchingData(`users/employees-permissions?user=${session?.id}`)
   if(!permission?.employeesWithdrawalsDataDisplay){
    redirect('/authrization')
   }
   const data = await fetchingData(`employees/withdrawals`,
   )

  return (
    <EmployeesWithdrawlsData data={data} permission={permission} />
  )
}
