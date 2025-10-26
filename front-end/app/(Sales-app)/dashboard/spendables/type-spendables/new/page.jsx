import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import TypespendableForm from '@/components/Forms/TypespendableForm'
import { redirect } from 'next/navigation'
export default async function NewTypeSpendables() {
   const session = await getServerUser()
    if (!session) {
    redirect('/login')
    }
   const permission = await 
   fetchingData(`users/spendables-permissions?user=${session?.id}`)
   if(!permission?.typeSpendablesDataCreate){
    redirect('/authrization')
   }
  return <TypespendableForm />
}
