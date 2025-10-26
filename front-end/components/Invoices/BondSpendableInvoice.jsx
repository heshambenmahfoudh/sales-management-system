'use client';
import { useRef } from 'react';
import InvoiceButton from './InvoiceButton';
import InvoiceHeader from './InvoiceHeader';
import InvoiceFooter from './InvoiceFooter';

export default function BondSpendableInvoice ({data ,id}) {
const referance = useRef()

  return (
      <div >
        <InvoiceButton data={data} referance={referance} />
      <div className="overflow-auto mx-3">
        <div ref={referance} className="overflow-x-auto bg-white min-w-fit 
           p-8 rounded-lg shadow-lg shadow-blue-400 print:shadow-none">
          <InvoiceHeader />
          <div className="mt-5 print:mt-0 mb-7   flex items-center gap-2">
            <h2 className="text-15 font-medium">Name :</h2>
            <p className="text-gray-700 font-medium capitalize">
              {data?.spendableTo}
            </p>
          </div>
          <div className='flex justify-between items-center gap-4 mt-3 print:mt-0 mb-5'>
            <article className='border-1  border-gray-200 p-2 w-full text-center
             bg-gray-50  rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>INVOICE DATE</h2>
              <h1 className='font-medium'>{data?.date?.slice(0,10)}</h1>
            </article>
            <article className='border-1  border-gray-200 p-2 w-full text-center bg-gray-50  rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>BOND SPENDABLE INVOICE</h2>
              <h1 className='font-medium'>{id}</h1>
            </article>
            <article className='border-1  border-gray-200 p-2 w-full text-center bg-gray-50 rounded-md'>
              <h2 className='capitalize text-gray-500 font-medium'>STATUS</h2>
              <h1 className='font-medium'>PAID</h1>
            </article>
          </div>
          {/* START HEADER */}
          <div className=" m-auto text-sm    print:overflow-hidden">
            <table className="m-auto w-full ">
              <thead className="rounded-t-lg m-auto  
              w-full text-center sticky top-0">
                <tr
                      className="flex justify-between items-center
                    print:border-[0.5px] border-[0.5px] 
                   print:border-gray-400 border-gray-200 "
                >
                 

                  <th
                    scope="col"
                    className="font-medium print:capitalize capitalize
                      print:flex flex print:justify-center justify-center  
                                      print:items-center items-center
                                      py-2 px-2 print:px-2  text-center
                    print:h-[45px] h-[45px] print:font-medium 
                      print:min-w-[60px] min-w-[60px] print:text-[18px] text-[18px]"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="font-medium print:capitalize  capitalize
                    print:flex flex  print:justify-start justify-start
                                      print:items-center items-center  py-2 px-2 print:px-2 
                                        text-start 
                                      print:h-[45px] h-[45px] print:text-[15px] 
                                      print:font-medium  
                    print:flex-1 text-sm flex-1"
                  >
                    spendabel from
                  </th>
                  <th
                    scope="col"
                    className="font-medium print:capitalize  capitalize
                    print:flex flex  print:justify-start justify-start
                                      print:items-center items-center  py-2 px-2 print:px-2 
                                        text-start 
                                      print:h-[45px] h-[45px] print:text-[15px] 
                                      print:font-medium  
                    print:flex-1 text-sm flex-1"
                  >
                    spendabel to
                  </th>
                  <th
                    scope="col"
                  className="font-medium print:capitalize  capitalize
                    print:flex flex  print:justify-start justify-start
                                      print:items-center items-center  py-2 px-2 print:px-2 
                                        text-start 
                                      print:h-[45px] h-[45px] print:text-[15px] 
                                      print:font-medium  
                    print:w-[100px] text-sm w-[100px] "
                  >
                    mony
                  </th>
                  <th
                    scope="col"
                  className="font-medium print:capitalize  capitalize
                    print:flex flex  print:justify-start justify-start
                                      print:items-center items-center  py-2 px-2 print:px-2 
                                        text-start 
                                      print:h-[45px] h-[45px] print:text-[15px] 
                                      print:font-medium  
                    print:w-[100px] text-sm w-[100px] "
                  >
                    date
                  </th>
                </tr>
              </thead>
              <tbody className="m-auto">
                    <tr
                    className="flex justify-between items-center m-auto
                        print:border-x-[0.5px] border-x-[0.5px] print:border-b-[0.5px]
                         border-b-[0.5px]  
                      print:border-gray-400 border-gray-200"
                    >
                      <td
                    scope="col"
                    className="font-medium print:capitalize capitalize
                      print:flex flex print:justify-center justify-center  
                      print:items-center items-center py-2 px-2 print:px-2  text-center
                      print:h-[45px] h-[45px] print:text-[15px] print:font-medium 
                      print:min-w-[60px] min-w-[60px] text-sm"
                  >
                    1
                  </td>
                      <td
                        className="font-medium capitalize text-center 
                        print:h-[50px] h-[50px]  py-2 px-2 print:p-2 
                        print:text-[15px] text-[15px]
                                    print:flex flex print:justify-start justify-start print:items-center  items-center
                                    print:m-auto m-auto
                                      print:flex-1 flex-1"
                      >
                       {data?.spendableResponsible}
                      </td>
                      <td
                      className="font-medium capitalize text-center 
                        print:h-[50px] h-[50px]  py-2 px-2 print:p-2 
                        print:text-[15px] text-[15px]
                                    print:flex flex print:justify-start justify-start print:items-center  items-center
                                    print:m-auto m-auto
                                     print:flex-1 text-sm flex-1"
                      >
                     {data?.spendableResponsible}
                      </td>
                      <td
                      className="font-medium capitalize text-center 
                        print:h-[50px] h-[50px]  py-2 px-2 print:p-2 
                        print:text-[15px] text-[15px]
                                    print:flex flex print:justify-start justify-start print:items-center  items-center
                                    print:m-auto m-auto
                                      print:w-[100px] w-[100px]"
                      >
                        ${data?.mony}
                      </td>
                      <td
                      className="font-medium capitalize text-center 
                        print:h-[50px] h-[50px]  py-2 px-2 print:p-2 
                        print:text-[15px] text-[15px]
                                    print:flex flex print:justify-start justify-start print:items-center  items-center
                                    print:m-auto m-auto
                                      print:w-[100px] w-[100px]"
                      >
                        {data?.date?.slice(0,10)}
                      </td>
                      
                    </tr>
                 
              </tbody>
            </table>
          </div>
          <InvoiceFooter/>
        </div>
      </div>
      </div>
  );
};
