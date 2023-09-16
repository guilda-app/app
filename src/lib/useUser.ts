"use client";

import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr';

export default function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const { data: user } = useSWR<{
    id: string,
    isLoggedIn: boolean
  }>('/api/user')
  if (!user) return

  if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
  ) {
      Router.push(redirectTo)
  }

  console.log(user)
  return { user }
}