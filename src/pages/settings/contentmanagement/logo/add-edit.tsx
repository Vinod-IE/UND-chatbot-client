/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import { pnpUpdate } from '../../../../Global'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { sp } from '@pnp/sp'
import '@pnp/sp/attachments'
import { ListNames, UPDATE_ALERT } from '../../../../configuration'
import Alert from '../../../../components/alert/alert'

const AddeditView = (props: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<any>([])
  const [existingfiles, setExistingfiles] = useState(props?.details?.AttachmentFiles ? props?.details?.AttachmentFiles : [])
  const [selectedFileName, setSelectedFileName] = useState<string>('No file chosen')
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showUpdateAlert, setShowUpdateAlert] = useState(false)
  const widgetdata = props?.details
  useEffect(() => {
    if (widgetdata) {
      setFiles(widgetdata?.AttachmentFiles)
      setSelectedFileName(widgetdata?.AttachmentFiles[0]?.FileName)
    }
  }, [widgetdata])
  const handleImageUpload = () => {
    fileInputRef.current!.click()
  }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = event.target.files
    if (files && files?.length > 0) {
      const fileArray: File[] = Array.from(files)
      if (fileArray?.some(file => !file.type.includes('image'))) {
        setValidationMessage('Invalid image format.')
        return
      }
      setValidationMessage('')
      setFiles(fileArray)
      fileArray?.forEach((file) => {
        const reader = new FileReader()
        reader.onload = function (e) {
          if (e.target && typeof e.target.result === 'string') {
            setSelectedImage(e.target.result)
          }
        }
        reader.readAsDataURL(file)
      })
      setSelectedFileName(files[0].name)
    }
  }
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files?.length > 0) {
      if (files[0].type.includes('image')) {
        setFiles(files[0])
        setSelectedFileName(files[0].name)
        setValidationMessage('')
        const reader = new FileReader()
        reader.onload = function (e) {
          if (e.target && typeof e.target.result === 'string') {
            setSelectedImage(e.target.result)
          }
        }
        reader.readAsDataURL(files[0])
        const fileArray: File[] = Array.from(files)
        setFiles(fileArray)
      } else {
        setSelectedFileName('No file chosen')
        setValidationMessage('Please drop a valid image file.')
        setSelectedImage(null)
        setFiles(null)
      }
    }
  }
  const getAttachmentFileName = (attachment: any) => {
    return attachment?.FileName || attachment?.name || null
  }
  const WidgetsSubmit = (value: any) => {
    let isValid = true
    let isNoChangesDetected = true
    if (value !== 'submit') {
      const currentAttachmentName = getAttachmentFileName(props?.details?.AttachmentFiles?.[0])
      const newAttachmentName = getAttachmentFileName(files?.[0])
      const attachmentsChanged =
        (currentAttachmentName && newAttachmentName && currentAttachmentName !== newAttachmentName) ||
        (!currentAttachmentName && newAttachmentName) ||
        (currentAttachmentName && !newAttachmentName)
      if (!attachmentsChanged) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (!isNoChangesDetected) {
      isValid = false
      setShowUpdateAlert(true)
      return
    }
    if (isValid) {
      setLoading(true)
      const ObjectArray: any = {
        AttachmentsType: 'Logo',
        ItemModified: new Date(),
        ItemModifiedById: _spPageContextInfo.userId
      }
      ObjectArray.ID = value.Id
      pnpUpdate(ListNames.LOGO, ObjectArray).then(async (data: any) => {
        const item = sp.web.lists.getByTitle(ListNames.LOGO)?.items.getById(value.Id)
        const existfile = []
        const filesArray = Array.isArray(files) ? files : []
        const existingfilesArray = Array.isArray(existingfiles) ? existingfiles : []
        for (const element of filesArray) {
          existfile.push({
            name: element.name,
            content: element
          })
        }
        const filestodelete: any[] = []
        existingfilesArray?.forEach((val: any) => {
          const attachmentNam = Array.from(new Set(filesArray.map((v: any) => v.FileName)))
          if (!attachmentNam.includes(val.FileName)) {
            filestodelete.push(val.FileName)
          }
        })
        if (filestodelete?.length > 0) {
          await item.attachmentFiles.deleteMultiple(...filestodelete).then(function () {
            setExistingfiles([])
          })
        }
        const updatedAttachments = filesArray.filter((i: any) => i.name !== null && i.name !== undefined).map((v: any) => v.name)
        if (updatedAttachments?.length > 0) {
          await item.attachmentFiles.addMultiple(existfile).then(function () {
            setExistingfiles([])
          })
        }
        await dispatch(getAllSettings({ name: '' }))
        props?.cancel()
        setLoading(false)
      })
    }
  }
  const onUpdateClick = async (button: string) => {
    if (button === 'Yes') {
      setShowUpdateAlert(false)
    } else {
      setShowUpdateAlert(false)
    }
  }
  return (
    <>
      {loading
        ? <PageOverlay />
        : <div className='settingseditpopup w-100 position-relative border-top1 px-2 py-2'>
          <div className="row">
            <div className='col-sm-12 col-md-6 d-flex flex-column' tabIndex={0} aria-label='upload a logo'>
              <label className='font-12 segoeui-regular title-color px-3'>Logo<span className='tool-tip tooltip-top font-12 sourcesanspro mx-1' data-tip="Logo"><span className='icon-info color-primary'></span></span></label>
              <div className='d-flex align-items-center py-2 px-2'
                onClick={handleImageUpload}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
                {selectedImage ? (
                  <img src={selectedImage} alt={selectedImage} className='wpx-100 h-auto' />
                ) : (
                  widgetdata && widgetdata?.AttachmentFiles.map((item: any) =>
                    <img key={item.id} src={item?.ServerRelativeUrl ? item?.ServerRelativeUrl : ''} alt='LOGO' title='LOGO' className='wpx-100 h-auto'/>
                  )
                )}
                <div className="d-flex flex-column px-2 cursor">
                  <h2 className='latomedium font-13 title-color12 py-1'>Upload a Logo</h2>
                  <div className='sourcesanspro font-12 subtitle-color4 text-break'>{selectedFileName}</div>
                  {validationMessage && <div className='errormsg mandatory'>{validationMessage}</div>}
                </div>
              </div>
              <input type="file" style={{ display: 'none' }} onChange={handleFileSelect} ref={fileInputRef} accept="image/*" />
            </div>
          </div>
          <div className="d-flex flex-wrap">
            <div className="ms-auto settingsbtns d-flex">
              <Buttons
                label="Update"
                className="border-radius3 py-1 px-2 btn-primary ms-2 whitetext segoeui-bold font-12 text-uppercase btn-xs"
                icon="icon-update font-11 pe-1"
                type="button"
                onClick={() => WidgetsSubmit(props?.details)}
              />
              <Buttons
                label="Cancel"
                className="py-1 px-2 border-radius3 btn-border1  ms-2 segoeui-bold font-12 text-uppercase btn-xs"
                icon="icon-close color-primary font-9 pe-1"
                type="button"
                onClick={() => {
                  props?.cancel()
                }}
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
