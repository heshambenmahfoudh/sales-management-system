import { getServerUser } from "@/actions/auth";
import { fetchingData } from "@/actions/fetchingData";
import PurchaseForm from "@/components/Forms/PurchaseForm";
import { redirect } from "next/navigation";

export default async function NewPurchase() {
   const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = await
    fetchingData(`users/purchases-permissions?user=${session?.id}`)
   if(!permission?.purchasesDataCreate){
   redirect('/authrization')
    }
  return <PurchaseForm />
}
