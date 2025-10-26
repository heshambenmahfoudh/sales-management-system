'use client'
import { loginUser } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import TextInput from '../FormInput/TextInput'
import SubmitButton from '../FormInput/SubmitButton'
import { useStateContext } from '@/contexts/ContextProvider'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import CustomCarousel from '../CustomCarousel'

export default function LoginForm() {
  const { isLoading, setIsLoading } = useStateContext()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const router = useRouter()
const query = useQueryClient()
  async function onSubmit(data) {
    try {
      setIsLoading(true)
      const response = await loginUser(data)
      if (response.status === 200) {
        router.push('/')
         query.invalidateQueries({ queryKey: ['userPermission'] })
         query.invalidateQueries({ queryKey: ['invoiceData'] })
        setIsLoading(false)
        reset()
        toast.success('Login User Successfully')
      } else {
        setIsLoading(false)
        toast.error(response.error)
      }
    } catch (error) {
      setIsLoading(false) }
  }
  return (
    <div className="relative w-full lg:grid h-screen lg:grid-cols-2 bg-gray-200">
      <div className="flex items-center gap-2 absolute left-3 top-3 ">
        <div
          className=" rounded-full
            w-[45px] h-[45px] p-0.5 bg-white shadow-md border-1 border-blue-200   "
        >
          <Image
            src="/images/logosales.jpg"
            alt="logo"
            className="rounded-md"
            width={100}
            height={100}
          />
        </div>
        <h2 className="text-[18px] font-medium">Sales System</h2>
      </div>
      <div className="flex items-center justify-center h-[90vh] mx-3 md:h-screen py-16">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">
              Login User
            </h1>
            <p className="text-balance text-muted-foreground underline">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="grid grid-cols-1 gap-y-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Email Address"
              register={register}
              name="email"
              type="email"
              errors={errors}
              placeholder="Eg. heshan@gmail.com"
            />
            <TextInput
              label="Password"
              register={register}
              page="login"
              name="password"
              type="password"
              errors={errors}
              placeholder="******"
            />
            <SubmitButton
              title="Login in your account"
              isLoading={isLoading}
              loadingTitle="Logging you please wait..."
              />
          </form>
        </div>
      </div>
      <div className="hidden  lg:block">
        <CustomCarousel
        />
      </div>
    </div>
  )
}
