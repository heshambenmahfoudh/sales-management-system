import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import PulledmonyForm from '@/components/Forms/PulledmonyForm'
import { redirect } from 'next/navigation'

export default async function NewPulledMony() {
   const session =await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await 
    fetchingData(`users/safes-permissions?user=${session?.id}`)
    if(!permission?.safesPulledCreate){
   redirect('/authrization')
     }
  return <PulledmonyForm />
}
