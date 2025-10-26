import { getServerUser } from "@/actions/auth"
import { fetchingData } from "@/actions/fetchingData"
import ProductdamagedForm from "@/components/Forms/ProductdamagedForm"
import { redirect } from "next/navigation"


export default async function NewProductDamaged() {
  const session = await getServerUser()
    if (!session) {
       redirect('/login')
    }
    const permission = await 
       fetchingData(`users/inventory-permissions?user=${session?.id}`)
    if(!permission?.productsDamagedDataCreate){
       redirect('/authrization')
    }

  return ( <ProductdamagedForm/>)
}
