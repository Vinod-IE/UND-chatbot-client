/* eslint-disable camelcase */
import React, { useContext, useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { pnpDelete, formatPhoneNumber } from '../../../../Global'
import Noresult from '../../../../components/noresult/noresult'
import { useGetAllSettingsData, useGetPOCs } from '../../../../store/settings/hooks'
import { I_PointOfContact } from '../../../../shared/interfaces'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { DELETE_MSG, FetchStatus, ListNames } from '../../../../configuration'
import { useInfiniteScroll } from '../../../../shared/hooks/infiniteScroll'
import Alert from '../../../../components/alert/alert'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const Settingspoc = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState(false)
  const pocs: Array<I_PointOfContact> = useGetPOCs()
  const visibleRows = useInfiniteScroll('wrapper')
  const FetchDataStatus: any = useGetAllSettingsData()
  const [showAlert, setShowAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const popupBodyRef = useRef<HTMLDivElement>(null)
  const [pocItems, setPOCItems] = useState<any>([])
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    setPOCItems(pocs)
    if(FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [pocs])
  useEffect(() => {
    if ((showAddPopup || inEditMode) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input,  select, textarea, [tabindex]:not([tabindex="-1"])'
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
    setPeople(false)
    setInEditMode({
      status: true,
      rowKey: item.Id
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
      pnpDelete(ListNames?.POINT_OF_CONTACT, deleteItem).then(async () => {
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
  /* Function call on cancel */
  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null
    })
  }

  return (
    <>
    {loading
      ? <PageOverlay />
      : <div className='row m-0'>
                    <div className='mt-0 p-0 d-flex tabsheads p-absolute'>
                        <h2 tabIndex={0} aria-label='POINTS OF CONTACT'>POINTS OF CONTACT</h2>
                        <Buttons
                            type="button"
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
                              setPeople(true)
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
                            <AddeditView  filtersvalue={addeditValue} refetch= {'refetch'} people= {people}    popupBodyRef={popupBodyRef} showAddPopup={showAddPopup} inEditMode={inEditMode}/>
                        )}
                        {pocItems?.length > 0 && pocItems?.slice(0, visibleRows)?.map((poclist: any) =>
                            <div className="d-flex flex-column shadow card mb-2 p-2" key={poclist.ContactName}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100' tabIndex={0} aria-live='polite'>
                                        <div className="d-flex flex-column me-auto">
                                            <span className='subtitle-color font-10'>Name</span>
                                            <span>{poclist.ContactName}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column min-w-100 w-100 max-w-200" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-10'>Phone Number</span>
                                            <span>{formatPhoneNumber(poclist.ContactPhone)}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column w-100 max-w-80" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-10'>Is Archived</span>
                                            <span>{poclist.IsArchived ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex gap-1 settings-actionbtns'>
                                            <Buttons
                                                type= "button"
                                                label="Edit"
                                                aria-label="Edit"
                                                icon="icon-pencil me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onEdit(poclist)}
                                            />
                                            <Buttons
                                                label="Delete"
                                                aria-label="Delete"
                                                icon="icon-delete me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onDelete(poclist)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inEditMode.status && inEditMode.rowKey === poclist.ID && !showAddPopup
                                  ? (
                                        <AddeditView cancel={() => onCancel()} details={poclist} filtersvalue={addeditValue} refetch= {'refetch'} people={people} setPeople={setPeople}  popupBodyRef={popupBodyRef} showAddPopup={showAddPopup} inEditMode={inEditMode} />
                                    )
                                  : ''}
                            </div>
                        )}
                        {pocItems?.length === 0 && !showAddPopup && <div className='min-h-200 d-flex align-items-center justify-content-around'>
                        <Noresult />
                                </div>}
                    </div>
                </div>
}
</>
  )
}
export default Settingspoc
