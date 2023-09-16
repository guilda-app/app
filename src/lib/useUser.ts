"use client";

import useSWR from 'swr';

export default async function useUser(
  redirectHandle = () => {},
) {
  const { id } = useSWR('/api/user', { method: 'GET' });

  if (!id) {
    redirectHandle();
  }

  return { user: id }
}