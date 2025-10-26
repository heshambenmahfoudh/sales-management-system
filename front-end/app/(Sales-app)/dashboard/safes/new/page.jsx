import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SafeForm from '@/components/Forms/SafeForm'
import { redirect } from 'next/navigation'

export default async function NewSafe() {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/safes-permissions?user=${session?.id}`)
  if(!permission?.safesDataCreate){
  redirect('/authrization')
   }
  return <SafeForm />
}
