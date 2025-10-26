import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import ProductqtyForm from '@/components/Forms/ProductqtyForm'
import { redirect } from 'next/navigation'

export default async function NewProductQuantity() {
  const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await
    fetchingData(`users/inventory-permissions?user=${session?.id}`)
   if(!permission?.productsQuantitaesDataCreate){
  redirect('/authrization')
   }
  return <ProductqtyForm />
}
