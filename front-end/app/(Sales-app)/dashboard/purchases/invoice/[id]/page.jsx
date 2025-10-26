import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import FixedHeader from '@/components/Headers/FixedHeader'
import PurchaseInvoice from '@/components/Invoices/PurchaseInvoice'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function InvoiceData({ params }) {
  const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/purchases-permissions?user=${session?.id}`)
  if(!permission?.purchasesDataViewInvoice){
  redirect('/authrization')
   }
   const {id} = await params
  const data = await fetchingData(
    `purchases/find/${id}`,
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <FixedHeader textValue="Purchase Invoice" numberData='1' isHidden={true} />
      <div className=" max-w-[58rem] mx-auto    py-7 ">
        <div className="flex justify-between items-center  mx-3">
          <Link
            href="/dashboard/purchases"
            className=" font-medium flex items-center gap-2 text-20 "
          >
            <ArrowLeft className="w-[14px]" />
             Go Back
          </Link>
         
        </div>
        <PurchaseInvoice data={data} id={id} />
      </div>
    </div>
  )
}
