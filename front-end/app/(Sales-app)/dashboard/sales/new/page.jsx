import { getServerUser } from "@/actions/auth";
import { fetchingData } from "@/actions/fetchingData";
import SaleForm from "@/components/Forms/SaleForm";
import { redirect } from "next/navigation";

export default async function NewSale() {
  const session = await getServerUser()
    if (!session) {
    redirect('/login')
    }
      const permission = await 
      fetchingData(`users/sales-permissions?user=${session?.id}`)
      if(!permission?.salesDataCreate){
    redirect('/authrization')
      }
  return <SaleForm />
}
