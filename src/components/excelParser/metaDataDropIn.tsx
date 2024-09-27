/* eslint-disable no-loop-func */
import React, { useState, useRef, useEffect } from 'react'
import readXlsxFile, { readSheetNames } from 'read-excel-file'
// components
import ExcelError from './excelError'
// styles
import { useQueryClient } from 'react-query'
import { addOrReplaceDataInListBatch } from '../../api/helpers'
import { ThreeDots } from 'react-loader-spinner'
import Alert from '../alert/alert'
import { COMPLETED_MESSAGE,  OVERRIDE_METADATA } from '../../configuration'

export const MetaDataDropIn = () => {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>()
  const [excelErrors, setExcelErrors] = useState<string[] | null>(null)
  const [currError, setCurrError] = useState<string | null>(null)
  const [complete, setComplete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [metaData, setMetaData] = useState<any>([])
  const [userData, setUserData] = useState<any>()
  const [sheetNames, setSheetNames] = useState<string[]>()
  const [owMetaData, setOWMetaData] = useState<boolean>(false)
  const [currentList, setCurrentList] = useState<string | null>(null)
  const [completedLists, setCompletedLists] = useState<string[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [fileAlert, setFileAlert] = useState(false)
  // ref
  const inputFile = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()
  const getUserData = () => {
    const userData: any = queryClient.getQueryData(['userLoginDetails'])
    return userData
  }
  const loginUserDetails = getUserData()
  useEffect(() => {
    setUserData(loginUserDetails?.userdetails)
  }, [loginUserDetails])
  // drag handlers
  const handleDragEnter = (e: any) => {
    e.preventDefault()
    setDragging(true)
  }
  const handleDragOver = (e: any) => {
    e.preventDefault()
  }
  const handleDragLeave = () => {
    setDragging(false)
  }
  const handleDrop = async (e: any) => {
    e.preventDefault()
    await reset()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    checkFileType(file)
    setFile(file)
    const sheets: Array<string> = await readSheetNames(file)
    setSheetNames(sheets)
    const itemMetadata = createRandomItemMetadata()
    for (const sheetName of sheets) {
      await callParser(file, sheetName, itemMetadata)
    }
  }
  // upload handlers
  const handleClick = (e: any) => {
    e.preventDefault()
    inputFile.current?.click()
  }
  const handleFileUpload = async (e: any) => {
    await reset()
    const { files } = e.target
    if (files && files.length) {
      const file = files[0]
      checkFileType(file)
      setFile(file)
      const sheets: Array<string> = await readSheetNames(file)
      setSheetNames(sheets)
      const itemMetadata = createRandomItemMetadata()
      for (const sheetName of sheets) {
        await callParser(file, sheetName, itemMetadata)
      }
    }
  }
  const reset = async () => {
    setFile(null)
    setExcelErrors(null)
    setMetaData([])
    setOWMetaData(false)
    setCurrError(null)
    setComplete(false)
    await delay(100)
  }
  const delay = (ms: number) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
  }
  const checkFileType = (file: File) => {
    const filename = file.name
    const parts = filename.split('.')
    const fileType = parts[parts.length - 1]
    if (fileType !== 'xlsx') {
      alert('File type not accepted')
    }
  }
  const createRandomItemMetadata = () => {
    return {
      ItemCreated: new Date().toISOString(),
      ItemCreatedById: userData?.Id,
      ItemModified: new Date().toISOString(),
      ItemModifiedById: userData?.Id
    }
  }
  const callParser = async (file: File, sheetName: string, itemMetadata: any) => {
    readXlsxFile(file, { sheet: sheetName }).then(async (rows: any) => {
      const listData = convertArrayToObject(sheetName, rows, itemMetadata)
      setMetaData((prevMetadata: any) => ({
        ...prevMetadata,
        ...listData
      }))
    })
  }
  const convertArrayToObject = (sheetName: string, inputArray: any, itemMetaData: any) => {
    const keys = inputArray[0]
    const result: any = []
    for (let i = 1; i < inputArray.length; i++) {
      const values = inputArray[i]
      const obj: any = {}
      for (let j = 0; j < keys.length; j++) {
        obj[keys[j]] = values[j]
      }
      result.push({ ...obj, ...itemMetaData })
    }
    return { [sheetName]: result }
  }
  const runMetaDataGenerator = async (showAlert?: boolean) => {
    if (!userData) return
    if (!sheetNames) return
    if (owMetaData && showAlert) {
      setShowAlert(true)
      return
    }
    if (!showAlert) {
      setLoading(true)
      for (const sheetname of sheetNames) {
        setCurrentList(sheetname)
        await addOrReplaceDataInListBatch(sheetname, metaData[sheetname], userData, owMetaData)
        setCompletedLists((prevList: any) => [...prevList, sheetname])
      }
      setLoading(false)
      setComplete(true)
      setCurrentList('')
      setOWMetaData(false)
    }
  }
  const renderListOfErrors = (errors: Array<string>) => {
    return errors.map((error: string, index: number) =>
      <ExcelError errorString={error} key={index} />
    )
  }
  const onRespondClick = async (button: string) => {
    if (button === 'Yes') {
      setShowAlert(false)
      await runMetaDataGenerator(false)
    } else {
      setShowAlert(false)
    }
  }
  return (
    <>
      <div
        className={`file-dropzone ${dragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div id='drop-text'>
          <p>Drop Meatadata File here</p>
        </div>
        <div id='divide-upload'>
          <hr className='divide-upload-section' id='solid-divider'></hr>
          <p className='divide-upload-section' id='divider-text'>OR</p>
          <hr className='divide-upload-section' id='solid-divider'></hr>
        </div>
        <div onClick={handleClick} id='file-click'>
          <div id='file-click-button'>
            <p>Click to upload</p>
          </div>
        </div>
        <input
          ref={inputFile}
          style={{ display: 'none' }}
          accept='.xlsx'
          onChange={handleFileUpload}
          type='file'
        />
      </div>
      <div className='parsed-file-section'>
        {file &&
          <>
            <div className='fileDetailSection'>
              <div id='fileDetail'>
                <div id='fileDetailIcon' className={`${complete ? 'fileSuccess' : (excelErrors || currError) ? 'fileError' : loading ? 'fileLoading' : 'fileStatic'}`}>
                  {!complete &&
                    <>
                      {loading
                        ? <span id='loadingIcon'></span>
                        : <>
                          {(excelErrors || currError)
                            ? <span id='errorIcon'>✕</span>
                            : <span id='playIcon'
                              onClick={() => runMetaDataGenerator(owMetaData ? true : false)}
                            >▶</span>
                          }
                        </>
                      }
                    </>
                  }
                  {complete &&
                    <span id='completeIcon'>✓</span>
                  }
                </div>
                <div id='fileExtraInfo'>
                  <div id='fileName' className={complete || loading || (excelErrors || currError) ? '' : 'extraSpace'}>
                    <p>{file.name}</p>
                  </div>
                  {complete || loading || (excelErrors || currError)
                    ? <></>
                    : <div id='fileButtons'>
                      <div>
                        <input
                          type="radio"
                          name="owMetaData"
                          value="overwriteMetaData"
                          id="owMetaData"
                          className='radioButton'
                          checked={owMetaData}
                          onClick={(e: any) => { setOWMetaData(true) }}
                          style={{ minHeight: '15px' }}
                        />
                        <label htmlFor="owMetaData">Override</label>
                      </div>
                    </div>
                  }
                </div>
              </div>
              {(excelErrors && excelErrors.length > 0) &&
                <div className='excelErrorTable'>
                  <p id='header'>⚠ Errors:</p>
                  {renderListOfErrors(excelErrors)}
                </div>
              }
              {completedLists && completedLists?.length > 0 && <div id='excelListTable' className={currError ? 'errorBorder' : 'noErrorBorder'}>
                {completedLists?.map((list, i) =>
                  <div className='metadatalist' key={i}>
                    {list}
                  </div>
                )}
              </div>}
              {currentList && (
                <div className='currentlist'>
                  {currentList}
                  <div className='ms-2'>
                    <ThreeDots
                      height="60"
                      width="80"
                      radius="9"
                      color="#fff"
                      ariaLabel="three-dots-loading"
                      visible={true}
                    />
                  </div>
                </div>)}
              {complete && (
                <div className='completemsg'>
                  {COMPLETED_MESSAGE}
                </div>)}
            </div>
          </>
        }
      </div>
      {showAlert ?
        <Alert message={OVERRIDE_METADATA} yes='Yes' cancel='No' className="alert-info"
          btn1iconclassNmae='icon-checked  font-12 pe-1'
          btn2iconclassNmae='icon-close  font-12 pe-1'
          btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
          btn2classNmae="btn-border-radius3 px-2 btn-bgcolor5 darktext segoeui-regular font-12 text-uppercase btn-xs" onClick={onRespondClick} />
        : ''
      }
    </>
  )
}
