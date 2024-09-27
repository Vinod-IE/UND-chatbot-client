import React from 'react'
import { useQuery } from 'react-query'
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'
import '@pnp/sp/site-users/web'
import '@pnp/sp/site-groups'
import { loadPageContext } from 'sp-rest-proxy/dist/utils/env'

export const RoleDetails = () => {
  useQuery({
    queryKey: ['userLoginRoles'],
    queryFn: getRoles,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
    cacheTime: Infinity
  })

  async function getRoles() {
    await loadPageContext()
    const pageContext = (window as Window)._spPageContextInfo
    const groups = await sp.web.getUserById(_spPageContextInfo.userId).groups()
    const RoleDetails: { roleName: any; ownerRoleName: any }[] = []
    groups.forEach((i: any) => {
      RoleDetails.push({
        roleName: i?.Title,
        ownerRoleName: i?.OwnerTitle
      })
    })
    return RoleDetails
  }

  return (
    <></>
  )
}
