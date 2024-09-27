import React, { useContext, useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import Noresult from '../../../../components/noresult/noresult'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { getAllSettings } from '../../../../store/settings/reducer'
import { DELETE_MSG, ListNames } from '../../../../configuration'
import { sp } from '@pnp/sp'
import { DocumentIconNames, convertDate } from '../../../../Global'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import Alert from '../../../../components/alert/alert'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const PmgData = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [editFile, setEditFile] = useState(false)
  const [editFileName, setEditFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState<any>(null)
  const popupBodyRef = useRef<HTMLDivElement> (null)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const fileItems = props?.list?.Files?.results ? props?.list?.Files?.results : props?.list?.Files
  function addeditValue (showAddPopup:any) {
    setShowAddPopup(showAddPopup)
  }
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    if ((showAddPopup || editFileName || editFile || props?.editFolder) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
    setMultiplePopup()
  }, [showAddPopup, editFileName, editFile, props?.editFolder])
  /* Function call on edit */
  const onEdit = (item:any) => {
    setInEditMode({
      status: true,
      rowKey: item.UniqueId
    })
    setEditFile(true)
    setEditFileName(item.Name)
    props?.setEditFolder(false)
    props?.editFileItem && props?.setInEditMode({status: false,
      rowKey: null})
  }
  /* Function call on cancel */
  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null
    })
    setEditFile(false)
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
      let list
      if (props?.list) {
        list = sp.web.getFolderByServerRelativeUrl(ListNames?.POLICY_MEMO + '/' + props?.list?.Templates)
      } else {
        list = sp.web.getFolderByServerRelativeUrl(ListNames?.POLICY_MEMO)
      }
      await list.files.getByName(deleteItem?.Name).delete().then(async function () {
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
  return (
          <>
            {loading
              ? <PageOverlay />
              : <div className='container'>
            <div className='row m-0'>
                    <div className='p-0 settings-main'>
                    {(props?.addFolderFile || props?.editFolder) && props?.list?.Templates === props?.folderName
                      ? (
                                        <AddeditView cancel={() => onCancel()} filtersvalue={props?.filtersvalue} addFile={props?.addFile} addFolder={props?.addFolder} addFolderFile = {props?.addFolderFile} folderClose={props?.addFolderClick} folderName = {props?.folderName} editFolder = {props?.editFolder} details={props?.accordionsArray} folderNames={props?.folderNames}  popupBodyRef={popupBodyRef}/>
                        )
                      : ''}
                    {fileItems?.length > 0
                      ? fileItems?.map((poclist : any) =>
                            <div className="d-flex flex-column shadow card mb-2 p-2" key={poclist.Name}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100'>
                                        <div className="d-flex  align-items-center me-auto  text-break">
                                            <span className={`${DocumentIconNames(poclist.Name)} pe-1 font-14`}></span>
                                            <span> <a  className='links-over-underline links' href={poclist?.ServerRelativeUrl} download>{poclist.Name}</a></span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column  min-w-150 w-100 max-w-150">
                                            <span className='subtitle-color font-12'>Created</span>
                                            <span>{poclist?.Author && poclist?.Author?.Title + ' | ' + convertDate(poclist?.TimeCreated, 'date')}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column  min-w-150 w-100 max-w-150">
                                            <span className='subtitle-color font-12'>Modified</span>
                                            <span>{poclist?.ModifiedBy && poclist?.ModifiedBy?.Title + ' | ' + convertDate(poclist?.TimeLastModified, 'date')}</span>
                                        </div>
                                        <div className="dividerdashed vertical ms-2 ms-xxl-3 d-none d-md-block"></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex gap-1 settings-actionbtns ms-2 ms-xxl-3'>
                                            <Buttons
                                                label="Edit"
                                                aria-label="Edit"
                                                icon="icon-pencil me-xxl-1 font-11"
                                                className='btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onEdit(poclist)}
                                                value= {poclist?.Name}
                                            />
                                            <Buttons
                                                label="Delete"
                                                aria-label="Delete"
                                                icon="icon-delete me-xxl-1 font-11"
                                                className='btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onDelete(poclist)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inEditMode.status && inEditMode.rowKey === poclist.UniqueId
                                  ? (
                                        <AddeditView cancel={() => onCancel()} filtersvalue = {addeditValue} showAddEdit={showAddPopup} folderName = {editFileName} editFile={editFile} details={props?.list} popupBodyRef={popupBodyRef} />
                                    )
                                  : ''}
                            </div>
                      )
                      : fileItems?.length === 0 && !props?.addFolderFile && !props?.editFolder
                        ? <div className="min-h-200 d-flex align-items-center justify-content-around">
                        <Noresult />
                        </div>
                        : ''}
                         {props?.files?.map((poclist : any) =>
                            <div className="d-flex flex-column shadow card mb-2 p-2" key={poclist.Name}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100'>
                                        <div className="d-flex  align-items-center me-auto text-break">
                                            <span className={`${DocumentIconNames(poclist.Name)} pe-1 font-14`}></span>
                                            <span> <a  className='links-over-underline links' href={poclist?.ServerRelativeUrl} download>{poclist.Name}</a></span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column min-w-100 w-100 max-w-200 text-break">
                                            <span className='subtitle-color font-12'>Created</span>
                                            <span>{poclist?.Author?.Title + ' | ' + convertDate(poclist?.TimeCreated, 'date')}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column min-w-100 w-100 max-w-200 text-break">
                                            <span className='subtitle-color font-12'>Modified</span>
                                            <span>{poclist?.ListItemAllFields?.FieldValuesAsText?.Editor + ' | ' + convertDate(poclist?.TimeLastModified, 'date')}</span>
                                        </div>
                                        <div className="dividerdashed vertical me-2 me-xxl-3 d-none d-md-block"></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex gap-1 settings-actionbtns me-2 me-xxl-3'>
                                            <Buttons
                                                label="Edit"
                                                aria-label="Edit"
                                                icon="icon-pencil me-xxl-1 font-11"
                                                className='btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onEdit(poclist)}
                                                value= {poclist?.Name}
                                            />
                                            <Buttons
                                                label="Delete"
                                                aria-label="Delete"
                                                icon="icon-delete me-xxl-1 font-11"
                                                className='btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onDelete(poclist)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inEditMode.status && inEditMode.rowKey === poclist.UniqueId
                                  ? (
                                        <AddeditView cancel={() => onCancel()} filtersvalue = {addeditValue} showAddEdit={showAddPopup} folderName = {editFileName} editFile={editFile} details={props?.files} popupBodyRef={popupBodyRef}/>
                                    )
                                  : ''}
                            </div>
                         )}
                          {(props?.folder?.length === 0 && props?.files?.length === 0  && !props.addFile && !props.addFolder) && <div className='min-h-200 d-flex align-items-center justify-content-around'>
                          <Noresult />
                                </div>}
                    </div>
                </div>
            </div>}
            {showAlert && (
                <Alert message={DELETE_MSG} yes='Yes' cancel='No' className="alert-info"
                  onClick={onClickAlert}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn2iconclassNmae='icon-close  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                  btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
      
                />
              )}
            </>
  )
}
export default PmgData
