/* eslint-disable no-loop-func */
import React, { useState, useRef } from 'react'
import readXlsxFile, { readSheetNames } from 'read-excel-file'
// components
import ExcelError from './excelError'
import { ExcelColumnData } from './excelParser.type'
import { excelColumnName, determineColumnHeaderRow } from './helperFunctions'
// styles
import { securityAPI } from '../../api'
import { useQueryClient } from 'react-query'

export const SecurityGroupExcelFileParser = () => {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>()
  const [excelErrors, setExcelErrors] = useState<string[] | null>(null)
  const [businessOwnergroups, setBusinessOwnerGroups] = useState<Array<any>>([])
  const [otherGroups, setOtherGroups] = useState<Array<any>>([])
  const [groups, setGroups] = useState<any[]>([])
  const [owGroups, setOWGroups] = useState<boolean>(false)
  const [currError, setCurrError] = useState<string | null>(null)
  const [complete, setComplete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // ref
  const inputFile = useRef<HTMLInputElement | null>(null)

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
    for (const sheetName of sheets) {
      await callParser(file, sheetName)
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
      for (const sheetName of sheets) {
        await callParser(file, sheetName)
      }
    }
  }

  const reset = async () => {
    setFile(null)
    setExcelErrors(null)
    setBusinessOwnerGroups([])
    setOtherGroups([])
    // setCurrGroup(null)
    setCurrError(null)
    setComplete(false)
    await delay(100)
  }

  const SITEGROUP_EXCEL_FILE_TABLE_HEADERS = {
    Title: 'Title',
    Description: 'Description',
    PermissionLevels: 'Permission Levels',
    ViewMembership: 'View Membership',
    EditMembership: 'Edit Membership',
    GroupOwners: 'Group Owners'
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

  const numColumns = Object.keys(SITEGROUP_EXCEL_FILE_TABLE_HEADERS).length // NUMBER OF COLUMNS IN EXCEL FILE

  const parsePermissionLevels = (permissionLevels: string): string[] => {
    // Remove spaces and split the string by commas
    const values = permissionLevels.replace(/\s/g, '').split(',')
    return values
  }

  const createSecurityGroupFromExcelData = (sheetName: string, rows: Array<Array<string>>) => {
    const groups: Array<any> = []
    // list of errors
    const errors: string[] = []
    // list of column indexes
    const columnIndexes: Array<ExcelColumnData> = []
    let tableStartRow = -1 // 'tables of interest' array start columns
    // `rows` is an array of rows, each row being an array of cells
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const rowData = rows[rowIndex]
      const excelRow = Number(rowIndex) + 1
      const groupModifiable: any = {}
      rowData.forEach((element: any, index: number) => {
        // return if no tables of interest
        if (element === null) {
          console.log('nothing')
        } else if (determineColumnHeaderRow(SITEGROUP_EXCEL_FILE_TABLE_HEADERS, rowData, index)) {
          for (let i = 0; i < numColumns; i++) {
            const columnName: string = rowData[index + i]
            const column: ExcelColumnData = {
              name: columnName,
              index: index + i
            }
            columnIndexes.push(column)
          }
          tableStartRow = rowIndex
        } else if (element !== null && rowIndex > tableStartRow) {
          const columnValue = excelColumnName(index)
          const excelColumn: ExcelColumnData = columnIndexes.filter((column: ExcelColumnData) => column.index === index)[0]
          if (excelColumn) {
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.Title) groupModifiable.Title = element
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.Description) groupModifiable.Description = element
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.PermissionLevels) groupModifiable.PermissionLevels = parsePermissionLevels(element)
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.ViewMembership) {
              if (element === 'Yes') groupModifiable.ViewMembership = true
              else if (element === 'No') groupModifiable.ViewMembership = false
              else errors.push(`Invalid input for Type View Membership:: Table ${sheetName}: row ${excelRow} column ${columnValue}`)
            }
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.EditMembership) {
              if (element === 'Yes') groupModifiable.EditMembership = true
              else if (element === 'No') groupModifiable.EditMembership = false
              else errors.push(`Invalid input for Type Edit Membership:: Table ${sheetName}: row ${excelRow} column ${columnValue}`)
            }
            if (excelColumn.name === SITEGROUP_EXCEL_FILE_TABLE_HEADERS.GroupOwners) groupModifiable.GroupOwners = element
          }
        }
      })
      // add group to list of groups
      if (groupModifiable.Title) groups.push(groupModifiable)
    }
    return {
      groups: groups,
      errors: errors
    }
  }

  const callParser = async (file: File, sheetName: string) => {
    readXlsxFile(file, { sheet: sheetName }).then(async (rows: any) => {
      const excelData = createSecurityGroupFromExcelData(sheetName, rows)
      if (excelData.errors.length > 0) {
        console.log(excelData.errors)
        setExcelErrors(excelData.errors)
      } else {
        const groups: Array<any> = excelData.groups
        if (sheetName === 'Business Owner Groups') {
          setBusinessOwnerGroups((prevGroups: Array<any>) => ([...prevGroups, ...groups]))
          setGroups((prevGroups: Array<any>) => ([...prevGroups, ...groups]))
        } else {
          setOtherGroups((prevGroups: Array<any>) => ([...prevGroups, ...groups]))
          setGroups((prevGroups: Array<any>) => ([...prevGroups, ...groups]))
        }
      }
    })
  }
  const queryClient = useQueryClient()
  const getUserData = () => {
    const userData: any = queryClient.getQueryData(['userLoginDetails'])
    return userData
  }
  const runSecurityGroupGenerator = async () => {
    const userData: any = getUserData()
    if (!userData?.userdetails) return
    setLoading(true)
    const businessOwnerGroup: any = businessOwnergroups[0]
    await securityAPI.createBusinessOwnerGroupFromExcelData(businessOwnerGroup, userData?.userdetails, owGroups)
    await delay(1000)
    await securityAPI.createOtherSecurityGroupsFromExcelData(businessOwnerGroup, otherGroups, userData?.userdetails, owGroups)
    setLoading(false)
    setComplete(true)
  }

  const renderGroups = () => {
    return groups.map((group: any, index: number) =>
            <React.Fragment key={index}>
                <div id='sharepointList'>
                    <p>{group.Title}</p>
                </div>
            </React.Fragment>
    )
  }

  const renderListOfErrors = (errors: Array<string>) => {
    return errors.map((error: string, index: number) =>
            <ExcelError errorString={error} key={index} />
    )
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
                    <p>Drop Security Group File here</p>
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
                                                      onClick={runSecurityGroupGenerator}
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
                                                    name="owLists"
                                                    value="overwriteLists"
                                                    id="owLists"
                                                    className='radioButton'
                                                    checked={owGroups}
                                                    onClick={(e: any) => { setOWGroups(!owGroups) }}
                                                    style={{minHeight:'15px'}}
                                                />
                                                <label htmlFor="owLists">Overwrite Existing Security Groups</label>
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
                            {(groups && groups.length > 0 && !complete) &&
                                <div id='excelListTable' className={currError ? 'errorBorder' : 'noErrorBorder'}>
                                    <p id='header' className={currError ? 'errorHeader' : 'noErrorHeader'}>🔒 Security Groups:</p>
                                    {renderGroups()}
                                    {currError &&
                                        (
                                            <div id='errorListingTable'>
                                                <div id='errorListing'><p>{currError}</p></div>
                                            </div>
                                        )
                                    }
                                </div>
                            }
                        </div>
                    </>
                }
            </div>
        </>
  )
}
