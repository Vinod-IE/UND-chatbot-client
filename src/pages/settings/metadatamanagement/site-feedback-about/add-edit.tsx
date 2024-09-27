/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import { pnpAdd, pnpUpdate, scrollToTop } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import CustomSelect from '../../../../utils/controls/custom-select'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import Alert from '../../../../components/alert/alert'
import { NO_CHANGE_MSG } from '../../../../configuration'
const AddeditView = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showAlert, setShowAlert] = useState(false)
  const [checkingValidation, setCheckingValidation] = useState({ Title: false, TitleExists: false })
  const [inputValues, setInputValues] = useState({
    Title: props?.details?.Title ? props?.details?.Title : '',
    Archived: props?.details?.IsArchived ? 'Yes' : 'No'
  })
  const [loading, setLoading] = useState(false)
  if (props?.showAddPopup) {
    scrollToTop()
  }
  const nameChange = (event: any) => {
    setInputValues({ ...inputValues, Title: event.target.value })
  }
  const changeArchived = (event: any) => {
    setInputValues({ ...inputValues, Archived: event })
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const feedbackAboutSubmit = async (value: any) => {
    let isValid = true
    let checkName = true
    let nameExist = true
    let isNoChangesDetected = true
    if (value !== 'submit') {
      const archived = props?.details?.IsArchived ? 'Yes' : 'No'
      if (props?.details?.Title?.trim() === inputValues.Title.trim() && archived === inputValues?.Archived) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    if(isValid) {
      if (!inputValues.Title.trim()) {
        isValid = false
        checkName = false
      }
      if (value === 'submit' && inputValues.Title && props?.feedbackAboutItems?.some((item: any) => item?.Title?.trim()?.toLowerCase() === inputValues?.Title?.trim()?.toLowerCase())) {
        isValid = false
        nameExist = false
      }
      if (value !== 'submit' && inputValues.Title && (props?.feedbackAboutItems?.filter((item: any) => item?.Title?.trim() !== props?.details?.Title?.trim()))?.some((item: any) => item?.Title?.trim()?.toLowerCase() === inputValues?.Title?.trim()?.toLowerCase()) && props?.details?.Title.trim() !== inputValues?.Title?.trim()) {
        isValid = false
        nameExist = false
      }
    }
    setCheckingValidation({ ...checkingValidation, Title: !checkName, TitleExists: !nameExist })
    if (isValid) {
      setLoading(true)
      const ObjectArray: any = {
        Title: inputValues?.Title,
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
        await pnpUpdate('FeedbackAboutMetadata', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
          props?.cancel()
        })
      } else {
        ObjectArray.ItemCreated = new Date()
        ObjectArray.ItemCreatedById = _spPageContextInfo.userId
        await pnpAdd('FeedbackAboutMetadata', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
          props?.filtersvalue(!props?.showAddPopup)
        })
      }
    }
  }
  const SELECT_VALUE = ['Yes', 'No']
  return (
           <>
            {loading ? 
            <PageOverlay /> :
            <div className={props?.showAddPopup ? 'mx-2 border-radius whitebg border-primary p-2' : 'settingseditpopup w-100 position-relative border-top1 p-2'} id='scroll'>
                {props?.showAddPopup && <div className="py-2 border-bottom1 ">
                    <h4 tabIndex={0} aria-label="ADD FEEDBACK ABOUT" className="m-0 p-0 d-inline-block font-15 montserratsemibold textcolor4 text-uppercase">
                    ADD FEEDBACK ABOUT
                    </h4>
                </div>}
                <div className="row"  ref={props?.popupBodyRef}>
                    <div className={props?.showAddPopup ? 'col-sm-12 col-md-6 mb-2' : 'col-sm-12 col-md-4 mb-2'}>
                        <InputText
                            inputProps={{
                              id: 'title ',
                              name: 'Title',
                              placeholder: 'Enter Title',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="Title"
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Title "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={nameChange}
                            error={checkingValidation?.Title ? checkingValidation?.Title : checkingValidation.TitleExists}
                            errorMsg={checkingValidation.TitleExists ? 'Already Exists' : ''}
                            value={inputValues.Title}
                        />
                    </div>
                    {!props?.showAddPopup &&
                        <div className="col-sm-12 col-md-4 mb-2">
            <CustomSelect
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
                                    onClick={() => feedbackAboutSubmit('submit')}
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
                                    onClick={() => feedbackAboutSubmit(props?.details)}
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
            </>
  )
}
export default AddeditView
