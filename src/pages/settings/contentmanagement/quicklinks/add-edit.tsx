/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import { isUrlValid, pnpAdd, pnpUpdate, scrollToTop } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import CustomSelect from '../../../../utils/controls/custom-select'
import Alert from '../../../../components/alert/alert'
import { NO_CHANGE_MSG } from '../../../../configuration'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const AddeditView = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [checkingValidation, setCheckingValidation] = useState({ Name: false, URL: false,  ValidURL: false })
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [inputValues, setInputValues] = useState({
    Name: props?.details?.Title ? props?.details?.Title : '',
    URL: props?.details?.URL ? props?.details?.URL : '',
    Archived: props?.details?.IsArchived ? 'Yes' : 'No'
  })
  useEffect(() => {
    if(props?.showAddPopup || props?.showedit || props?.deleteItem) {
      setMultiplePopup()
    }
  }, [])
  const nameChange = (event: any) => {
    setInputValues({ ...inputValues, Name: event.target.value })
  }
  const urlChange = (event: any) => {
    setInputValues({ ...inputValues, URL: event.target.value })
  }
  const changeArchived = (event: any) => {
    setInputValues({ ...inputValues, Archived: event})
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const QuickLinksSubmit = (value: any) => {
    let isValid = true
    let isNoChangesDetected = true
    let checkName = true
    let checkURL = true
    let checkValidURL = true
    setCheckingValidation({ ...checkingValidation, Name: false, URL: false })
    if (value !== 'submit') {
      const archived = props?.details?.IsArchived ? 'Yes' : 'No'
      if (props?.details?.Title.trim() === inputValues.Name.trim() && props?.details?.URL === inputValues.URL && archived === inputValues?.Archived) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    if (isValid) {
      if (!inputValues.Name || !inputValues.Name.trim()) {
        isValid = false
        checkName = false
      }
      if (!inputValues.URL) {
        isValid = false
        checkURL = false
      } else if (!isUrlValid(inputValues.URL)) {
        isValid = false
        checkValidURL  = false
      }
    }
    setCheckingValidation({ ...checkingValidation, Name: !checkName, URL: !checkURL, ValidURL: !checkValidURL })
    if (isValid) {
      setLoading(true)
      const ObjectArray: any = {
        Title: inputValues?.Name,
        URL: inputValues?.URL,
        ItemModified: new Date(),
        ItemModifiedById: _spPageContextInfo.userId
      }
      if (value !== 'submit') {
        let archived = false
        if (inputValues.Archived === 'Yes') {
          archived = true
        }
        ObjectArray.IsArchived = archived
        ObjectArray.ID = value.Id
        pnpUpdate('QuickLinkList', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
          props?.cancel()
          setLoading(false)
        })
      } else {
        ObjectArray.ItemCreated = new Date()
        ObjectArray.ItemCreatedById = _spPageContextInfo.userId
        pnpAdd('QuickLinkList', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
          props?.filtersvalue(!props?.showAddPopup)
          setLoading(false)
        })
      }
    }
  }
  const SELECT_VALUE = ['Yes', 'No']



  return (
            <div >
            {loading
              ? <PageOverlay />
              : <div  className={props?.showAddPopup ? 'mx-2 border-radius whitebg border-primary p-2' : 'settingseditpopup w-100 position-relative border-top1 p-2'} id='scroll' >
                {props?.showAddPopup && <div className="py-2 border-bottom1 ">
                    <h4 tabIndex={0} aria-label="ADD QUICK LINK" className="m-0 p-0 d-inline-block font-15 montserratsemibold textcolor4 text-uppercase">
                    ADD QUICK LINKS
                    </h4>
                </div>}
                <div className="row">
                    <div className={props?.showAddPopup ? 'col-sm-12 col-md-6 mb-2' : 'col-sm-12 col-md-4 mb-2'} ref={props?.popupBodyRef}>
                        <InputText
                            inputProps={{
                              id: 'name ',
                              name: 'Name',
                              placeholder: 'Enter Name',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="Name"
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Name "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={nameChange}
                            error={checkingValidation?.Name}
                            value={inputValues.Name}
                        />
                    </div>
                    <div className={props?.showAddPopup ? 'col-sm-12 col-md-6 mb-2' : 'col-sm-12 col-md-4 mb-2'}>
                        <InputText
                            inputProps={{
                              id: ' url ',
                              name: 'URL',
                              placeholder: 'https://example.com',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="URL"
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="URL"
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={urlChange}
                            error={checkingValidation?.URL ? checkingValidation?.URL : checkingValidation?.ValidURL}
                            errorMsg={checkingValidation?.ValidURL ? 'Please enter Valid URL' : ''}
                            value={inputValues.URL}
                        />
                        <span className='font10 subtitle-color'>Hint: (http://example.com or https://example.com)</span>
                    </div>
                    {!props?.showAddPopup &&
                        <div className="col-sm-12 col-md-4 mb-2">
                <CustomSelect
                 inputProps={{
                  id:'IsArchived'
                }}
                  id='IsArchived '
                  value={[inputValues.Archived]}
                  label="Is Archived "
                  formClassName="form-vertical text-nowrap segoeui-regular"
                  className='form-lg w-100 customselect'
                  isInfo infoClassName="tool-tip tooltip-top" info='IsArchived ' infoIcon="icon-info"
                  isMandatory
                  options={SELECT_VALUE}
                  onChange={(e: any) => { changeArchived(e.value) }}
                  menuPosition="fixed"
                />
                        </div>
                    }
                </div>
                <div className="d-flex py-1 flex-wrap">
                    <div className="ms-auto settingsbtns d-flex">
                        {props?.showAddPopup &&
                            <>
                                <Buttons
                                    label="Save"
                                    className="border-radius py-1 px-2 btn-bgcolor9  ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-save font-11 pe-1"
                                    type="button"
                                    onClick={() => QuickLinksSubmit('submit')}
                                />
                                <Buttons
                                    label="Cancel"
                                    className="py-1 px-2 border-radius btn-border1 ms-2 montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-close color-primary font-9 pe-1"
                                    type="button"
                                    onClick={() => {
                                      props?.filtersvalue(!props?.showAddPopup)
                                    }}

                                /> </>}
                        {!props?.showAddPopup &&
                            <>
                                <Buttons
                                    label="Update"
                                    className="border-radius py-1 px-2 btn-primary ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-update font-11 pe-1"
                                    type="button"
                                    onClick={() => QuickLinksSubmit(props?.details)}
                                />
                                <Buttons
                                    label="Cancel"
                                    className="py-1 px-2 border-radius btn-border1  ms-2 montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-close color-primary font-9 pe-1"
                                    type="button"
                                    onClick={() => {
                                      props?.cancel()
                                    }}
                                /></>}
                                 {showAlert && (
                <Alert message={NO_CHANGE_MSG} yes='OK' cancel='Cancel' className="alert-info"
                  onClick={onClickAlert}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn2iconclassNmae='icon-close  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                  btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
      
                />
              )}
                    </div>
                </div>
            </div>}
            </div>
  )
}
export default AddeditView
