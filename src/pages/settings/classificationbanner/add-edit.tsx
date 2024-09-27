// /* eslint-disable react/jsx-key */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../pageoverLay/pageoverLay'
import { getAllSettings } from '../../../store/settings/reducer'
import { AppDispatch } from '../../../store'
import { sp } from '@pnp/sp'
import '@pnp/sp/attachments'
import { ListNames, UPDATE_ALERT } from '../../../configuration'
import Alert from '../../../components/alert/alert'
import InputText from '../../../utils/controls/input-text'
import CustomSelect from '../../../utils/controls/custom-select'
import Buttons from '../../../components/buttons/buttons'
import { pnpUpdate } from '../../../Global'
import { SketchPicker } from 'react-color'
import InputLabel from '../../../utils/controls/input-label'

const AddeditView = (props: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [showUpdateAlert, setShowUpdateAlert] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const classifieddata = props?.details
  const [checkingValidation, setCheckingValidation] = useState({ Name: false, Color: false, TextColor: false })
  const [inputValues, setInputValues] = useState({
    Name: classifieddata?.ClassificationMessage || '',
    Color: classifieddata?.ClassificationColor || '',
    TextColor: classifieddata?.TextColor || ''
  })
  const [tempColor, setTempColor] = useState(inputValues?.Color)
  const handleColorChange = (color: any) => {
    setTempColor(color.hex)
  }
  const nameChange = (event: any) => {
    setInputValues({ ...inputValues, Name: event.target.value.replace(/[<>]/g, '') })
  }
  const confirmColorChange = () => {
    setInputValues({ ...inputValues, Color: tempColor })
    setShowColorPicker(false)
  }
  const TextColorChange = (event: any) => {
    setInputValues({ ...inputValues, TextColor: event })
  }
  const BannerSubmit = async () => {
    let isValid = true
    setCheckingValidation({ Name: false, Color: false, TextColor: false })
    if (inputValues?.Name === classifieddata?.ClassificationMessage && inputValues?.Color === classifieddata?.ClassificationColor && inputValues?.TextColor === classifieddata?.TextColor) {
      setShowUpdateAlert(true)
      return
    }
    if (!inputValues?.Name?.trim()) {
      isValid = false
      setCheckingValidation((prevState) => ({ ...prevState, Name: true }))
    }

    if (!inputValues?.Color) {
      isValid = false
      setCheckingValidation((prevState) => ({ ...prevState, Color: true }))
    }
    if (!inputValues?.TextColor) {
      isValid = false
      setCheckingValidation((prevState) => ({ ...prevState, TextColor: true }))
    }
    if (!isValid) return

    setLoading(true)

    const ObjectArray = {
      ItemModified: new Date().toISOString(),
      ItemModifiedById: (_spPageContextInfo as any).userId,
      ClassificationMessage: inputValues?.Name,
      ClassificationColor: inputValues?.Color,
      TextColor: inputValues?.TextColor
    }
    try {
      await pnpUpdate(ListNames.CLASSIFICATION_BANNER, { ID: classifieddata.Id, ...ObjectArray })
      sp.web.lists.getByTitle(ListNames.CLASSIFICATION_BANNER).items.getById(classifieddata.Id)
      await dispatch(getAllSettings({ name: '' }))
      props?.cancel()
    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setLoading(false)
    }
  }

  const onUpdateClick = (button: string) => {
    setShowUpdateAlert(false)
  }
  const SELECT_TEXT_COLOR = [
    { label: 'White', value: '#FFFFFF' },
    { label: 'Black', value: '#000000' }
  ]
  return (
    <>
      {loading
        ? <PageOverlay />
        : <div className='settingseditpopup w-100 position-relative border-top1 px-2 py-2'>
          <div className="row">
            <div className='col-sm-12 col-md-8 mb-2'>
              <InputText
                inputProps={{
                  id: 'title',
                  name: 'Title',
                  placeholder: 'Enter Title',
                  className: 'segoeui-medium font-12 title-color mb-1',
                  maxLength: 255,
                }}
                label="Title"
                infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                info="Title"
                infoIcon="icon-info color-primary"
                isInfo
                isMandatory
                formClassName="d-flex flex-column"
                onChange={nameChange}
                error={checkingValidation.Name}
                value={inputValues?.Name}
              />
            </div>
            <div className="col-sm-12 col-md-4 mb-2">
              <CustomSelect
                inputProps={{ id: 'TextColor' }}
                value={[{ value: inputValues?.TextColor, label: SELECT_TEXT_COLOR.find(color => color.value === inputValues?.TextColor)?.label }]}
                label="Text Color"
                isMandatory
                formClassName="form-vertical text-nowrap segoeui-medium font-12 title-color"
                className='w-100 customselect'
                isInfo infoClassName="tool-tip tooltip-top" info='Text Color' infoIcon="icon-info color-primary"
                onChange={(e: any) => { TextColorChange(e.value) }}
                options={SELECT_TEXT_COLOR}
                error={checkingValidation?.TextColor}
                menuPosition="top"
                useFormattedOptions={true}
              />
            </div>
            <div className="col-sm-12 col-md-2 mb-2">
              <InputLabel
                labelProps={{ htmlFor: 'color' }}
                className="segoeui-medium font-12 title-color"
                label="Color"
                mandatory
                isinfoLabel
                isinfoClassName="tool-tip tooltip-top"
                isinfoIcon="icon-info color-primary"
                infoLabel="Color"
              />
              <div className="d-flex align-items-center">
                <div
                  className="color-indicator"
                  style={{ backgroundColor: inputValues?.Color, width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px' }}
                ></div>
                <button onClick={(e) => {
                  e.preventDefault()
                  setShowColorPicker(true)
                }} className='btn py-1 px-2 btn-border1 ms-2 segoeui-bold font-12 text-uppercase btn-xs mb-1 mt-1'>Pick Color</button>
              </div>
              {showColorPicker && (
                <div>
                  <SketchPicker
                    color={tempColor}
                    onChangeComplete={handleColorChange}
                  />
                  <button onClick={confirmColorChange} className='ms-auto d-flex mt-1 btn py-1 btn-border1 segoeui-bold font-12 text-uppercase btn-xs'>Confirm</button>
                </div>
              )}
              {checkingValidation.Color && <div className="text-danger">Color is required</div>}
            </div>
          </div>
          <div className="d-flex flex-wrap">
            <div className="ms-auto settingsbtns d-flex">
              <Buttons
                label="Update"
                className="border-radius3 py-1 px-2 btn-primary ms-2 whitetext segoeui-bold font-12 text-uppercase btn-xs"
                icon="icon-update font-11 pe-1"
                type="button"
                onClick={BannerSubmit}
              />
              <Buttons
                label="Cancel"
                className="py-1 px-2 border-radius3 btn-border1 ms-2 segoeui-bold font-12 text-uppercase btn-xs"
                icon="icon-close color-primary font-9 pe-1"
                type="button"
                onClick={props?.cancel}
              />
            </div>
          </div>
        </div>
      }
      {showUpdateAlert && (
        <Alert
          message={UPDATE_ALERT}
          alerttextclass='text-center'
          yes='OK'
          className="alert-info"
          btn1iconclassName='icon-checked font-12 pe-1'
          btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-bold font-12 text-uppercase btn-xs"
          onClick={onUpdateClick}
        />
      )}
    </>
  )
}

export default AddeditView

