import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import ProductsDamagedData from '@/components/DataList/ProductsDamagedData'
import { redirect } from 'next/navigation'


export default async function ProductsDamaged() {
const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await
   fetchingData(`users/inventory-permissions?user=${session?.id}`)
  if(!permission?.productsDamagedDataDisplay){
 redirect('/authrization')
  }
  const data = await fetchingData( `products/damaged-products`,
  )

  return (
    <ProductsDamagedData data={data} permission={permission}/>
  )
}
