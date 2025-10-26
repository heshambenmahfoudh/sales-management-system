import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import SpendableForm from '@/components/Forms/SpendableForm'
import { redirect } from 'next/navigation'

export default async function NewSpendable() {
   const session = await getServerUser()
    if (!session) {
      redirect('/login')
    }

    const permission = await
     fetchingData(`users/spendables-permissions?user=${session?.id}`)
    if(!permission?.spendablesDataCreate){
      redirect('/authrization')
    }
  return <SpendableForm />
}
