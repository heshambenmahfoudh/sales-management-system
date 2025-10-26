import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import DepositemonyForm from '@/components/Forms/DepositemonyForm'
import { redirect } from 'next/navigation'

export default async function NewDepositeMony() {
 const session =await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await
    fetchingData(`users/safes-permissions?user=${session?.id}`)
   if(!permission?.safesDepositsCreate){
 redirect('/authrization')
    }
  return <DepositemonyForm />
}
