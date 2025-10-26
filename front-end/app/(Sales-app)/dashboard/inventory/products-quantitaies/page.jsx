import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import ProductsQtyData from '@/components/DataList/ProductsQtyData'
import { redirect } from 'next/navigation'


export default async function ProductsQuantitiesData() {
const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/inventory-permissions?user=${session?.id}`)
 if(!permission?.productsQuantitaesDataDisplay){
 redirect('/authrization')
 }
 const data = await fetchingData(`products/products-quantities`)

  return (< ProductsQtyData data={data} permission={permission}/>)
}
