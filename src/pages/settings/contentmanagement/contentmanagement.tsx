/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef, useContext } from 'react'
import Vtabs from '../../../components/tabs/vtabs'
import Announcements from './announcements/announcements'
import Calendar from './calendar'
import Knoledgegraph from './knowledgegraph/knowledgegraph'
import Settingspoc from './settins-poc/settings-poc'
import Settingsquicklinks from './quicklinks/quicklinks'
import SettingsPMG from './settings-pmg/settings-pmg'
import SettingsQA from './settings-qa/settings-qa'
import ClassificationBanner from '../classificationbanner/classificationbanner'
import Banner from './banner/banner'
import SettingsLogo from './logo/logo'
import { PopupCloseContext, UserInitalValue } from '../../../shared/contexts/popupclose-context'
const Contentmanagement = (props: any) => {
  const tableitems = [
    {
      tabtitle: 'Announcements',
      is_active: 'true',
      icon: 'icon-announcements circled-icon font-13 me-1 color-primary',
      content: (<Announcements />)
    },
    {
      tabtitle: 'Banner',
      is_active: 'false',
      icon: 'icon-noun-web circled-icon font-14 me-1 color-primary',
      content: (<Banner setRefresh={props?.setRefresh} refresh={props?.refresh}/>)
    },
    {
      tabtitle: 'Calendar',
      is_active: 'false',
      icon: 'icon-calendar circled-icon font-13 me-1 color-primary',
      content: (<Calendar />)
    },
    {
      tabtitle: 'Classification Banner',
      is_active: 'false',
      icon: 'icon-noun-web circled-icon font-14 me-1 color-primary',
      content: (<ClassificationBanner />)
    },
    {
      tabtitle: 'Knowledge Graph',
      is_active: 'false',
      icon: 'icon-knowledge-graph circled-icon font-14 me-1 color-primary',
      content: (<Knoledgegraph />)
    },
    {
      tabtitle: 'Logo',
      is_active: 'false',
      icon: 'icon-logo-change circled-icon font-14 me-1 color-primary',
      content: (<SettingsLogo />)
    },
    {
      tabtitle: 'Points of Contact',
      is_active: 'false',
      icon: 'icon-poc circled-icon font-13 me-1 color-primary',
      content: (<Settingspoc />)
    },
    {
      tabtitle: 'Policy Memos & Guidelines',
      is_active: 'false',
      icon: 'icon-pmg circled-icon font-13 me-1 color-primary',
      content: (<SettingsPMG />)
    },
    {
      tabtitle: 'Quick Links',
      is_active: 'false',
      icon: 'icon-quicklinks2 circled-icon font-13 me-1 color-primary',
      content: (<Settingsquicklinks />)
    },
    {
      tabtitle: 'Q&A',
      is_active: 'false',
      icon: 'icon-question circled-icon font-13 me-1 color-primary',
      content: (<SettingsQA />)
    },
    
  ]
  const arrayLength = tableitems.length
  const tabsminheight = (arrayLength) * 44
  const [tabsContentHeight, setTabsContentHeight] = useState<number>(0)
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  window.addEventListener('resize', handleWindowResize)
  useEffect(() => {
    // Get header height based on attribute or tag
    handleWindowResize()
  }, [])
  function handleWindowResize() {
      const tabsminheight:any = (tableitems.length) * 44
      setTabsContentHeight(tabsminheight)
  }
  useEffect(() => {
    // Update CSS variable when headerHeight changes
    document.documentElement.style.setProperty('--tabsconentmin-height', `${tabsContentHeight}px`)
  }, [tabsContentHeight])
  return (
      <div className='container p-0'>
        <div className='row m-0'>
        <div className=' borderui1 p-2  border-radius0' >
        <Vtabs items={tableitems} className=" h-100" mainTabsclass="v-tabs p-relative h-100" tablistclassName="borderui w-100 "  vtabscontentclassName="w-100   " anchorclass="title-color13 font-13 segoeui-semibold" tabsul='min-w-200 max-w-200  overflow-auto bordered border-radius0 whitebg p-1 mt-4' />
          </div>
        </div>
      </div>
  )
}
export default Contentmanagement
