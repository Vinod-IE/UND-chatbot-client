/* eslint-disable camelcase */
import React, { useContext, useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { pnpDelete } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import { AppDispatch } from '../../../../store'
import { useDispatch } from 'react-redux'
import { DELETE_MSG, FetchStatus, NORESULT } from '../../../../configuration'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { I_SiteFeedbackAbout } from '../../../../shared/interfaces/Settings.interface'
import { useGetAllSettingsData, useGetFeedbackAbout } from '../../../../store/settings/hooks'
import Alert from '../../../../components/alert/alert'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'

const SiteFeedbackAbout = (props:any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(true)
  const [showAddPopup, setShowAddPopup] = useState(false)
  const popupBodyRef =useRef <HTMLDivElement>(null)
  const feedbackAbout: Array<I_SiteFeedbackAbout> = useGetFeedbackAbout()
  const [feedbackAboutItems, setFeedbackAboutItems] = useState<any>([])
  const [showAlert, setShowAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const FetchDataStatus: any = useGetAllSettingsData()
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  useEffect(() => {
    setFeedbackAboutItems(feedbackAbout)
    if(FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [feedbackAbout])
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    if ((showAddPopup || inEditMode ) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
    setMultiplePopup()
  }, [showAddPopup,inEditMode])
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
      pnpDelete('FeedbackAboutMetadata', deleteItem).then(async () => {
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
      : <div className='row' >
                    <div className='mt-0 p-0 d-flex align-items-center tabsheads p-absolute'>
                        <h2 tabIndex={0} aria-label='Site Feedback About'>SITE FEEDBACK ABOUT</h2>
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
                    <div className='p-0 settings-main'>

                        {showAddPopup && (
                            <AddeditView feedbackAboutItems={feedbackAboutItems} showAddPopup={showAddPopup} filtersvalue={addeditValue}  popupBodyRef={popupBodyRef}/>
                        )}
                        <div className='mt-2'>
                        {feedbackAboutItems.map((item : any) =>
                            <div className="d-flex flex-column shadow card segoeui-regular mb-2 p-2" key={item.ID}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100'>
                                        <div className="d-flex flex-column me-auto w-100 max-w-200" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color1 font-12'>Title</span>
                                            <span className='line-clapm2'>{item.Title}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column min-w-100  w-100 max-w-80" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color1 font-12'>Is Archived</span>
                                            <span>{item.IsArchived ? 'Yes' : 'No'}</span>
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
                                                onClick={() => onEdit(item)}
                                            />
                                            <Buttons
                                                label="Delete"
                                                aria-label="Delete"
                                                icon="icon-delete me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onDelete(item)}
                                            />
                                        </div>
                                    </div>
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
                                {inEditMode.status && inEditMode.rowKey === item.ID && !showAddPopup
                                  ? (
                                        <AddeditView feedbackAboutItems={feedbackAboutItems} cancel={() => onCancel()} details={item} showAddPopup={showAddPopup} filtersvalue={addeditValue}  popupBodyRef={popupBodyRef}/>
                                    )
                                  : ''}
                            </div>
                        )}
                        </div>
                        {feedbackAboutItems?.length === 0 && <div className='min-h-200 d-flex align-items-center justify-content-around'>
                                    <div className='subtitle-color montserratregular' tabIndex={0} aria-label={NORESULT}>{NORESULT}</div>
                                </div>}
                    </div>
                </div>
}</>
  )
}
export default SiteFeedbackAbout
