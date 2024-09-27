/* eslint-disable camelcase */
/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect, useContext } from 'react'
import ActionButtons from '../buttons/actionbutton'
import Noresult from '../noresult/noresult'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
let popupTop: number
let xpositionvalue: number
let offsetLeftValue: number
let offsetTopValue: number
let elementHeightValue: number
let offsetWidthValue: number
export default function Profile() {
  /** *** Responsive Popup Code Start*****/
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const profile = useRef<any>(null)
  const popupbtnRef = useRef<any>(null)
  const [xpositionvalueupdate, setpopupwidthupdate] = useState<number>()
  const [popupheight, setpopupheight] = useState<number>()
  const [showActionPopups, setShowActionPopups] = useState({
    profile: false
  })
  const initialValues = ['profile']
  const [btnActionshowhide, setActionbtnshowhide] = useState({
    profile: false
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
    <div className="Profile d-flex align-items-center h-100 p-2">
        <ActionButtons
          label="Profile"
          name='MK'
          className={multiplePopup === 'profile' ? 'btn-xs title-color16 p-0 whitebg p-1 font-14 border-radius4 p-relative' : 'btn-xs font-14 title-color16 whitebg p-1 border-radius4 p-0 p-relative'}
          isClick='profile'
          type="button"
          ref={profile}
          popupCloseOpenFunctionality={popupCloseOpenFunctionality}
          showhide={showActionPopups.profile}
        />
      {multiplePopup === 'profile' &&
        <div className='popup popup-sm p-relative' ref={popupbtnRef} style={{ top: popupTop + 6, position: 'absolute', overflow: 'auto', left: xpositionvalueupdate, maxHeight: popupheight }}>
        <div className='min-h-100 d-flex align-items-center justify-content-around'>
          <Noresult />
        </div>
      </div>
    }
    </div>
  )
}
