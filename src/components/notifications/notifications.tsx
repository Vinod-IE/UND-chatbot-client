/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import React, { useState, useRef, useEffect, useContext } from 'react'
import ActionButtons from '../buttons/actionbutton'
import InputSelect from '../../utils/controls/input-select'
import Notificationtabcontent from './notification-items'
import './notifications.css'
import Tabs from '../tabs/tabs'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
let popupTop : number
let xpositionvalue : any
let offsetLeftValue : number
let offsetTopValue : number
let elementHeightValue : number
let offsetWidthValue : number
export default function Notifications () {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [notification_items, setnotification_items] = useState<any>()
  useEffect(() => {
    setnotification_items([
      {
        tabtitle: 'All (08)',
        is_active: activeTab === 0,
        content: (<><Notificationtabcontent tabId={'all'} /></>)
      },
      {
        tabtitle: 'Actions (02)',
        is_active: activeTab === 1,
        content: (<><Notificationtabcontent tabId={'actions'} /></>)
      },
      {
        tabtitle: 'Notifications (06)',
        is_active: activeTab === 2,
        content: (<><Notificationtabcontent tabId={'notifications'} /></>)
      }
    ])
  }, [])
  /** *** Responsive Popup Code Start*****/
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const notification = useRef<any>(null)
  const popupbtnRef = useRef<any>(null)
  const [xpositionvalueupdate, setpopupwidthupdate] = useState('')
  const [popupheight, setpopupheight] = useState<number>()
  const [showActionPopups, setShowActionPopups] = useState({
    notification: false
  })
  const [btnActionshowhide, setActionbtnshowhide] = useState({
    notification: false
  })
  useEffect(() => {
    setpopupheight(window.innerHeight - (offsetTopValue + 90))
    const popupwidthdata = popupbtnRef.current ? popupbtnRef.current.offsetWidth : 0
    // setpopupwidth(popupwidthdata)
    if (popupwidthdata < xpositionvalue) {
      xpositionvalue = xpositionvalue - popupwidthdata
      setpopupwidthupdate(xpositionvalue)
    } else if (popupwidthdata > offsetLeftValue && popupwidthdata < (window.innerWidth - (offsetLeftValue + offsetWidthValue))) {
      xpositionvalue = offsetLeftValue
      setpopupwidthupdate(xpositionvalue)
    } else if (popupwidthdata > offsetLeftValue && popupwidthdata > (window.innerWidth - (offsetLeftValue + offsetWidthValue))) {
      xpositionvalue = 0
      setpopupwidthupdate(xpositionvalue)
    }
  }, [multiplePopup])
  const showhide = { ...btnActionshowhide }
  function popupCloseOpenFunctionality (type:any, value:number, top:number, xposition:number, left:number, elementHeight:number, offsetWidth:number) {
    popupTop = top
    xpositionvalue = xposition
    offsetLeftValue = left
    offsetTopValue = top
    elementHeightValue = elementHeight
    offsetWidthValue = offsetWidth
    showhide.notification = false
    setActionbtnshowhide(showhide)
    if (type === multiplePopup) {
      setMultiplePopup()
    } else if (type) {
      setMultiplePopup(type)
    }
  }
  return (
            <div className="notification  d-flex align-items-center h-100  p-2 ms-auto ">
                <ActionButtons
                    label="Notifications"
                    name=''
                    className={multiplePopup === 'notification' ? 'btn-sm p-0 p-relative popup-arrow' : 'btn-sm p-0 p-relative'}
                    icon="icon-notification font-20 whitetext bold"
                    isClick='notification'
                    type="button"
                    badge="badge bgcolor-primary border-radius3 px-1 font-0 whitetext"
                    ref={notification}
                    popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                    showhide={showActionPopups.notification}
                />
                {multiplePopup === 'notification'
                  ? <div className='popup' ref={popupbtnRef} style={{ top: popupTop + 8, position: 'absolute', overflow: 'auto', left: xpositionvalueupdate, maxHeight: popupheight }}>
                        <div className="d-flex w-100 p-relative align-items-center border-bottom1 pb-1">
                            <h2 tabIndex={0} aria-label="Alerts" className="d-flex align-items-center font-16">
                                <span className="icon-bell font-16 pe-1"></span> Alerts
                            </h2>
                            <div className='close'>
                                <ActionButtons
                                    label="Cancel"
                                    name=""
                                    className='btn-bgcolor6 whitetext p-0 btn btn-sm font-0 btn-border-radius3 text-uppercase'
                                    icon="icon-close font-8 p-1 "
                                    type="button"
                                    isClick='notification'
                                    ref={notification}
                                    popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                                    showhide={showActionPopups.notification} />
                            </div>
                        </div>
                        <div>
                            <Tabs
                            setActiveTab={(index: any) => { setActiveTab(index) }}
                            items={notification_items} contentstyles="pe-1" anchorclass="segoeui-semibold font-14" className="latobold darktext" tablistclassName="font-13" />
                        </div>

                    </div>
                  : ''}
            </div>
  )
}
