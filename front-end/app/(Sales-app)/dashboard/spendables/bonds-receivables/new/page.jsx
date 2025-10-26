// import { getServerUser } from '@/actions/auth'
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import BondrecivableForm from '@/components/Forms/BondrecivableForm'
import { redirect } from 'next/navigation'

export default async  function NewBondReceivable() {
   const session = await getServerUser()
      if (!session) {
       redirect('/login')
       }
      const permission = await 
      fetchingData(`users/spendables-permissions?user=${session?.id}`)
      if(!permission?.bondsReceivablesDataCreate){
        redirect('/authrization')
      }
  return <BondrecivableForm />
}
