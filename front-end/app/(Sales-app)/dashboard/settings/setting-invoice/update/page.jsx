import { getServerUser } from "@/actions/auth";
import { fetchingData } from "@/actions/fetchingData";
import InvoiceForm from "@/components/Forms/InvoiceForm";
import { redirect } from "next/navigation";

export default async function NewSettingInvoice() {
  const session = await getServerUser()
  if (!session) {
   redirect('/login')
   }
  const permission = await
   fetchingData(`users/settings-permissions?user=${session?.id}`)
   if(!permission?.SettingInvoiceData){
     redirect('/authrization')
    }
    const data = await
     fetchingData("settings/setting-invoice")

  return (
    <InvoiceForm initialData={data}/>
  )
}
