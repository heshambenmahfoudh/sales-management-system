import React from 'react'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/actions/auth'
import LoginForm from '@/components/Auth/LoginForm'

export default async function UserLogin() {
  const session = await getServerUser()
  if (session ) {
     redirect('/')
  }
  return (<LoginForm/>)
}
