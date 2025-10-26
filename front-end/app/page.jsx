import { getServerUser } from "@/actions/auth"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import NavbarLayout from "@/components/NavbarLayout"
import { redirect } from "next/navigation"


export default async function Home() {
const session = await getServerUser()
if(!session){
  redirect('/login')
}
  return (
    <div>
      <NavbarLayout session={session} />
      <Hero />
      <Footer />
    </div>
  )
}
