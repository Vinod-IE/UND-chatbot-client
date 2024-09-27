import React, { useContext, useEffect, useState } from 'react'
import './settings.css'
import Tabs from '../../components/tabs/tabs'
import Contentmanagement from './contentmanagement/contentmanagement'
import Matadatamanagement from './metadatamanagement/metadatamanagement'
import Usermanagement from './usermanagement/usermanagement'
import { PageHeader } from '../../layouts/header/page-header'
import VersionNotes from './releasenotes/releasenotes'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
const SettingsV1 = (props:any) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [tableitems, settableitems] = useState<any>()
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  useEffect(() => {
    setMultiplePopup()
    document.title='Settings'
  }, [activeTab])
  useEffect(() => {
    settableitems([
      {
        tabtitle: 'CONTENT MANAGEMENT',
        is_active: activeTab === 0,
        content: (<Contentmanagement setRefresh={props?.setRefresh} refresh={props?.refresh}/>)
      },
      {
        tabtitle: 'METADATA MANAGEMENT',
        is_active: activeTab === 1,
        content: (<Matadatamanagement />)
      },
      {
        tabtitle: 'USER MANAGEMENT',
        is_active: activeTab === 2,
        content: (<Usermanagement />)
      },
      {
        tabtitle: 'RELEASE NOTES',
        is_active: activeTab === 3,
        content: (<VersionNotes />)
      },
      {
        tabtitle: 'PASCODE CONFIGURATION',
        is_active: activeTab === 4,
        content: 'content here'
        //   content: (<><Listthree /></>)
      }
    ])
  }, [])

  return (
        <>
            <PageHeader name='Settings'
              icon="icon-settings"
            />
            <div className='container px-0'>
                <div className='row m-0'>
                <Tabs setActiveTab={(index: any) => { setActiveTab(index) }} items={tableitems} tabsul="overflow-auto" className="latobold darktext mb-2 shadow card cards-lg px-2 pt-2 border3" anchorclass="segoeui-semibold font-14" />
                </div>
            </div>
        </>
  )
}
export default SettingsV1
