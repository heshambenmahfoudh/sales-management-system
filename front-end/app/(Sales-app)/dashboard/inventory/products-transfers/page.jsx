import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import ProductsTransferData from "@/components/DataList/ProductsTransferData"
import { redirect } from "next/navigation"


export default async function ProductTransfers() {
 const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = 
   await fetchingData(`users/inventory-permissions?user=${session?.id}`)
   if(!permission?.productsTransfersDataDisplay){
 redirect('/authrization')
   }
  const data = await fetchingData(`products/transfer-products`)

  return (
    <ProductsTransferData data={data} permission={permission} />
  )
}
