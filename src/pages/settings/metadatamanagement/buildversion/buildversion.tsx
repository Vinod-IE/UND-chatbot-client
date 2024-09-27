import React, { useEffect, useRef, useState } from 'react'
import { UPDATE_BUILD_VERSION } from '../../../../configuration'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { getAllSettings } from '../../../../store/settings/reducer'
import { useHistory } from 'react-router-dom'
import { db } from '../../../../localbase'
import Alert from '../../../../components/alert/alert'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
export const Buildversion = () => {
    const history = useHistory()
    const [showAlert,setShowAlert] =  useState(true)
    const [isCancel,setisCancel] =  useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const updateBuildVersionData = () =>{
        localStorage.clear()
        sessionStorage.clear()
        dispatch(getAllSettings({ name: '' })).then(()=>{
           db.delete().then(()=>{
                history.push('/')
                history.push('/settings')
            })
        })
        
    }
    const onRespondClick = (button : string) =>{
        if(button === 'Yes'){
            updateBuildVersionData()
            setShowAlert(false)
        }else{
            setShowAlert(false)
            setisCancel(true)
        }
    }

  return (
    <>
    {showAlert ?
        <Alert
        message={UPDATE_BUILD_VERSION} yes = 'Yes' cancel='No' className="alert-info"
        btn1iconclassNmae='icon-checked  font-12 pe-1'
        btn2iconclassNmae='icon-close  font-12 pe-1'
        btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
        btn2classNmae="btn-border-radius3 px-2 btn-bgcolor5 darktext segoeui-regular font-12 text-uppercase btn-xs" onClick={onRespondClick} /> 
        : !isCancel ? <PageOverlay/>  : ''
     } </>
  )
}
export default Buildversion
