/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import Routers from './routers/router'
import { AppDispatch } from './store'
import { useDispatch } from 'react-redux'
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query'
import { getAllSettings } from './store/settings/reducer'
import {
  getAllMasterData
} from './store/master/reducer'
import { UserDetails } from './components/userDetails'
import { RoleDetails } from './components/roledetails'
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'
import '@pnp/sp/site-users/web'
import '@pnp/sp/site-groups'
import { FullControlUserGroups } from './configuration'
import { fetchCommonMetadata } from './api/settings'

const queryClient = new QueryClient()
function App () {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    fetchCommonMetadata()
    dispatch(getAllSettings({ name: '' }))
    dispatch(getAllMasterData())
  }, [dispatch])

  if(window.location.hostname !== 'localhost') SP.SOD.executeFunc('SP.js', 'SP.ClientContext', fnshowhidemenu)
  async function fnshowhidemenu () {
    $('#HeaderButtonRegion,#O365_MainLink_Settings,#O365_MainLink_Bell_Container,#O365_MainLink_Settings_container').attr('style', 'display: none !important')
    const roles : any = []
    // const groups : any = await sp.web.getUserById(_spPageContextInfo.userId).groups()
    // roles = Array.from(new Set(groups?.map((v:any) => v.Title)))
    setTimeout(function () {
      $('#O365_MainLink_Settings,#O365_MainLink_Bell_Container').attr('style', 'display: none !important')
      if (roles.some((r: any) => FullControlUserGroups.includes(r))) {
        $('#O365_MainLink_Settings,#O365_MainLink_Bell_Container').attr('style', 'display: block !important')
        $('#HeaderButtonRegion').attr('style', 'display: flex !important')
        $('#ribbonBox').attr('style', 'display: block !important')
      } else {
        $('#HeaderButtonRegion,#O365_MainLink_Settings,#O365_MainLink_Bell_Container').attr('style', 'display: none !important')
        $('#ribbonBox').attr('style', 'display: none !important')
        $('#s4-ribbonrow').css('height', 'auto')
      }
    }, 5000)
  }
  return (
      <QueryClientProvider client={queryClient}>
      <Routers />
      <UserDetails/>
      <RoleDetails/>
      </QueryClientProvider>
  )
}
export default App
