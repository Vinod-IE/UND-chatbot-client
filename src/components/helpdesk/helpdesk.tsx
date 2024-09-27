/* eslint-disable camelcase */
/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect, useContext } from 'react'
import ActionButtons from '../buttons/actionbutton'
import { I_HelpDesk } from '../../shared/interfaces'
import { useGetHelpDesk } from '../../store/settings/hooks'
import Noresult from '../noresult/noresult'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
let popupTop: number
let xpositionvalue: number
let offsetLeftValue: number
let offsetTopValue: number
let elementHeightValue: number
let offsetWidthValue: number
export default function Helpdesk() {
  /** *** Responsive Popup Code Start*****/
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const helpdesk = useRef<any>(null)
  const popupbtnRef = useRef<any>(null)
  const [xpositionvalueupdate, setpopupwidthupdate] = useState<number>()
  const [popupheight, setpopupheight] = useState<number>()
  const [showActionPopups, setShowActionPopups] = useState({
    helpdesk: false
  })
  const initialValues = ['helpdesk']
  const [btnActionshowhide, setActionbtnshowhide] = useState({
    helpdesk: false
  })
  const helpdeskdata: Array<I_HelpDesk> = useGetHelpDesk()
  const [helpDeskItems, setHelpDeskItems] = useState<Array<I_HelpDesk>>([])
  useEffect(() => {
    setHelpDeskItems(helpdeskdata)
  }, [helpdeskdata])

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
  const showhide: any = { ...btnActionshowhide }
  function popupCloseOpenFunctionality(type: any, value: number, top: number, xposition: number, left: number, elementHeight: number, offsetWidth: number) {
    popupTop = top
    xpositionvalue = xposition
    offsetLeftValue = left
    offsetTopValue = top
    elementHeightValue = elementHeight
    offsetWidthValue = offsetWidth
    initialValues.forEach(element => {
      showhide[element] = false
    })
    setActionbtnshowhide(showhide)
    if (type === multiplePopup) {
      setMultiplePopup()
    } else if (type) {
      setMultiplePopup(type)
    }
    // if (type) {
    //   setActionbtnshowhide({ ...showhide, [type]: value })
    //   setShowActionPopups({ ...showhide, [type]: value })
    // }
  }
  return (
    <div className="help-desk d-flex align-items-center h-100  p-2">
        <ActionButtons
          label="Help Desk"
          name=''
          className={multiplePopup === 'helpdesk' ? 'btn-sm p-0 p-relative popup-arrow' : 'btn-sm p-0 p-relative'}
          icon="icon-question font-18 whitetext"
          isClick='helpdesk'
          type="button"
          ref={helpdesk}
          popupCloseOpenFunctionality={popupCloseOpenFunctionality}
          showhide={showActionPopups.helpdesk}
        />
      {multiplePopup === 'helpdesk'
        ? helpDeskItems.length > 0
          ? helpDeskItems.map((helpitems: any) =>
            <div className='popup popup-sm p-relative' ref={popupbtnRef} style={{ top: popupTop + 8, position: 'absolute', overflow: 'auto', left: xpositionvalueupdate, maxHeight: popupheight }} key={helpitems?.ID}>
              <div className="p-relative">
                <h3 tabIndex={0} aria-label="System Help Desk">System Help Desk</h3>
                <div className="pt-2 d-flex align-items-start" id="helpdesk-timings" tabIndex={0} aria-describedby="helpdesk-timings">
                  <div className="icon-timing me-1 mt-1 font-16"></div>
                  <div><p className="font-12 subtitle-color">Hours of operation:</p>
                    <p>{helpitems?.hoursOfOperation}</p></div>
                </div>
                <p className="d-flex align-items-center pt-2">
                  <span className="icon-mail me-1 font-16"></span>
                  <a title={helpitems?.EmailAddress} href={helpitems?.EmailAddress} className="links">{helpitems?.EmailAddress}</a>
                </p>
                <p className="d-flex align-items-center pt-2">
                  <span className="icon-phone me-1 font-16"></span>
                  <a title={helpitems?.PhoneNo} href={helpitems?.PhoneNo} >{helpitems?.PhoneNo}</a>
                </p>
                <div className='close'>
                  <ActionButtons
                    label="Cancel"
                    name=""
                    className='btn-bgcolor6 whitetext p-0 btn btn-sm font-0 btn-border-radius3 text-uppercase'
                    icon="icon-close font-8 p-1 "
                    type="button"
                    isClick='helpdesk'
                    ref={helpdesk}
                    popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                    showhide={showActionPopups.helpdesk} />
                </div>
              </div>
            </div>
          )
          : <div className='popup p-relative' ref={popupbtnRef} style={{ top: popupTop + 8, position: 'absolute', overflow: 'auto', left: xpositionvalueupdate, maxHeight: popupheight }}>
            <div className='min-h-200 d-flex align-items-center justify-content-around'>
              <Noresult />
            </div>
          </div>
        : ''}
    </div>
  )
}
