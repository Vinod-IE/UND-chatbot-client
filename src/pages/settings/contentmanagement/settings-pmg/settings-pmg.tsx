/* eslint-disable camelcase */
import React, { useContext, useEffect, useRef, useState } from 'react'
import Accordions from '../../../../components/accordions/accordions'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { convertDate } from '../../../../Global'
import { DELETE_MSG, FetchStatus, ListNames } from '../../../../configuration'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { getAllSettings } from '../../../../store/settings/reducer'
import { useGetAllSettingsData, useGetPolicyMemo } from '../../../../store/settings/hooks'
import { I_PolicyMemo } from '../../../../shared/interfaces'
import PmgData from './pmgdata'
import { sp } from '@pnp/sp'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import Alert from '../../../../components/alert/alert'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const SettingsPMG = (props:any) => {
  const accordionitems : any[] = []
  const folderNamesArray : any[] = []
  const filesitems : any[] = []
  const dispatch = useDispatch<AppDispatch>()
  const [showedit, setShowedit] = useState(false)
  const [showAddPopup, setshowAddPopup] = useState(false)
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [addFolderFile, setAddFolderFile] = useState(false)
  const [addFile, setAddFile] = useState(false)
  const [addFolder, setAddFolder] = useState(false)
  const [editFolder, setEditFolder] = useState(false)
  const [folderName, setFolderName] = useState<string>()
  const policymemo: Array<I_PolicyMemo> = useGetPolicyMemo()
  const [policyMemoItems, setPolicyMemoItems] = useState<any>([])
  const [accordionsArray, setAccordionsArray] = useState<any>([])
  const [folderNames, setFolderNames] = useState<any>([])
  const [filesArray, setFilesArray] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [deleteItem, setDeleteItem] = useState<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const popupBodyRef = useRef <HTMLDivElement>(null)
  const FetchDataStatus: any = useGetAllSettingsData()
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  useEffect(() => {
    setPolicyMemoItems(policymemo)
    dataArray(policymemo)
    if(FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [policymemo])
  useEffect(() => {
    if ((showAddPopup || editFolder || showAddEdit || folderName || addFile  ) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
    setMultiplePopup()
  }, [showAddPopup, editFolder,showAddEdit,folderName,addFile])
  function addeditValue (showAddPopup:any) {
    setshowAddPopup(showAddPopup)
    setShowAddEdit(false)
    setEditFolder(false)
    setAddFolderFile(false)
    setAddFolder(false)
    setAddFile(false)
  }
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  function dataArray (policyMemoItems: any) {
    policyMemoItems?.map((policymemoList: any) => {
      if (policymemoList?.Files && policymemoList?.Name !== 'Forms') {
        accordionitems.push({
          ID: policymemoList?.UniqueId,
          Id: policymemoList?.UniqueId,
          Templates: policymemoList?.Name,
          Created: policymemoList?.ListItemAllFields?.FieldValuesAsText?.Author + ' | ' + convertDate(policymemoList?.TimeCreated, 'date'),
          Modified: policymemoList?.ListItemAllFields?.FieldValuesAsText?.Editor + ' | ' + convertDate(policymemoList?.TimeLastModified, 'date'),
          Files: policymemoList?.Files,
          'Is Archived': ''
        })
        folderNamesArray.push({
          folderName: policymemoList?.Name
        })
      } else if (policymemoList?.Name !== 'Forms') {
        filesitems.push(policymemoList)
      }
    })
    filesitems?.sort((a: any, b: any) => a?.Name?.localeCompare(b?.Name))
    setFilesArray(filesitems)
    if (!Array.isArray(accordionitems)) {
      return null
    }
    accordionitems.forEach((item: any) => {
      if (item && Array.isArray(item.Files)) {
        const filesList = [...item.Files]
        filesList.sort((a: any, b: any) => a?.Name?.localeCompare(b?.Name))
        item.Files = filesList
      }
    })
    accordionitems?.sort((a: any, b: any) => a?.Templates?.localeCompare(b?.Templates))
    setAccordionsArray(accordionitems)
    setFolderNames(folderNamesArray)
  }
  function acordioncontent (list: any, clickedIndex : any) {
    return (
      <PmgData list={list} showAddEdit={true} filtersvalue={addeditValue} addFile={addFile} addFolder={addFolder} addFolderFile = {addFolderFile} folderClose={addFolderClick} folderName = {folderName} editFolder = {editFolder} details={accordionsArray} folderNames={folderNames} popupBodyRef={popupBodyRef} setEditFolder={setEditFolder}/>
    )
  }
  const onEdit = (item:any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: true,
      rowKey: item.Id
    })
    setFolderName(item?.Templates)
    setShowAddEdit(false)
    setEditFolder(true)
    dataArray(policyMemoItems)
    setAddFile(false)
    setAddFolder(false)
    setAddFolderFile(false)
  }
  const onAccourdian = (item:any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: false,
      rowKey: null
    })
    dataArray(policyMemoItems)
  }
  const onDelete = (item:any) => {
    setDeleteItem(item)
    setShowAlert(true) 
    setMultiplePopup()

  }
const onClickAlert = async (button: string) => {
  if (button === 'Yes') {
    setShowAlert(false)
    if (deleteItem) {
      setLoading(true)
      const list = sp.web.getFolderByServerRelativeUrl(ListNames?.POLICY_MEMO)
      list.folders.getByName(deleteItem?.Templates).delete().then(async function () {
        await dispatch(getAllSettings({ name: '' }))
        setLoading(false)
      })
      setDeleteItem(null)
    }
  } else {
    setShowAlert(false)
    setDeleteItem(null)
  }
}
  const addFolderClick = (value: any) => {
    setShowAddEdit(!value)
    setAddFolder(!value)
  }
  const onAdd = (item:any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: true,
      rowKey: item
    })
    setShowAddEdit(false)
    setAddFile(false)
    setAddFolder(false)
    setFolderName(item?.Templates)
    setAddFolderFile(true)
    dataArray(policyMemoItems)
    setEditFolder(false)
  }
  function showEditPopup (ele: any) {
    setShowedit(ele)
  }

  return (
    <>
    {loading
      ? <PageOverlay />
      : <div className='row m-0'>
      <div className='mt-0 p-0 d-flex align-items-center flex-wrap tabsheads p-absolute'>
        <h2 tabIndex={0} aria-label='POLICY MEMOS & GUIDELINES'>POLICY MEMOS & GUIDELINES</h2>
        <div className='ms-auto d-flex gap-1'>
          <Buttons
            label="ADD FILE"
            aria-label="Add File"
            icon="icon-add me-1"
            className='btn-sm btn-primary whitetext text-nowrap border-radius'
            onClick={() => {
              setShowAddEdit(true)
              setAddFile(true)
              setAddFolder(false)
              setEditFolder(false)
              setAddFolderFile(false)
              setFolderName('')
            }}
          />
          <Buttons
            label="ADD FOLDER"
            aria-label="Add Folder"
            icon="icon-add me-1"
            className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius'
            onClick={() => {
              setShowAddEdit(true)
              setAddFolder(true)
              setAddFile(false)
              setEditFolder(false)
              setAddFolderFile(false)
              setFolderName('')
            }}
          />
        </div>
      </div>
      <div className='p-0 settings-main'>
        {showAddEdit && (
          <AddeditView showAddEdit={showAddEdit} filtersvalue={addeditValue} addFile={addFile} addFolder={addFolder} addFolderFile = {addFolderFile} folderClose={addFolderClick} folderName = {folderName} editFolder = {editFolder} details={accordionsArray} folderNames={folderNames} popupBodyRef={popupBodyRef}/>
        )}
        {accordionsArray.length > 0 &&
        <Accordions
          items={accordionsArray}
          renderHtml = {accordionsArray.length > 0 ? acordioncontent : ''}
          isSettings = {true}
          headerextras={[{ name: 'Templates', classq: 'me-auto text-break' }, { name: 'Created', classq: 'text-break w-100 min-w-md-150 max-w-md-150' }, { name: 'Modified', classq: 'text-break w-100 min-w-md-150 max-w-md-150' }]
          }
          className="accordions py-2"
          accordionitemclass=" shadow card mb-2"
          titleIcon="icon-open-folder font-16 color-primary pe-2"
          titlecollapsedIcon="icon-close-folder pe-2 font-16 color-primary"
          titleclassName="subtitle-color font-12"
          titlecontentclassName="darktext pe-2"
          defaultActivekey='1'
          dividerClass="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"
          extrasClass="d-flex flex-column align-items-center flex-md-row flex-nowrap w-100 last-child-hide"
          actionbuttons="settings-actionbtns mx-2 mx-xxl-3"
          count="bordered px-1 ms-1 border-radius"
          inputProps={{
            className: 'justify-content-start segoeui-regular font-13 w-100 p-0',
            accordionheadClass: 'd-flex align-items-start p-2',
            contentclassName: 'p-0'
          }}
          IsEdit= {showEditPopup}
          ItemId= {inEditMode?.rowKey}
          dataobj={onAccourdian}
          actions={
            [{
              label: 'Edit',
              alabel: 'Edit',
              icon: 'icon-pencil me-xxl-1 font-11',
              className: 'btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
              onClick: onEdit
            },
            {
              label: 'Delete',
              alabel: 'Delete',
              icon: 'icon-delete me-xxl-1 font-11',
              className: 'btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
              onClick: onDelete
            },
            {
              label: 'Add',
              alabel: 'Add',
              icon: 'icon-add me-xxl-1 font-11',
              className: 'btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
              onClick: onAdd
            }]
          }
        />}
               {showAlert && (
                <Alert message={DELETE_MSG} yes='Yes' cancel='No' className="alert-info"
                  onClick={onClickAlert}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn2iconclassNmae='icon-close  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                  btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
      
                />
              )}
         <PmgData files={filesArray} folder={accordionsArray} addFile={addFile} addFolder={addFolder}  popupBodyRef={popupBodyRef} setEditFolder={setEditFolder} editFileItem={true} setInEditMode={setInEditMode}/>
      </div>
    </div>
}
</>
  )
}
export default SettingsPMG
