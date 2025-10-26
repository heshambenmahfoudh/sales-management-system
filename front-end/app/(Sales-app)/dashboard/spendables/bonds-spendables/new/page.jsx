import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import BondspendableForm from '@/components/Forms/BondspendableForm'
import { redirect } from 'next/navigation'

export default async function NewBondSpendable() {
   const session = await getServerUser()
    if (!session) {
     redirect('/login')
     }
    const permission = await 
    fetchingData(`users/spendables-permissions?user=${session?.id}`)
    if(!permission?.bondsSpendablesDataCreate){
    redirect('/authrization')
    }
  return <BondspendableForm />
}
