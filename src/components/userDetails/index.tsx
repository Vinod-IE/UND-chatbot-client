import React from 'react'
import { useQuery } from 'react-query'
import { sp } from '@pnp/sp'
import '@pnp/sp/fields'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/views'
import '@pnp/sp/webs'
import '@pnp/sp/site-users/web'
export const UserDetails = () => {
  useQuery({
    queryKey: ['userLoginDetails'],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
    cacheTime: Infinity
  })
  return (
    <></>
  )
}
