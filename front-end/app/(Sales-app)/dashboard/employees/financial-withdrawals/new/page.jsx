import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import WithdrawalsForm from '@/components/Forms/WithdrawlsForm'
import { redirect } from 'next/navigation'

export default async function NewWithdrawals() {
const session = await getServerUser()
 if (!session) {
  redirect('/login')
  }
  
  const permission = await fetchingData(`users/employees-permissions?user=${session?.id}`)
  if(!permission?.employeesWithdrawalsDataCreate){
  redirect('/authrization')
  }
  return <WithdrawalsForm />
}
