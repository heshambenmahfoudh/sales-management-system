import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import UnitForm from '@/components/Forms/UnitForm'
import { redirect } from 'next/navigation'
export default async function NewUnit() {
   const session = await getServerUser()
     if (!session) {
     redirect('/login')
     }
     const permission = await 
     fetchingData(`users/inventory-permissions?user=${session?.id}`)
     if(!permission?.unitsDataCreate){
    redirect('/authrization')
     }
  return <UnitForm />
}
