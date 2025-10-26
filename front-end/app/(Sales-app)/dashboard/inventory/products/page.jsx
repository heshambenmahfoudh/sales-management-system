import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import ProductsData from "@/components/DataList/ProductsData"
import { redirect } from "next/navigation"


export default async function Products() {
const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission =
   await fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.productsDataDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData(`products`,)
  return ( <ProductsData data={data} permission={permission} /> )
}
