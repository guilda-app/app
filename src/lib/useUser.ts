"use client";

import useSWR from 'swr';

export default async function useUser(
  redirectHandle = () => {},
  redirectIfFound: boolean = false
) {
  const { id } = useSWR('/api/user', { method: 'GET' });

  if ((id && redirectIfFound) || (!id && !redirectIfFound)) {
    redirectHandle();
  }

  return { user: id }
}