import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ACCEPTABLE_FILE_TYPES, FILENAME_REGEX, MAX_NUM_FILES } from '../../configuration'
import './fileupload.css'
import InputLabel from '../../utils/controls/input-label'
import { FileError } from '../../shared/types'
import { validateFile } from '../../Global'
import Alert from '../alert/alert'
import { PopupCloseContext } from '../../shared/contexts/popupclose-context'
interface Props {
  onFileChange: any,
  label?: any,
  hint?: any,
  inputProps?: any,
  infoClassName?: any,
  info?: any,
  infoIcon?: any,
  isInfo?: any,
  formClassName?: any,
  files?: any,
  setFiles?: any,
  disabled?: any,
  hintClassName?: any,
  note?: any,
  noteClassName?: any,
  error?: any,
  mandatory?: any,
  setFileError?: any
  fileError?: boolean
}
export const FileUpload = (props: Props) => {
  const wrapperRef = useRef<any>(null)
  const [fileList, setFileList] = useState<any>(props?.files ? props?.files : [])
  const onDragEnter = () => wrapperRef.current.classList.add('dragover')
  const onDragLeave = () => wrapperRef.current.classList.remove('dragover')
  const { setFiles, label, info, isInfo, hint, files } =
    props
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [fileErrors, setFileErrors] = useState<Array<FileError>>([])
  const [showAlert,setShowAlert] =  useState(false)
  const [removeAlert,setRemoveAlert] =  useState(false)
  const [existingFiles, setExistingFiles] = useState<string[]>()
  const [deleteFile, setDeleteFile] = useState<any>(null)
  const [newFiles, setNewFiles] = useState<Array<File>>([])
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [validatedFiles, setValidatedFiles] = useState<Array<File>>([])
  useEffect(() => {
    setFileList(props?.files)
    if (props?.files?.length === 0) {
      setFileErrors([])
    }
  }, [props?.files])
  const addFileHandler = () => {
    document.getElementById('attachFile')!
    setMultiplePopup()
  }
  const checkFilesAlreadyExist = (newFiles: Array<File>): Array<string> => {
    const existingFiles: Array<string> = []
    newFiles.forEach((file: File) => {
      if (files?.filter((f: any) => (f?.name ? f?.name : f?.FileName) === file.name).length > 0) {
        existingFiles.push(file.name)
      }
    })
    return existingFiles
  }
  const validateFiles = (files: Array<File>): [boolean, Array<FileError>] => {
    let valid = true
    const errors: Array<FileError> = []
    files.forEach((file: File) => {
      const [fileValid, error] = validateFile(file, ACCEPTABLE_FILE_TYPES)
      if (!fileValid) {
        valid = false
        errors.push(...error)
      }
    })
    return [valid, errors]
  }
  const onRespondClick = (userDecision: string) => {
    let newFileItem: Array<File> = []
    if (userDecision === 'Replace') {
      setFiles((prevFiles: any[]) => prevFiles.filter((file: any) => !existingFiles?.includes(file?.name ? file?.name : file?.FileName))?.concat(validatedFiles))
      setFileList((prevFiles: any[]) => prevFiles.filter((file: any) => !existingFiles?.includes(file?.name ? file?.name : file?.FileName))?.concat(validatedFiles))
      setShowAlert(false)
    } else {
      newFileItem = validatedFiles?.filter((file: any) => !existingFiles?.includes(file?.name ? file?.name : file?.FileName))
      setFiles(files.concat(newFileItem))
      setFileList(files.concat(newFileItem))
      setShowAlert(false)
    }
  }
  const handleFileUploadChange = (e: any, type: 'Click' | 'Drag') => {
    e.preventDefault()
    setFileErrors([])
    let newFiles: Array<File> = Array.from(type === 'Click' ? e.target.files : e.dataTransfer.files)
    setNewFiles(newFiles)
    const [valid, errors] = validateFiles(newFiles)
    const validatedFiles = newFiles?.filter((newFile: any) => {
      return !errors.some(invalidFile => invalidFile.fileName === newFile.name)
    })
    setValidatedFiles(validatedFiles)
    const existingFiles: string[] = checkFilesAlreadyExist(validatedFiles)
    setExistingFiles(existingFiles)


    if (files.length > MAX_NUM_FILES || newFiles.length > MAX_NUM_FILES || newFiles.length + files.length > MAX_NUM_FILES) {
      setFileErrors(prevErrors => [...prevErrors, { fileName: 'Max file upload limit exceeded', message: `Maximum of ${MAX_NUM_FILES} files can be uploaded.` }])
      return
    }
    if (!valid) {
      errors.map((error: FileError) => setFileErrors(prevErrors => [...prevErrors, { fileName: error.fileName, message: error.message }]))
      newFiles = newFiles.filter((file: File) => !errors.map((error: FileError) => error.fileName).includes(file.name))
    }
    if (existingFiles.length > 0) {
      setShowAlert(true)
      return
    }
    if (newFiles.length > 0) {
      setFiles(files.concat(newFiles))
      setFileList(files.concat(newFiles))
    }
    if (props?.onFileChange) { props?.onFileChange(files.concat(newFiles)) }
    e.target.value = null
  }

  // triggers when file is selected with click
  const onFileDrop = (e: any) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileUploadChange(e, 'Click')
    }
    e.target.value = null
  }

  // triggers when file is dropped
  const handleDrop = (e: any) => {
    e.preventDefault()
    setDragActive(false)
     setMultiplePopup()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUploadChange(e, 'Drag')
    }
  }
  const handleDrag = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const onClickAlert = (file: any) => {
    setDeleteFile(file)
    setRemoveAlert(true)
  }

  const fileRemove = async (button: string) => {
    if (button === 'Yes' && deleteFile) {
      setRemoveAlert(false)
      if (!props?.disabled) {
        const updatedList = [...fileList]
        updatedList.splice(fileList.indexOf(deleteFile), 1)
        setFileList(updatedList)
        setFiles(updatedList) 
        if (updatedList?.length === 0 && props?.setFileError) {
          props?.setFileError(false)
        }
        if (props?.onFileChange) {
          props?.onFileChange(updatedList)
        }
        setDeleteFile(null)
      }
    } else {
      setRemoveAlert(false)
      setDeleteFile(null)
    }
  }
  return (
    <>
      <div className="attachments">
        <div className="formgroup">
          {props?.label && <InputLabel labelProps={{ htmlFor: props?.inputProps?.id }} label={props?.label} className={props?.inputProps?.className} infoLabel={props?.info} isinfoLabel={props?.isInfo} isinfoIcon={props?.infoIcon} isinfoClassName={props?.infoClassName} mandatory={props?.mandatory} />}
          <div id="form-file-upload" className="attachfile dropzonecontrol" tabIndex={0} aria-label="Attachment">
            <div ref={wrapperRef}
              className="drop-file-input"
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e)}
            >
            <label htmlFor="attachFile" className="choosebtn sourcesansprosemibold" >
            Drag/Choose file</label>
            <input type="file" name="attachFile" title="Drag/Choose file" id="attachFile"
              accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf,.png, .jpg, .jpeg,.gif, .msg"
              aria-label="Attach File" multiple onInput={onFileDrop} disabled={!!props?.disabled}/>
            {
              fileList?.length > 0
                ? (
                <div className="attachmentsdisplay">
                  <ul id="attachments" className="formattach">
                    {
                      fileList.map((item:any, index:number) => (
                        <li key={item.name}>
                          <div className="attachedfiles" title={item.name ? item.name : item.FileName} tabIndex={0} aria-label={item.name ? item.name : item.FileName}>{item.name || item.FileName}
                            <span className="icon-close" onClick={() => onClickAlert(item)} onKeyDown={(event) => {event.key ==='Enter' &&   onClickAlert(item)}} title='Close' tabIndex={0} aria-label="Close"></span>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                  )
                : null
            }
        
              {dragActive && <div id='drag-file-element' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
              <span id="docerrormsg" className='Spanerrormsgs'>
                {fileErrors && fileErrors?.length > 0 &&
                  <div className="error-list">
                    <span className="error-list-header">Errors:</span>
                    <div>
                      {fileErrors?.map((error: FileError, index: number) => (
                        <div key={index} className="error-item">
                          <div className="error-filename">{error.fileName}</div>
                          <div>{error.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              </span>
              {props?.error && props?.fileError && fileList?.length == 0 &&
                <div className="drop-file-input"><span id="docerrormsg" className="Spanerrormsgs" style={{ textAlign: 'left', verticalAlign: 'bottom' }}><p className="errormsg">Please Choose/Drag file(s) to upload.</p></span></div>}
            </div>
          </div>
                 </div>
        {props?.hint &&
          <span className="hintmsg font-12 font-13" tabIndex={0} aria-live='polite'>
            <span className={props?.hintClassName}>Hint:</span> {props?.hint}</span>
        }
        {props?.note &&
          <span className="hintmsg d-block font-13" tabIndex={0} aria-live='polite'>
            <span className={props?.noteClassName}>Note:</span> {props?.note}</span>
        }
      </div>
    {showAlert ?
        <Alert message={`File(s) with the name(s) ${existingFiles?.join(', ')} already exist. Do you want to replace them?`} yes = 'Replace' cancel='Cancel' className="alert-info"
        btn1iconclassNmae='icon-checked  font-12 pe-1'
        btn2iconclassNmae='icon-close  font-12 pe-1'
        btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
        btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs" onClick={onRespondClick} /> 
        : ''
     }
       {removeAlert && (
                <Alert message={`Are you sure you want to remove ${deleteFile?.name ? deleteFile?.name : deleteFile?.FileName}?`} yes='Yes' cancel='No' className="alert-info"
                  onClick={fileRemove}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn2iconclassNmae='icon-close  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                  btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
      
                />
              )}
    </>
  )
}
FileUpload.propTypes = {
  onFileChange: PropTypes.func
}
export default FileUpload
