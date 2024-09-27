import React, { useState, useRef, useEffect, useContext } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import { pnpAdd, validatePhone, pnpUpdate, formatPhoneNumber } from '../../../../Global'
import SpPeoplePicker from 'react-sp-people-picker'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import CustomSelect from '../../../../utils/controls/custom-select'
import Alert from '../../../../components/alert/alert'
import { NO_CHANGE_MSG } from '../../../../configuration'
import Tooltip from '../../../../components/tooltip/tooltips'
const AddeditView = (props: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [checkingValidation, setCheckingValidation] = useState({ PocPhoneNumber: false, PocName: false })
  const [inputValues, setInputValues] = useState({
    PhoneNumber: props?.details?.ContactPhone ? props?.details?.ContactPhone : '',
    Name: props?.details?.ContactName ? props?.details?.ContactName : '',
    Archived: props?.details?.IsArchived ? 'Yes' : 'No'
  })
  const [selectedVal, setSelectedVal] = useState<string>(null as unknown as string)
  const [checkInputVal, setCheckInputVal] = useState<string>(null as unknown as string)
  const uncontrolledInput = useRef<HTMLInputElement>()
  $('._2z2Tk :input').off('focus').on('focus', function () { // to remove validation when foucs
    if ($(this).is(':focus')) {
      setCheckingValidation({ ...checkingValidation, PocName: false })
    }
    if ($(this).val() === '') {
      setInputValues({ ...inputValues, Name: '' })
    }
  })

  useEffect(() => {
    uncontrolledInput.current = document.getElementById('peopleSearchPane')?.getElementsByTagName('input')[0]
  }, [])
  useEffect(() => {
    setSelectedVal(props?.details?.ContactName)
  }, [props?.details])
  useEffect(() => {
    if (selectedVal && checkInputVal && selectedVal !== checkInputVal) {
      $('._2z2Tk :input').trigger('focus')
      $('._2z2Tk :input').val(checkInputVal)
    }
  }, [checkInputVal])
  const phoneNumberChange = (event: any) => {
    setInputValues({ ...inputValues, PhoneNumber: formatPhoneNumber(event.target.value) })
  }
  const changeArchived = (event: any) => {
    setInputValues({ ...inputValues, Archived: event })
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const POCSubmit = async (value: any) => {
    let isValid = true
    let isNoChangesDetected = true
    let checkName = true
    let checkPhoneNumber = true
    setCheckingValidation({ ...checkingValidation, PocName: false, PocPhoneNumber: false })
    if (value !== 'submit') {
      const archived = props?.details?.IsArchived ? 'Yes' : 'No'
      if (props?.details?.ContactName === (inputValues?.Name?.DisplayText ? inputValues?.Name?.DisplayText : inputValues?.Name) && props?.details?.ContactPhone === inputValues.PhoneNumber && archived === inputValues?.Archived) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    if (isValid) {
      if (!inputValues.Name) {
        isValid = false
        checkName = false
      }
      if ((inputValues.Name && !inputValues?.Name?.IsResolved && !props?.people && value === 'submit') || $('._2z2Tk :input').val() === '') { // && !inputValues?.Name?.IsResolved
        isValid = false
        checkName = false
      }
      const element = $('._10brd')?.length > 0
      if (element) {
        isValid = false
        checkName = true
      }
      if (inputValues.PhoneNumber && ((inputValues.PhoneNumber.length > 16) || (!validatePhone(inputValues.PhoneNumber)) || (inputValues.PhoneNumber.length < 13))) {
        isValid = false
        checkPhoneNumber = false
      }
      if (!inputValues.PhoneNumber) {
        isValid = false
        checkPhoneNumber = false
      }
    }
    setCheckingValidation({ ...checkingValidation, PocPhoneNumber: !checkPhoneNumber, PocName: !checkName })
    if (isValid) {
      setLoading(true)
      const ObjectArray: any = {
        ContactName: inputValues?.Name?.DisplayText ? inputValues?.Name?.DisplayText : inputValues?.Name,
        ContactEmail: inputValues?.Name?.EntityData?.Email ? inputValues?.Name?.EntityData?.Email : props?.details?.ContactEmail,
        ContactTitle: inputValues?.Name?.EntityData?.Title ? inputValues?.Name?.EntityData?.Title : props?.details?.ContactTitle,
        ContactPhone: inputValues.PhoneNumber,
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
        await pnpUpdate('PointofContactList', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
          props?.cancel()
        })
      } else {
        ObjectArray.ItemCreated = new Date()
        ObjectArray.ItemCreatedById = _spPageContextInfo.userId
        await pnpAdd('PointofContactList', ObjectArray).then(async (data : any) => {
          await dispatch(getAllSettings({ name: '' }))
        props?.filtersvalue(!props?.showAddPopup)
        })
      }
    }
  }
  const handleSearchpp = (event: any) => {
    setInputValues({ ...inputValues, Name: event })
    setCheckingValidation({ ...checkingValidation, PocName: false })
    setCheckInputVal(event?.DisplayText)
    if(!props.showAddPopup) props?.setPeople(false)
  }
  const changeMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    props?.setPeople(true)
    setCheckInputVal(e.target.value)
    setInputValues({ ...inputValues, Name: '' })
  }
  const SELECT_VALUE = ['Yes', 'No']

  return (
    <>
    {loading
      ? <PageOverlay />
      : <div className={props?.showAddPopup ? 'border-radius whitebg border-primary p-2 mb-2' : 'settingseditpopup w-100 position-relative border-top1 p-2 mt-2'}>
      {props?.showAddPopup && <div className="py-2 border-bottom1 ">
        <h4 tabIndex={0} aria-label="ADD POINTS OF CONTACT" className="m-0 p-0 d-inline-block font-15 montserratsemibold textcolor4 text-uppercase">
          ADD POINTS OF CONTACT
        </h4>
      </div>}
      <div className="row" ref={props?.popupBodyRef}>
      {!props?.people
        ? (

<div className={props?.showAddPopup ? 'col-sm-12 col-md-6 d-flex flex-column mb-2' : 'col-sm-12 col-md-4 d-flex flex-column mb-2'} >
          <label htmlFor="pocinput" className="latomedium font-13 darktext mb-2">Points of Contact    <span className="mandatory">*</span> <Tooltip content='Points of Contact' position='top'><span className="icon-info"></span></Tooltip></label>
          <div className='d-flex align-items-center sppeoplepicker'>
            <input className='input' id="pocinput" value={inputValues?.Name?.DisplayText ? inputValues?.Name?.DisplayText : inputValues?.Name} onChange={(e) => changeMembers(e)} />
            </div>
            {checkingValidation?.PocName ? <p className='errormsg'>Please enter Points of Contact</p> : ''}

        </div>
          )
        : ''}
          {
                props?.people
                  ? (
        <div className={props?.showAddPopup ? 'col-sm-12 col-md-6 d-flex flex-column mb-2' : 'col-sm-12 col-md-4 d-flex flex-column mb-2'}>
          <label htmlFor=" Points of Contact " className="latomedium font-13 darktext mb-2">Points of Contact    <span className="mandatory">*</span> <Tooltip content='Points of Contact' position='top'><span className="icon-info"></span></Tooltip> </label>
          <div className='d-flex align-items-center sppeoplepicker'>
            <SpPeoplePicker onSelect={handleSearchpp} className='d-flex flex-column' onClick={handleSearchpp} onChange={handleSearchpp} value={inputValues?.Name ? inputValues?.Name : props?.details?.PocName} />
            </div>
            {checkingValidation?.PocName ? <p className='errormsg'>Please enter Points of Contact</p> : ''}

        </div>
                    )
                  : ''
              }
        <div className={props?.showAddPopup ? 'col-sm-12 col-md-6 mb-2' : 'col-sm-12 col-md-4 mb-2'} >
          <InputText
            inputProps={{
              id: ' phonenumber ',
              name: 'Phone Number',
              placeholder: 'Enter Phone Number',
              className: 'latomedium font-13 darktext mb-2',
              maxLength: 256
            }}
            label="Phone Number"
            isMandatory
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            info="Phone Number "
            infoIcon="icon-info"
            isInfo
            formClassName="d-flex flex-column"
            onChange={phoneNumberChange}
            error={checkingValidation?.PocPhoneNumber}
            value={inputValues.PhoneNumber ? formatPhoneNumber(inputValues.PhoneNumber) : formatPhoneNumber(props?.details?.PhoneNumber)}
          />
        </div>
        {!props?.showAddPopup &&
          <div className="col-sm-12 col-md-4 mb-2">
                <CustomSelect
                 inputProps={{
                  id:'IsArchived'
                }}
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
                onClick={() => POCSubmit('submit')}
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
                id='updatePocBtn'
                label="Update"
                className="border-radius py-1 px-2 btn-primary ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                icon="icon-update font-11 pe-1"
                type="button"
                onClick={() => POCSubmit(props?.details)}
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
