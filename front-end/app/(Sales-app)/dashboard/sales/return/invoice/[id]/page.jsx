import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import FixedHeader from '@/components/Headers/FixedHeader'
import ReturnSaleInvoice from '@/components/Invoices/ReturnSaleInvoice'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function InvoiceData({ params }) {
 const session = await getServerUser()
 if (!session) {
 redirect('/login')
 }
 const permission = await 
 fetchingData(`users/sales-permissions?user=${session?.id}`)
 if(!permission?.salesReturnViewInvoice){
  redirect('/authrization')
  }
  const {id} = await params
  const data = await fetchingData(`sales/sales-return/find/${id}`,
    
  )

  return (
    // px-32
    <div className="  min-h-screen bg-gray-100    ">
      <FixedHeader textValue="Sales Return Invoice" numberData='1' isHidden={true} />
      <div className=" max-w-[58rem] mx-auto    py-7 ">
        <div className="flex justify-between items-center  mx-3">
          <Link
            href="/dashboard/sales/return"
            className=" font-medium flex items-center gap-2 text-20 "
          >
            <ArrowLeft className="w-[14px]" />
              Go Back
          </Link>
        </div>
        <ReturnSaleInvoice data={data} id={id} />
      </div>
    </div>
  )
}
