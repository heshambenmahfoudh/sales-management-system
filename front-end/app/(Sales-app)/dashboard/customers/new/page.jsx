import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CustomerForm from '@/components/Forms/CustomerForm'
import { redirect } from 'next/navigation'

export default async function NewCustomer() {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await
   fetchingData(`users/customers-permissions?user=${session?.id}`)
  if(!permission?.customersDataCreate){
   redirect('/authrization')
  }
  return <CustomerForm />
}
