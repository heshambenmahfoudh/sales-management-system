import { getServerUser } from "@/actions/auth";
import { fetchingData } from "@/actions/fetchingData";
import SalereturnForm from "@/components/Forms/SalereturnForm";
import { redirect } from "next/navigation";

export default async function NewReturnSale() {
  const session = await getServerUser()
     if (!session) {
     redirect('/login')
     }
     const permission = await
      fetchingData(`users/sales-permissions?user=${session?.id}`)
     if(!permission?.salesReturnCreate){
  redirect('/authrization')
      }
  return <SalereturnForm />
}
