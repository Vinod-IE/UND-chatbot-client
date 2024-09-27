import React, { useContext, useEffect, useState } from 'react'
import './pii.css'
import Tabs from '../../components/tabs/tabs'
import PiiScan from './scan/pii-scan'
import PiiAuditlog from './auditlog/auditlog'
import PiiConfiguration from './configuration/pii-configuration'
import { PopupCloseContext } from '../../shared/contexts/popupclose-context'
export default function Pii () {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [tableitems, settableitems] = useState<any>()
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
useEffect(() => {
  setMultiplePopup()
},[activeTab])
  useEffect(() => {
    settableitems([
      // We are using later this tab section
      // {
      //   tabtitle: 'Scan',
      //   icon: 'icon-pii-scan',
      //   is_active: 'true',
      //   content: (<PiiScan />)
      // },
      {
        tabtitle: 'Configuration',
        icon: 'icon-pii-configuration',
        is_active: activeTab === 0,
        content: (<PiiConfiguration />)
      },
      {
        tabtitle: 'Audit Log',
        icon: 'icon-pii-auditlog',
        is_active: activeTab === 1,
        content: (<PiiAuditlog />)
      }
    ])
  }, [])
  return (
    <Tabs setActiveTab={(index: any) => { setActiveTab(index) }} items={tableitems} className="segoeui-regular whitebg shadow1 lg darktext " pagetitleicon="icon-threepersons color-primary pe-1" pagetitle="PII" pagetitleClass="segoeui-semibold text-color7 font18 align-items-center" tabsul="px-3 align-items-center" anchorclass="segoeui-semibold title-border darktext mb-0 font-13" tablistclassName="overflow-auto ms-auto" />
  )
}
