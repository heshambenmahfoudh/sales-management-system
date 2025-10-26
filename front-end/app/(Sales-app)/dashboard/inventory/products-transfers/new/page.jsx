import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import TransferproductForm from "@/components/Forms/TransferproductForm"
import { redirect } from "next/navigation"

export default async function NewProductTransfer() {
 const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await 
   fetchingData(`users/inventory-permissions?user=${session?.id}`)
   if(!permission?.productsTransfersDataCreate){
 redirect('/authrization')
   }

  return (
    <TransferproductForm/>
  )
}
