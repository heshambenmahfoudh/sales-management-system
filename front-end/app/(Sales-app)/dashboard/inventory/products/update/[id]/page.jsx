import ProductForm from '@/components/Forms/ProductForm'
import { fetchingData } from '@/actions/fetchingData'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'

export default async function UpdateProduct({ params }) {
const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.productsDataUpdate){
 redirect('/authrization')
  }
 const {id} = await params
  const data = await fetchingData(`products/find/${id}`)
  return <ProductForm isUpdate={id} initialData={data} />
}
