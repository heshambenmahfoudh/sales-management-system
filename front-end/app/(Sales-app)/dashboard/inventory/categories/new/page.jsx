import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import CategoryForm from '@/components/Forms/CategoryForm'
import { redirect } from 'next/navigation'

export default async function NewCategry() {
  const session = await getServerUser()
   if (!session) {
   redirect('/login')
   }
   const permission = 
   await fetchingData(`users/inventory-permissions?user=${session?.id}`)
   if(!permission?.categoriesDataCreate){
 redirect('/authrization')
   }
  return <CategoryForm />
}
