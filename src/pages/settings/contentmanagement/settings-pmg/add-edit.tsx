import React, { useContext, useEffect, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import InputText from '../../../../utils/controls/input-text'
import FileUpload from '../../../../components/upload/upload-file'
import { sp } from '@pnp/sp'
import { FILE_CHARACTERS_UNALLOWED, ListNames, NO_CHANGE_MSG } from '../../../../configuration'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { getAllSettings } from '../../../../store/settings/reducer'
import { loadPII, validatePII, shouldAddToPIIAuditTrail, addtoPIIAuditTrail } from '../../../pii/commonFunctions/piiFunctions'
import RenderPIIPopup from '../../../pii/piiPopup/PiiPopup'
import { VALIDATE_PII_CONTENT } from '../../../../configuration'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import Alert from '../../../../components/alert/alert'
import { getFileExtensionByFileName } from '../../../../shared/utility'
import { isAcceptableFileType, trimBeforeExtension } from '../../../../shared/utility/fileHelpers'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const AddeditView = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<any>([])
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [folderValidations, setFolderValidations] = useState({
    Name: false,
    duplicateName: '',
    ValidFolderName: '',
    FileName: false,
  })
  const [inputValues, setInputValues] = useState({ Name: props?.folderName ? (isAcceptableFileType(props?.folderName) ? props?.folderName?.split('.')?.slice(0, -1)?.join('.') : props?.folderName) : '' })
  function changeTitle (e: { target: { value: any } }) {
    setInputValues({ ...inputValues, Name: e.target.value })
  }
  const [displayPII, setDisplayPII] = useState(false)
  const [piiScan, setPIIScan] = useState<any>({})
  const [showAlert, setShowAlert] = useState(false)
  const[fileError, setFileError] = useState(false)
  useEffect(() => {
    setFolderValidations({...folderValidations,  Name: false,
      duplicateName: '',
      ValidFolderName: '',
      FileName: false })
  }, [props?.addFolder, props?.addFile, props?.editFolder, props?.editFile])
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
  const onClickAlert = () => {
    setShowAlert(false)
  }
   const saveorupdate = async (folder: any, items: string) => {
    let isValid = true
    let checkTitle = true
    let IsDuplicateFolderName = true
    let duplicateName = ''
    let fileName = true
    let validFolderName = ''
    let duplicateFileName = true
    if (((!inputValues.Name?.trim()) || (!inputValues.Name?.trim() && props?.addFolder)) && !props?.addFile && !props?.addFolderFile) {
      isValid = false
      checkTitle = false
    } else if (FILE_CHARACTERS_UNALLOWED?.some((char: string) => inputValues?.Name?.includes(char))) {
      isValid = false
      checkTitle = false
      validFolderName = 'Folder/File name contains unallowed characters. Unallowed characters are , ! @ # $ % ^ & * ( ) + = [ ] { } ʻ : “ | < > / ? ~'
    } else if (props?.folderNames?.length > 0 && props?.addFolder) {
      props?.folderNames.forEach((element: { folderName: any }) => {
        if (element?.folderName?.toString().toLowerCase() === inputValues?.Name?.trim().toString().toLowerCase()) {
          IsDuplicateFolderName = false
        }
      })
    } else if (props?.folderNames?.length > 0 && !props?.addFolder && props?.editFolder && props?.folderName?.trim() !== inputValues?.Name?.trim()) {
      props?.folderNames?.filter((item: any) => item?.folderName?.trim() !== props?.folderName?.trim())?.forEach((element: any) => {
        if (element?.folderName?.trim()?.toLowerCase() === inputValues?.Name?.trim()?.toLowerCase()) {
          IsDuplicateFolderName = false
        }
      })
    } else if (props?.editFile && trimBeforeExtension(props?.folderName) !== inputValues?.Name.trim() + `.${getFileExtensionByFileName(props?.folderName)}`) {
      props?.details?.Files?.results ? props?.details?.Files?.results : (props?.details?.Files ? props?.details?.Files : props?.details)?.filter((item: any) => item.Name !== props?.folderName)?.forEach((element: any) => {
        if (trimBeforeExtension(element?.Name)?.toLowerCase() === inputValues?.Name?.trim()?.toLowerCase() + `.${getFileExtensionByFileName(props?.folderName)}`) {
          duplicateFileName = false
        }
      })
    }
    if (!IsDuplicateFolderName) {
      isValid = false
      checkTitle = false
      duplicateName = 'Entered Folder Name Already Exists'
    }
    if (!duplicateFileName) {
      isValid = false
      checkTitle = false
      duplicateName = 'Entered File Name Already Exists'
    }
    if (files.length > 0) {
      isValid = true
    }
    if (((isAcceptableFileType(folder) ? inputValues.Name?.trim() + `.${getFileExtensionByFileName(folder)}` : inputValues.Name.trim()) === folder && folder && !props?.addFolder && !props?.addFile && !props?.addFolderFile)) {
      isValid = false
      setShowAlert(true)
    }
    if ((props?.addFile || props?.addFolderFile) && files.length === 0) {
      isValid = false
      fileName = false
      setFileError(true)
    }
    setFolderValidations({ ...folderValidations, Name: !checkTitle, duplicateName: duplicateName, FileName: !fileName, ValidFolderName: validFolderName })
    let canSubmit = true
    if (isValid && VALIDATE_PII_CONTENT) {
      const itemPII : any = {}
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
    if (isValid && canSubmit) {
      setLoading(true)
      if (props?.addFolder && !props?.editFile) {
        await sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO).folders.addUsingPath(inputValues.Name?.trim())
        await dispatch(getAllSettings({ name: '' }))
        props?.filtersvalue(!props?.showAddEdit)
        props?.filtersvalue(false)
        props.folderClose(props?.addFolder)
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Policy Memo and Guidelines', '', piiScan, '')
        }
      } else if ((props?.addFile || props?.addFolderFile) && props?.folderName && !props?.editFile) {
        let i = 0
        for (const element of files) {
          i++
          const file = await sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO + '/' + folder).files.addUsingPath(element.name, element, { Overwrite: true })
          await file.file.getItem()
          if (i === files?.length) {
            await dispatch(getAllSettings({ name: '' }))
            props?.filtersvalue(!props?.showAddEdit)
            props?.filtersvalue(false)
          }
        }
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Policy Memo and Guidelines', '', piiScan, '')
        }
      } else if (props?.folderName) {
        if (props?.editFile && props?.folderName?.includes('.') && props?.details?.Templates) {
          const folderFiles = sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO + '/' + props?.details?.Templates + '/' + props?.folderName) // equivalent

          await folderFiles.getItem()
            .then(item => item.update({ FileLeafRef: (isAcceptableFileType(props?.folderName) ? inputValues.Name?.trim() + `.${getFileExtensionByFileName(props?.folderName)}` : inputValues.Name?.trim())}))
            .then(async function () {
              await dispatch(getAllSettings({ name: '' }))
              props?.cancel()
            })
        } else if (props?.folderName?.includes('.')) {
          const fileName = folder
          const folderFiles = sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO + '/' + fileName) // equivalent

          await folderFiles.getItem()
            .then(item => item.update({ FileLeafRef: (isAcceptableFileType(props?.folderName) ? inputValues.Name?.trim() + `.${getFileExtensionByFileName(props?.folderName)}` : inputValues.Name?.trim())}))
            .then(async function () {
              await dispatch(getAllSettings({ name: '' }))
              props?.cancel()
            })
        } else {
          const folderName = sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO + '/' + folder)
          const item = await folderName.getItem()
          await item.update({ FileLeafRef: (isAcceptableFileType(props?.folderName) ? inputValues.Name?.trim() + `.${getFileExtensionByFileName(props?.folderName)}` : inputValues.Name?.trim())})
          await dispatch(getAllSettings({ name: '' }))
          props?.filtersvalue(!props?.showAddEdit)
        }
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Policy Memo and Guidelines', '', piiScan, '')
        }
      } else if (!folder && props?.addFile) {
        let i = 0
        for (const element of files) {
          i++
          const file = await sp.web.getFolderByServerRelativePath(ListNames?.POLICY_MEMO).files.addUsingPath(element.name, element, { Overwrite: true })
          await file.file.getItem()
          if (i === files?.length) {
            await dispatch(getAllSettings({ name: '' }))
            props?.filtersvalue(!props?.showAddEdit)
          }
        }
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Policy Memo and Guidelines', '', piiScan, '')
        }
      }
      setLoading(false)
    }
  }
  const cancel = () => {
    props?.filtersvalue(!props?.showAddEdit)
    props?.cancel()
  }

  return (
    <>
    {loading
      ? <PageOverlay />
      : <div className={props?.showAddEdit ? 'mx-2 border-radius whitebg border-primary p-2' : 'settingseditpopup w-100 position-relative border-top1 p-2'}>
        {(props?.showAddEdit && !props?.addFolderFile) && <div className="py-2 border-bottom1 ">
            <h4 tabIndex={0} aria-label="ADD FOLDER" className="m-0 p-0 d-inline-block font-15 montserratsemibold textcolor4 text-uppercase">
            {props?.addFolder && <span>ADD FOLDER</span> }
            {(props?.editFolder) && <span>EDIT FOLDER</span>}
            {(props?.editFile) && <span>EDIT File</span>}
            {props?.addFile && <span>ADD Files</span> }
            </h4>
        </div>}
        <div className="row" ref={props?.popupBodyRef}>
          {(props?.addFolder || props?.editFolder || props?.editFile) && (!props?.addFile && !props?.addFolderFile) &&
            <div className="col-sm-12 col-lg-12 mb-2">
                <InputText
                    inputProps={{
                      id: ' Name ',
                      name: 'Name',
                      placeholder: 'Enter Name',
                      className: 'latomedium font-13 darktext mb-2',
                      maxLength: (props?.addFolder || props?.editFolder) ? 64 : 128
                    }}
                    label=" Name "
                    isMandatory
                    infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                    info="Name "
                    infoIcon="icon-info"
                    isInfo
                    formClassName="d-flex flex-column"
                    onChange={changeTitle}
                    error ={folderValidations.Name}
                    errorMsg = {folderValidations?.ValidFolderName ? folderValidations?.ValidFolderName : folderValidations?.duplicateName }
                    value={inputValues?.Name}
                />
            </div>
          }
          {!props?.editFile &&
          (props?.addFile || props?.addFolderFile) && (!props?.addFolder && !props?.editFolder) &&
            <div className="col-sm-12 col-lg-12 mb-2">
                <FileUpload
                    inputProps={{
                      id: 'attachfiles ',
                      name: ' Description',
                      className: 'latomedium font-13 darktext mb-2'
                    }}
                    label="Attach File (s) "
                    infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
                    info="Attach File (s) "
                    infoIcon="icon-info"
                    isInfo
                    mandatory={true}
                    files={files}
                    setFiles={setFiles}
                    setFileError={setFileError}
                    fileError={fileError}
                    error = {folderValidations.FileName}
                    formClassName="d-flex flex-column"
                    hintClassName='color-primary'
                    noteClassName='color-primary'
                    hint="Upload the files which are in the .png, .jpeg, .xlsx, .txt .docx, .pdf files and special characters will not be used in the document names. Maximum size for file is 25 MB. Limit is up to 10 files per screen"
                    note='Screenshots need to be saved locally before uploading into system.'
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
                {((props?.showAddEdit && !props?.folderName) || props?.addFolderFile) &&
                    <>
                        <Buttons
                            label="Save"
                            className="border-radius py-1 px-2 btn-bgcolor9  ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                            icon="icon-save font-11 pe-1"
                            type="button"
                            onClick={() => {
                              saveorupdate(props?.folderName, '')
                            }}
                        />
                        <Buttons
                            label="Cancel"
                            className="py-1 px-2 border-radius btn-border1 ms-2 montserratbold font-12 text-uppercase btn-xs"
                            icon="icon-close color-primary font-9 pe-1"
                            type="button"
                            onClick={() => {
                              props?.filtersvalue(!props?.showAddEdit)
                            }}
                        /> </>}
                {props?.folderName && !props?.addFolderFile &&
                    <>
                        <Buttons
                            label="Update"
                            className="border-radius py-1 px-2 btn-primary ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                            icon="icon-update font-11 pe-1"
                            type="button"
                            onClick={() => {
                              saveorupdate(props?.folderName, props?.details?.Name)
                            }}
                        />
                        <Buttons
                            label="Cancel"
                            className="py-1 px-2 border-radius btn-border1  ms-2 montserratbold font-12 text-uppercase btn-xs"
                            icon="icon-close color-primary font-9 pe-1"
                            type="button"
                            onClick={() => cancel()}
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
