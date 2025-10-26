import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import SpendablesData from "@/components/DataList/SpendablesData"
import { redirect } from "next/navigation"


export default async function Spendables() {
  const session = await getServerUser()
  if (!session) {
   redirect('/login')
  }
  const permission = await 
  fetchingData(`users/spendables-permissions?user=${session?.id}`)
  if(!permission?.spendablesDataDisplay){
  redirect('/authrization')
  }
  const data = await fetchingData(`spendables`)
 
  return (
    <SpendablesData data={data} permission={permission} />
  )
}
