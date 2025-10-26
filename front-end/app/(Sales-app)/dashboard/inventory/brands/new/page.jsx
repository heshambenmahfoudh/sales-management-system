
import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import BrandForm from '@/components/Forms/BrandForm'
import { redirect } from 'next/navigation'

export default async function NewBrand() {
  const session = await getServerUser()
    if (!session) {
    redirect('/login')
    }
    const permission = await 
    fetchingData(`users/inventory-permissions?user=${session?.id}`)
    if(!permission?.brandsDataCreate){
   redirect('/authrization')
    }
  return <BrandForm />
}
