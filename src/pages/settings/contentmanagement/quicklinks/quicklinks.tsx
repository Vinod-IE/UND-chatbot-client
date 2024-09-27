/* eslint-disable camelcase */
import React, { useContext, useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { I_QuickLink } from '../../../../shared/interfaces'
import { useGetAllSettingsData, useGetQuickLinks } from '../../../../store/settings/hooks'
import { pnpDelete } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import Noresult from '../../../../components/noresult/noresult'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { useInfiniteScroll } from '../../../../shared/hooks/infiniteScroll'
import { DELETE_MSG, FetchStatus } from '../../../../configuration'
import { Link } from 'react-router-dom'
import Alert from '../../../../components/alert/alert'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const Settingsquicklinks = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(true)
  const popupScrollRef = useRef<any>(null)
  const [showAddPopup, setShowAddPopup] = useState(false)
  const quicklinks: Array<I_QuickLink> = useGetQuickLinks()
  const [quicklinksItems, setQuicklinksItems] = useState<any>([])
  const visibleRows = useInfiniteScroll('wrapper')
  const [showAlert, setShowAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const popupBodyRef = useRef<HTMLDivElement>(null)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const FetchDataStatus: any = useGetAllSettingsData()
  useEffect(() => {
    setQuicklinksItems(quicklinks)
    if(FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [quicklinks])
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    if ((showAddPopup || inEditMode) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
    setMultiplePopup()
  }, [showAddPopup, inEditMode])
  function addeditValue (showAddPopup:any) {
    setShowAddPopup(showAddPopup)
  }
  /* Function call on edit */
  const onEdit = (item:any) => {
    setShowAddPopup(false)
    setInEditMode({
      status: true,
      rowKey: item.ID
    })
  }

  /* Function call on cancel */
  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null
    })
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
      pnpDelete('QuickLinkList', deleteItem).then(async () => {
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
  return (<>
    {loading
      ? <PageOverlay />
      : <div className='row m-0'>
                    <div className='mt-0 p-0 d-flex align-items-center tabsheads p-absolute'>
                        <h2 tabIndex={0} aria-label='QUICK LINKS' className='font-16'>QUICK LINKS</h2>
                        <Buttons
                            label="ADD"
                            aria-label="Add"
                            icon="icon-add me-1"
                            className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius'
                            onClick={() => {
                              setShowAddPopup(!showAddPopup)
                              setInEditMode({
                                status: false,
                                rowKey: null
                              })
                            }}
                        />
                    </div>
                    {showAlert && (
                <Alert message={DELETE_MSG} yes='Yes' cancel='No' className="alert-info"
                  onClick={onClickAlert}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn2iconclassNmae='icon-close  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                  btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
      
                />
              )}
                    <div className='p-0 settings-main'>
                        {showAddPopup && (
                            <AddeditView showAddPopup={showAddPopup} filtersvalue={addeditValue}  showedit={addeditValue} popupBodyRef={popupBodyRef}  deleteItem={deleteItem}  />
                        )}
                        {quicklinksItems?.length > 0 && quicklinksItems?.slice(0, visibleRows)?.map((quicklinkslist : any) =>
                            <div className="d-flex flex-column shadow card segoeui-regular mb-2 p-2" key={quicklinkslist.ID}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100'>
                                    <div className="d-flex flex-column text-break w-100 min-w-md-200 max-w-md-200 max-w-xxl-400 min-w-xxl-400" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Name</span>
                                            <span>{quicklinkslist.Title}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column me-auto text-wrap breakall" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>URL</span>
                                            <a
                                            href={quicklinkslist?.URL}
                                            className="color-primary segoeui-semibold links-over-underline"
                                            target='_blank' rel="noreferrer"
                                        >
                                            {quicklinkslist?.URL}
                                        </a>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column text-nowrap w-100 min-w-md-80 max-w-md-80 text-break" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Is Archived</span>
                                            <span>{quicklinkslist.IsArchived ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex gap-1 settings-actionbtns'>
                                            <Buttons
                                                label="Edit"
                                                aria-label="Edit"
                                                icon="icon-pencil me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => { onEdit(quicklinkslist)
                                                }}
                                               
                                            />
                                            <Buttons
                                                label="Delete"
                                                aria-label="Delete"
                                                icon="icon-delete me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onDelete(quicklinkslist)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inEditMode.status && inEditMode.rowKey === quicklinkslist.ID && !showAddPopup
                                  ? (     <AddeditView cancel={() => onCancel()} details={quicklinkslist} showAddPopup={showAddPopup} filtersvalue={addeditValue}  showedit={!showAddPopup} popupScrollRef={popupScrollRef} popupBodyRef={popupBodyRef}/>
                                  
                                    )
                                  : ''}
                            </div>
                        )}
                        {quicklinksItems?.length === 0 && !showAddPopup && <div className='min-h-200 d-flex align-items-center justify-content-around'>
                        <Noresult />
                                </div>}
                    </div>
                </div>
}</>
  )
}
export default Settingsquicklinks
