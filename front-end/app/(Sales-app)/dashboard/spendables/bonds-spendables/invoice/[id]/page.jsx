import { getServerUser } from '@/actions/auth'
import { fetchingData } from '@/actions/fetchingData'
import FixedHeader from '@/components/Headers/FixedHeader'
import BondSpendableInvoice from '@/components/Invoices/BondSpendableInvoice'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function InvoiceData({ params }) {
   const user = await getServerUser()
     if (!user) {
      redirect('/login')
      }
     const permission = await 
     fetchingData(`users/spendables-permissions?user=${user?.id}`)
     if(!permission?.bondsSpendablesDataViewInvoice){
      redirect('/authrization')
     }
     const {id} = await params
  const data = await fetchingData(
    `spendables/bonds-spendables/find/${id}`,
  )
  


  return (
    <div className="min-h-screen bg-gray-100">
      <FixedHeader textValue="Bond Spendables Invoice" numberData='1' isHidden={true} />
      <div className=" max-w-[58rem] mx-auto    py-7 ">
        <div className="flex justify-between items-center  mx-3">
          <Link
            href="/dashboard/spendables/bonds-spendables"
            className=" font-medium flex items-center gap-2 text-20 "
          >
            <ArrowLeft className="w-[14px]" />
            Go Back
          </Link>
        </div>
        <BondSpendableInvoice
          data={data}
          id={id}
        />
      </div>
    </div>
  )
}
