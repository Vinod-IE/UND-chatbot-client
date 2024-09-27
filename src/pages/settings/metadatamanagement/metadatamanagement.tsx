/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import Vtabs from '../../../components/tabs/vtabs'
import FormTooltip from './form-tooltip/form-tooltip'
import Sitefeedback from './site-feedback/site-feedback'
import SiteFeedbackAbout from './site-feedback-about/site-feedback-about'
import Buildversion from './buildversion/buildversion'
const Matadatamanagement = () => {
  const tableitems = [
    {
      tabtitle: 'Form Tooltips',
      is_active: 'true',
      icon: 'icon-info circled-icon font-13 me-1 color-primary',
      content: (<><FormTooltip/></>)
    },
    {
      tabtitle: 'Site Feedback',
      is_active: 'false',
      icon: 'icon-feedback circled-icon font-13 me-1 color-primary',
      content: (<><Sitefeedback/></>)
    },
    {
      tabtitle: 'Site Feedback About',
      is_active: 'false',
      icon: 'icon-feedback circled-icon font-13 me-1 color-primary',
      content: (<><SiteFeedbackAbout/></>),
    },
    {
      tabtitle: 'Update Build Version',
      is_active: 'false',
      icon: 'icon-checklist circled-icon font-13 me-1 color-primary',
      content: (<><Buildversion/></>)
    }
  ]
  const arrayLength = tableitems.length
  const tabsminheight = (arrayLength) * 44
  const [tabsContentHeight, setTabsContentHeight] = useState<number>(0)
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
        <div className='  mt-0 p-0 '>
        <Vtabs items={tableitems} className=" h-100" mainTabsclass="v-tabs p-relative h-100" tablistclassName="borderui w-100 "  vtabscontentclassName="w-100   " anchorclass="title-color13 font-13 segoeui-semibold" tabsul='min-w-200 max-w-200  overflow-auto bordered border-radius0 whitebg p-1 mt-4' />
          </div>
        </div>
      </div>
  )
}
export default Matadatamanagement
