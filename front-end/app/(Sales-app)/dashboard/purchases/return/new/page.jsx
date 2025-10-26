import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import PurchasereturnForm from '@/components/Forms/PurchasereturnForm'
import { redirect } from 'next/navigation'
export default async function NewPurchaseReturn() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/purchases-permissions?user=${session?.id}`)
 if(!permission?.purchasesReturnCreate){
 redirect('/authrization')
 }
  return <PurchasereturnForm />
}
