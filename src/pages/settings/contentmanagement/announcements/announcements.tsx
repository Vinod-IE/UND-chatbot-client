/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useRef, useState } from 'react'
import Accordions from '../../../../components/accordions/accordions'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { I_Announcement } from '../../../../shared/interfaces'
import { useGetAllSettingsData, useGetAnnouncements } from '../../../../store/settings/hooks'
import { DELETE_MSG, FetchStatus, ListNames } from '../../../../configuration'
import { DocumentIconNames, convertDate, pnpDelete, returnDashesIfNull } from '../../../../Global'
import { getAllSettings } from '../../../../store/settings/reducer'
import InfiniteScroll from 'react-infinite-scroller'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { useInfiniteScroll } from '../../../../shared/hooks/infiniteScroll'
import Alert from '../../../../components/alert/alert'
import { decodeHTML } from '../../../../shared/utility'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const Announcements = (props:any) => {
  const [loading, setLoading] = useState(true)
  const accordionitems: any[] = []
  const [accordionsArray, setAccordionsArray] = useState<any>([])
  const [announcementItems, setAnnouncementItems] = useState<any>([])
  const [showAddPopup, setshowAddPopup] = useState(false)
  const [showedit, setShowedit] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const dispatch = useDispatch<AppDispatch>()
  const annoucements: Array<I_Announcement> = useGetAnnouncements()
  const FetchDataStatus: any = useGetAllSettingsData()
  const visibleRows = useInfiniteScroll('wrapper')
  const popupBodyRef = useRef<HTMLDivElement>(null)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  const onEdit = (item:any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: true,
      rowKey: item?.Id
    })
    setShowedit(true)
    // onAccourdian(item)
    dataArray(annoucements)
  }
  useEffect(() => {
    setAnnouncementItems(annoucements)
    dataArray(annoucements)
    if (FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [annoucements])
  function addeditValue(showAddPopup: any) {
    setshowAddPopup(showAddPopup)
  }
  useEffect(() => {
    if ((showAddPopup || showedit) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
    setMultiplePopup()
  }, [showAddPopup,showedit])
  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null
    })
  }
  const onAccourdian = (item: any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: false,
      rowKey: null
    })
    dataArray(annoucements)
  }
  function dataArray(annoucements: any) {
    annoucements?.map((announcementlist: any) => {
      if (announcementlist?.Title) {
        accordionitems.push({
          ID: announcementlist?.ID,
          Id: announcementlist?.ID,
          Title: announcementlist?.Title,
          Description: decodeHTML(announcementlist?.Description),
          Tags: announcementlist?.Tags,
          ExpiryDate: announcementlist?.ExpiryDate,
          AttachmentFiles: announcementlist?.AttachmentFiles,
          'Is Archived': announcementlist?.IsArchived
        })
      }
    })
    setAccordionsArray(accordionitems)
  }
  function showEditPopup(ele: any) {
    setShowedit(ele)
  }
  function acordioncontent(announcementlist: any, clickedIndex: any) {
    return (
      <>
            {inEditMode?.rowKey === announcementlist.Id && showedit
              ? <AddeditView cancel={() => onCancel()} filtersvalue={addeditValue} details={announcementlist}  popupBodyRef={popupBodyRef} showAddPopup={showAddPopup} showedit={showedit}/>
              : announcementlist?.Id === clickedIndex && (<>
            <div tabIndex={0} aria-live='polite' className='my-2 pb-2 border-bottom1 d-flex flex-column p-2 mx-3 description'>
              <span className='segoeui-bold'>Description</span>
              <span className='mx-3' dangerouslySetInnerHTML={{
                __html: returnDashesIfNull(announcementlist?.Description)
              }}></span>
            </div>
            <div tabIndex={0} aria-live='polite' className='my-2 pb-2 border-bottom1 d-flex flex-column p-2'>
              <span className='segoeui-bold'>Tags</span>
              <span>{announcementlist?.Tags}</span>
            </div>
            <div tabIndex={0} aria-live='polite' className='my-2 pb-2 border-bottom1 d-flex flex-column p-2'>
              <span className='segoeui-bold'>Expiry Date</span>
              <span>{convertDate(announcementlist?.ExpiryDate, '')}</span>
            </div>
         <div className='d-flex flex-column p-2'>
             <span className='segoeui-bold' tabIndex={0} aria-label='Attachments'>Attachments</span>
             <ul className='list-type-none'>
             {announcementlist?.AttachmentFiles?.map((attachList: any) =>
                 <li key={attachList?.FileName}>
                   <div className="links d-flex align-items-center breakall">
                  <span className={`${DocumentIconNames(attachList?.FileName)} pe-2`}></span>
                     <a title={attachList?.FileName} className="color-primary m-0 links-over-underline" tabIndex={0} href={attachList?.ServerRelativeUrl} download>
                         {attachList?.FileName}
                     </a>
                     </div>
                 </li>
             )}
             </ul>
         </div>
         </>)}
            </>
    )
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
        pnpDelete(ListNames?.ANNOUNCEMENT, deleteItem).then(async () => {
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
        : <div className='row m-0'>
          <div className='mt-0 p-0 d-flex align-items-center tabsheads p-absolute'>
          <h3 tabIndex={0} aria-label='ANNOUNCEMENTS 'className='segoeui-semibold'>ANNOUNCEMENTS</h3>
            <Buttons
              label="ADD"
              aria-label="Add"
              icon="icon-add me-1"
              className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius'
              onClick={() => {
                setshowAddPopup(!showAddPopup)
                setShowedit(false)
                setInEditMode({
                  status: false,
                  rowKey: null
                })
              }}
            />
          </div>
          <div className='p-0 settings-main'>

            {showAddPopup && (
              <AddeditView showedit={showedit} showAddPopup={showAddPopup} filtersvalue={addeditValue} details={annoucements} popupBodyRef={popupBodyRef} />
            )}

            {<Accordions

              showAddPopup={showAddPopup}
              items={accordionsArray?.slice(0, visibleRows)}
              renderHtml={acordioncontent}
              isSettings={true}
              headerextras={[{ name: 'Title', classq: 'me-auto text-break' }, { name: 'Tags', classq: 'text-break w-100 min-w-md-200 max-w-md-200' }, { name: 'Is Archived', classq: 'text-nowrap w-100 min-w-md-80 max-w-md-80' }]
              }
              className="accordions py-2"
              accordionitemclass=" shadow card mb-2"
              titleIcon=" font-16 color-primary pe-2"
              titlecollapsedIcon=" pe-2 font-16 color-primary"
              titleclassName="subtitle-color font-12"
              titlecontentclassName="darktext pe-2"
              defaultActivekey='1'
              dividerClass="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"
              extrasClass="d-flex flex-column flex-md-row flex-nowrap w-100"
              count="bordered px-1 ms-1 border-radius"
              actionbuttons="settings-actionbtns mx-2 mx-xxl-3"
              inputProps={{
                className: 'justify-content-start segoeui-regular font-13 w-100 p-0',
                accordionheadClass: 'd-flex align-items-start p-2',
                contentclassName: 'p-0'
              }}
              IsEdit={showEditPopup}
              ItemId={inEditMode?.rowKey}
              dataobj={onAccourdian}
              // actions={
              //   [{
              //     label: 'Edit',
              //     alabel: 'Edit',
              //     icon: 'icon-pencil me-xl-1',
              //     className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
              //     onClick: onEdit

              //   },
              //   {
              //     label: 'Delete',
              //     alabel: 'Delete',
              //     icon: 'icon-delete me-xl-1',
              //     className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
              //     onClick: onDelete
              //   }]
              // }
            />}
            {showAlert && (
              <Alert message={DELETE_MSG} yes='Yes' cancel='No' className="alert-info"
                onClick={onClickAlert}
                btn1iconclassNmae='icon-checked font-11 pe-1'
                btn2iconclassNmae='icon-close  font-11 pe-1'
                btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
              />
            )}
          </div>
        </div>

      }
    </>
  )
}
export default Announcements
