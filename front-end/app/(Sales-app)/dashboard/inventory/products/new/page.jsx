import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import ProductForm from '@/components/Forms/ProductForm'
import { redirect } from 'next/navigation'

export default async function NewProduct() {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
 if(!permission?.productsDataDisplay){
  redirect('/authrization')
 }
  return <ProductForm />
}