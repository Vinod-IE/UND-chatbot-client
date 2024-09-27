import React, { useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import { pnpUpdate } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { ListNames, NO_CHANGE_MSG } from '../../../../configuration'
import Alert from '../../../../components/alert/alert'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
const AddeditView = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [checkingValidation, setCheckingValidation] = useState({ LabelName: false, TooltipDescription: false })
  const [inputValues, setInputValues] = useState({
    LabelName: props?.details?.LabelName ? props?.details?.LabelName : '',
    TooltipDescription: props?.details?.TooltipDescription ? props?.details?.TooltipDescription : ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const changeInput = (event: any, input : string) => {
    setInputValues({ ...inputValues, [input]: event.target.value })
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const TooltipsUpdate = async () => {
    let isValid = true
    let checkName = true
    let checkDesc = true
    let isNoChangesDetected = true
    if (props?.details?.TooltipDescription?.trim() === inputValues?.TooltipDescription?.trim()) {
      isValid = false
      isNoChangesDetected = false
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    setCheckingValidation({ ...checkingValidation, LabelName: false, TooltipDescription: false })
    if (!inputValues.LabelName) {
      isValid = false
      checkName = false
    }
    if (!inputValues?.TooltipDescription?.trim()) {
      isValid = false
      checkDesc = false
    }
    setCheckingValidation({ ...checkingValidation, LabelName: !checkName, TooltipDescription: !checkDesc })
    if (isValid) {
    setLoading(true)
      const ObjectArray: any = {
        LabelName: inputValues?.LabelName,
        TooltipDescription: inputValues?.TooltipDescription,
        ItemModified: new Date(),
        ItemModifiedById: _spPageContextInfo.userId
      }
      ObjectArray.ID = props?.details?.ID
      await pnpUpdate(ListNames.TOOLTIP, ObjectArray).then(async () => {
        await dispatch(getAllSettings({ name: '' }))
        props?.cancel()
      })
    }
  }
  return (
    <>
            <div className="settingseditpopup w-100 position-relative border-top1 p-2 mt-2">
                <div className="row">
                    <div className="col-sm-12 mb-2">
                        <InputText
                            inputProps={{
                              id: 'labelname ',
                              name: 'Label Name',
                              placeholder: 'Label Name',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="Label Name"
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Label Name"
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={(e : Event) => changeInput(e, 'LabelName')}
                            error={checkingValidation?.LabelName}
                            value={inputValues.LabelName}
                            readonly = {true}
                        />
                    </div>
                    <div className="col-sm-12 mb-2">
                        <InputText
                            inputProps={{
                              id: 'labelid',
                              name: 'Label ID',
                              placeholder: props?.details?.ToolTipID,
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="Label ID"
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Label ID"
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            readonly = {true}
                            value={ props?.details?.ToolTipID}
                        />
                    </div>
                        <div className="col-sm-12 mb-2">
                        <InputText
                            inputProps={{
                              id: 'description ',
                              name: 'Description ',
                              placeholder: 'Description',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label="Description "
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Description "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={(e : Event) => changeInput(e, 'TooltipDescription')}
                            error={checkingValidation?.TooltipDescription}
                            value={inputValues.TooltipDescription}
                        />
                        </div>
                </div>
                <div className="d-flex py-1 flex-wrap">
                    <div className="ms-auto settingsbtns d-flex">
                            <Buttons
                                    label="Update"
                                    className="border-radius py-1 px-2 btn-primary ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-update font-11 pe-1"
                                    type="button"
                                    onClick={() => {
                                      TooltipsUpdate()
                                    }}
                                />
                                <Buttons
                                    label="Cancel"
                                    className="py-1 px-2 border-radius btn-border1  ms-2 montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-close color-primary font-9 pe-1"
                                    type="button"
                                    onClick={() => {
                                      props?.cancel()
                                    }}
                                />
                    </div>
                </div>
            </div>
                             {showAlert && (
                              <Alert message={NO_CHANGE_MSG} yes='OK' cancel='Cancel' className="alert-info"
                                onClick={onClickAlert}
                                btn1iconclassNmae='icon-checked  font-11 pe-1'
                                btn2iconclassNmae='icon-close  font-11 pe-1'
                                btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                                btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
                    
                              />
                            )}
                            {loading && <PageOverlay />}
                            </>
  )
}
export default AddeditView
