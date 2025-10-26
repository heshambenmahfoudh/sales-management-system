import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import FixedHeader from '@/components/Headers/FixedHeader'
import ReturnPurchaseInvoice from '@/components/Invoices/ReturnPurchaseInvoice'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function InvoiceData({ params}) {
 const session = await getServerUser()
  if (!session) {
  redirect('/login')
  }
  const permission = await 
  fetchingData(`users/purchases-permissions?user=${session?.id}`)
  if(!permission?.purchasesReturnViewInvoice){
 redirect('/authrization')
  }
  const {id} = await params
  const data = await fetchingData(
    `purchases/purchases-return/find/${id}`,
  )

  return (
    <div className="  min-h-screen bg-gray-100">
      <FixedHeader textValue="Purchases Return Invoice" numberData='1' isHidden={true} />
      <div className=" max-w-[58rem] mx-auto    py-4">
        <div className="flex justify-between items-center  mx-3">
          <Link
            href="/dashboard/purchases/return"
            className=" font-medium border-1 border-gray-100 p-2 flex items-center gap-2 text-20 "
          >
            <ArrowLeft className="w-[14px]" />
             Go Back
          </Link>
        </div>
        <ReturnPurchaseInvoice
          data={data}
          id={id}
        />
      </div>
    </div>
  )
}
