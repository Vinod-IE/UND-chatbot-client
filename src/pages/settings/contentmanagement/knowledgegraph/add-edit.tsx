import React, { useContext, useEffect, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import FileUpload from '../../../../components/upload/upload-file'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { ListNames, NO_CHANGE_MSG } from '../../../../configuration'
import { areContentsEqual, encodeHTML, pnpAdd, pnpUpdate, removehtmltags } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { sp } from '@pnp/sp'
import { addtoPIIAuditTrail, loadPII, shouldAddToPIIAuditTrail, validatePII } from '../../../pii/commonFunctions/piiFunctions'
import RenderPIIPopup from '../../../pii/piiPopup/PiiPopup'
import { VALIDATE_PII_CONTENT } from '../../../../configuration'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import CustomSelect from '../../../../utils/controls/custom-select'
import Alert from '../../../../components/alert/alert'
import { set } from 'date-fns'
import RichtextV1 from '../../../../utils/controls/richtextV1'
const AddeditView = (props:any) => {
  const [files, setFiles] = useState<any>(props?.details?.AttachmentFiles ? props?.details?.AttachmentFiles : [])
  const [existingfiles, setExistingfiles] = useState(props?.details?.AttachmentFiles ? props?.details?.AttachmentFiles : [])
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [knowledgeGraphValidations, setKnowledgeGraphValidations] = useState({
    Title: false,
    Description: false,
    Tags: false,
    ExpiryDate: false
  })
  const [inputValues, setInputValues] = useState({
    Title: props?.details?.Title ? props?.details?.Title : '',
    Description: props?.details?.Description ? props?.details?.Description : '',
    Archived: props?.details?.['Is Archived'] ? 'Yes' : 'No',
    Tags: props?.details?.Tags ? props?.details?.Tags : '',
    ExpiryDate: props?.details?.ExpiryDate ? props?.details?.ExpiryDate : '',
    files: props?.details?.AttachmentFiles ? props?.details?.AttachmentFiles : ''
  })
  const [displayPII, setDisplayPII] = useState(false)
  const [piiScan, setPIIScan] = useState<any>({})
  useEffect(() => {
    loadPII()
  }, [])
  useEffect(() => {
    setDisplayPII(false)
    if (Object.keys(piiScan).length > 0) {
      Object.keys(piiScan).forEach((key) => {
        if (key === 'FileArray') {
          for (const file of piiScan[key].value) {
            if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
              setDisplayPII(true)
            }
          }
        } else {
          if (
            piiScan[key].resultsArray.length > 0 &&
            !piiScan[key].userAnswer
          ) {
            setDisplayPII(true)
          }
        }
      })
    }
  }, [piiScan])
  function changeTitle (e: { target: { value: any } }) {
    setInputValues({ ...inputValues, Title: e.target.value })
  }
  function handleInputChangeRichText (e: any) {
    setInputValues({ ...inputValues, Description: e })
  }
  function changeArchived (e: any) {
    setInputValues({ ...inputValues, Archived: e })
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const KnowlegeGraphSubmit = async (value: any) => {
    const saveButton = document.getElementById('kaSaveButton')
    let isValid = true
    let isNoChangesDetected = true
    let checkTitle = true
    let checkDescription = true
    setKnowledgeGraphValidations({ ...knowledgeGraphValidations, Title: false, Description: false, Tags: false, ExpiryDate: false })
    if (value !== 'submit') {
      const filestodelete: any[] = []
      const file = []
      if (files.length > 0) {
        for (const element of files) {
          if (element.name) {
            file.push({
              name: element.name,
              content: element
            })
          }
        }
      }
      existingfiles.forEach((val : any) => {
        const attachmentNam = Array.from(new Set(files.map((v : any) => v.FileName)))
        if (!attachmentNam.includes(val.FileName)) { filestodelete.push(val.FileName) }
      })
      const archived = props?.details?.['Is Archived'] ? 'Yes' : 'No'
      if (props?.details?.Title.trim() === inputValues.Title.trim() && areContentsEqual(props?.details?.Description, inputValues?.Description) && archived === inputValues?.Archived && file?.length === 0 && filestodelete?.length === 0) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (isValid) {
      if (!inputValues.Title || !inputValues.Title.trim()) {
        isValid = false
        checkTitle = false
      }
      if (!removehtmltags(inputValues?.Description)?.trim()) {
        isValid = false
        checkDescription = false
      }
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    setKnowledgeGraphValidations({ ...knowledgeGraphValidations, Title: !checkTitle, Description: !checkDescription })
    let canSubmit = true
    if (isValid && VALIDATE_PII_CONTENT) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = true
      }
      const itemPII : any = {}
      itemPII.Title = inputValues.Title
      itemPII.Description = removehtmltags(inputValues?.Description)
      itemPII.Files = Object.values(files)
      const piiScanResult : any = await validatePII(itemPII, piiScan)
      setPIIScan({ ...piiScanResult })
      if (Object.keys(piiScanResult).length > 0) {
        Object.keys(piiScanResult).forEach((key) => {
          if (key === 'FileArray') {
            for (const file of piiScanResult[key].value) {
              if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
                setDisplayPII(true)
                canSubmit = false
              }
            }
          } else {
            if (
              piiScanResult[key].resultsArray.length > 0 &&
            !piiScanResult[key].userAnswer
            ) {
              setDisplayPII(true)
              canSubmit = false
            }
          }
        })
      }
    }
    if (!canSubmit) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = false
      }
    }
    if (isValid && canSubmit) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = true
      }
      setLoading(true)
      const ObjectArray : any = {
        Title: inputValues?.Title,
        Description: encodeHTML(inputValues?.Description),
        ItemModifiedById: _spPageContextInfo.userId,
        ItemModified: new Date()
      }
      if (value !== 'submit') {
        let archived = false
        if (inputValues.Archived === 'Yes') {
          archived = true
        }
        ObjectArray.IsArchived = archived
        ObjectArray.ID = value.Id
        pnpUpdate(ListNames?.KNOWLEDGEGRAPH, ObjectArray).then(async (data: any) => {
          const item = sp.web.lists.getByTitle(ListNames?.KNOWLEDGEGRAPH).items.getById(value.Id)
          const file = []
          for (const element of files) {
            if (element.name) {
              file.push({
                name: element.name,
                content: element
              })
            }
          }
          const filestodelete: any[] = []
          existingfiles.forEach((val : any) => {
            const attachmentNam = Array.from(new Set(files.map((v : any) => v.FileName)))
            if (!attachmentNam.includes(val.FileName)) { filestodelete.push(val.FileName) }
          })
          if (filestodelete?.length > 0) {
            await item.attachmentFiles.deleteMultiple(...filestodelete).then(function () {
              setExistingfiles([])
            })
          }
          if (files?.length > 0) {
            await item.attachmentFiles.addMultiple(file).then(function () {
              setExistingfiles([])
            })
          }
          const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
          if (await shouldAddPIIAuditTrail) {
            await addtoPIIAuditTrail('Knowledge Graph', '', piiScan, '')
          }
          await dispatch(getAllSettings({ name: '' }))
          props?.cancel()
          setLoading(false)
        })
      } else {
        ObjectArray.ItemCreated = new Date()
        ObjectArray.ItemCreatedById = _spPageContextInfo.userId
        pnpAdd(ListNames?.KNOWLEDGEGRAPH, ObjectArray).then(async (data: any) => {
          if (files.length > 0) {
            const item = sp.web.lists.getByTitle(ListNames?.KNOWLEDGEGRAPH).items.getById(data.data.ID)
            const file = []
            for (const element of files) {
              file.push({
                name: element.name,
                content: element
              })
            }
            await item?.attachmentFiles.addMultiple(file)
          }
          const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
          if (await shouldAddPIIAuditTrail) {
            await addtoPIIAuditTrail('Announcement', '', piiScan, '')
          }
          await dispatch(getAllSettings({ name: '' }))
          props?.filtersvalue(!props?.showAddPopup)
          setLoading(false)
        })
      }
    }
  }
  const SELECT_VALUE = ['Yes', 'No']

  return (
    <div>
           { loading
             ? <PageOverlay />
             : <div className={props?.showAddPopup ? 'mx-2 border-radius whitebg border-primary p-2' : 'settingseditpopup w-100 position-relative border-top1 p-2'}  id='scroll'>
                {props?.showAddPopup && <div className="py-2 border-bottom1 ">
                    <h4 tabIndex={0} aria-label="ADD KNOWLEDGE GRAPH" className="m-0 p-0 d-inline-block font-15 montserratsemibold textcolor4 text-uppercase">
                        ADD KNOWLEDGE GRAPH
                    </h4>
                </div>}
                <div className="row">
                    <div className="col-sm-12 col-lg-12 mb-2" ref={props?.popupBodyRef}>
                        <InputText
                            inputProps={{
                              id: ' Title ',
                              name: ' Title',
                              placeholder: 'Enter Title',
                              className: 'latomedium font-13 darktext mb-2',
                              maxLength: 255
                            }}
                            label=" Title "
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Title "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            onChange={changeTitle}
                            error ={knowledgeGraphValidations.Title}
                            value={inputValues.Title}
                        />
                    </div>
                    <div className="col-sm-12 col-lg-12 mb-2">
                        <RichtextV1
                            inputProps={{
                              id: ' Description ',
                              name: ' Description',
                              className: 'latomedium font-13 darktext mb-2'
                            }}
                            label="Description "
                            isMandatory
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Description "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            placeholder= 'Enter Description'
                            error = {knowledgeGraphValidations.Description}
                            onChange={handleInputChangeRichText}
                            value={inputValues?.Description}
                        />
                    </div>
                    <div className="col-sm-12 col-lg-12 mb-2">
                        <FileUpload
                            inputProps={{
                              id: 'attachfiles ',
                              name: 'Description',
                              className: 'latomedium font-13 darktext mb-2'
                            }}
                            label="Attach File (s) "
                            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                            info="Attach File (s) "
                            infoIcon="icon-info"
                            isInfo
                            formClassName="d-flex flex-column"
                            files={files}
                            setFiles={setFiles}
                            hintClassName='color-primary'
                            noteClassName='color-primary'
                            hint="Upload the files which are in the .png, .jpeg, .xlsx, .txt .docx, .pdf files and special characters will not be used in the document names. Maximum size for file is 25 MB. Limit is up to 10 files per screen"
                            note='Screenshots need to be saved locally before uploading into system.'
                        />
                    </div>
                    {!props?.showAddPopup &&
                        <div className="col-sm-12 col-lg-4 mb-2">
                <CustomSelect
                  inputProps={{id:'IsArchived'}}
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
                     {displayPII && (
            <div className='pt-2'>
            <div className="pii-compliance-validation p-10">
            {displayPII && <RenderPIIPopup piiScan={piiScan} setPIIScan={setPIIScan} />}
            </div>
            </div>
                     )}
                </div>
                <div className="d-flex py-1 flex-wrap">
                    <div className="ms-auto settingsbtns d-flex">
                        {props?.showAddPopup &&
                            <>
                                <Buttons
                                    id="kaSaveButton"
                                    label="Save"
                                    className="border-radius py-1 px-2 btn-bgcolor9  ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                                    icon="icon-save font-11 pe-1"
                                    type="button"
                                    onClick={() => { KnowlegeGraphSubmit('submit') }}
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
                                    onClick={() => { KnowlegeGraphSubmit(props?.details) }}
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
