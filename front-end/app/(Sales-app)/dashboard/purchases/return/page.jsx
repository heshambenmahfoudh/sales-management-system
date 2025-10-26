import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import PurchasesReturnData from "@/components/DataList/PurchasesReturnData"
import { redirect } from "next/navigation"

export default async function PurchasesReturn() {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/purchases-permissions?user=${session?.id}`)
  if(!permission?.purchasesReturnDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData(`purchases/purchases-return`,
  )

  return (
    <PurchasesReturnData   data={data} permission={permission} />
  )
}
