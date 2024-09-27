import React, { useEffect, useRef, useState } from 'react'
import Buttons from '../../../components/buttons/buttons'
import AddeditView from './add-edit'
import Accordions from '../../../components/accordions/accordions'
import { useGetAllSettingsData, useGetReleaseNotes } from '../../../store/settings/hooks'
import { I_ReleaseNotes } from '../../../shared/interfaces'
import { DELETE_MSG, FetchStatus, ListNames } from '../../../configuration'
import { convertDate, pnpDelete, returnDashesIfNull } from '../../../Global'
import PageOverlay from '../../../pageoverLay/pageoverLay'
import { useInfiniteScroll } from '../../../shared/hooks/infiniteScroll'
import Alert from '../../../components/alert/alert'
import { getAllSettings } from '../../../store/settings/reducer'
import { AppDispatch } from '../../../store'
import { useDispatch } from 'react-redux'
import { decodeHTML } from '../../../shared/utility'

const VersionNotes = () => {
  const [releaseNoteItems, setReleaseNoteItems] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [showAddPopup, setshowAddPopup] = useState(false)
  const [showedit, setShowedit] = useState(false)
  const [accordionsArray, setAccordionsArray] = useState<any>([])
  const [deleteItem, setDeleteItem] = useState(null)
  const accordionitems: any[] = []
  const popupBodyRef = useRef<HTMLDivElement>(null)
  const [showAlert, setShowAlert] = useState(false)
  const releasenotes: Array<I_ReleaseNotes> = useGetReleaseNotes()
  const FetchDataStatus: any = useGetAllSettingsData()
  const visibleRows = useInfiniteScroll('wrapper')
  const dispatch = useDispatch<AppDispatch>()
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    setReleaseNoteItems(releasenotes)
    dataArray(releasenotes)
    if (FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
  }, [releasenotes])

  useEffect(() => {
    if ((showAddPopup || showedit) && popupBodyRef.current) {
      const focusableElements = popupBodyRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    }
  }, [showAddPopup, showedit])
  function showEditPopup(ele: any) {
    setShowedit(ele)
  }
  function addeditValue(showAddPopup: any) {
    setshowAddPopup(showAddPopup)
  }
  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null
    })
  }
  const onEdit = (item: any) => {
    setshowAddPopup(false)
    setInEditMode({
      status: true,
      rowKey: item?.Id
    })
    setShowedit(true)
    dataArray(releasenotes)
  }
  const onAccourdian = () => {
    setshowAddPopup(false)
    setInEditMode({
      status: false,
      rowKey: null
    })
    dataArray(releasenotes)
  }
  const onDelete = (item: any) => {
    setDeleteItem(item)
    setShowAlert(true)
  }
  const onClickAlert = async (button: string) => {
    if (button === 'Yes') {
      setShowAlert(false)
      if (deleteItem) {
        setLoading(true)
        pnpDelete(ListNames?.RELEASE_NOTES, deleteItem).then(async () => {
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
  function dataArray(releasenotes: any) {
    releasenotes?.map((releasenoteslist: any) => {
      const createdDate = convertDate(releasenoteslist?.ItemCreated, 'date')
      if (releasenoteslist?.VersionName) {
        accordionitems.push({
          ID: releasenoteslist?.ID,
          Id: releasenoteslist?.ID,
          'Version and Date': releasenoteslist?.VersionName,
          'Created': createdDate,
          NewFeatures: decodeHTML(releasenoteslist?.NewFeatures),
          ResolvedIssues: decodeHTML(releasenoteslist?.ResolvedIssues),
          KnownIssues: decodeHTML(releasenoteslist?.KnownIssues),
          'Is Archived': releasenoteslist?.IsArchived
        })
      }
    })
    setAccordionsArray(accordionitems)
  }
  function acordioncontent(releasenoteslist: any, clickedIndex: any) {
    return (
      <>
        {inEditMode?.rowKey === releasenoteslist.Id && showedit
          ? <AddeditView showAddPopup={showAddPopup} cancel={() => onCancel()} filtersvalue={addeditValue} details={releasenoteslist} popupBodyRef={popupBodyRef} showedit={showedit} />
          : releasenoteslist?.Id === clickedIndex && (<>
            <div tabIndex={0} aria-live='polite' className='my-2 pb-2 d-flex flex-column p-2 mx-3 description'>
              <span className='segoeui-semibold font-13 border-bottom1 color-primary pb-1 mb-1'>Scope</span>
              <div>
                <span className='segoeui-semibold font-12 title-color12'>New Features</span>
              <span className='mx-3 release' dangerouslySetInnerHTML={{
                __html: returnDashesIfNull(releasenoteslist?.NewFeatures)
              }}></span>
              </div>
              <div>
                <span className='segoeui-semibold title-color12'>Resolved Issues</span>
              <span className='mx-3 release' dangerouslySetInnerHTML={{
                __html: returnDashesIfNull(releasenoteslist?.ResolvedIssues )
              }}></span>
              </div> <div>
                <span className='segoeui-semibold title-color12'>Known Issues</span>
              <span className='mx-3 release' dangerouslySetInnerHTML={{
                __html: returnDashesIfNull(releasenoteslist?.KnownIssues)
              }}></span>
              </div>
            </div>
          </>)}
      </>
    )
  }
  return (
    <>
      {loading
        ? <PageOverlay />
        : <div className='row m-0'>
          <div className='shadow card mt-0 p-2 tabscontent-height'>
            <div className='d-flex align-items-center pt-0 mt-0 p-2'>
              <h2 className='segoeui-semibold font-16' tabIndex={0} aria-label='RELEASE NOTES'>RELEASE NOTES</h2>
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
            <div>
              {showAddPopup && (
                <AddeditView showAddPopup={showAddPopup} filtersvalue={addeditValue} popupBodyRef={popupBodyRef} showedit={showedit} details={releasenotes} />
              )}

            </div>
            <Accordions
              showAddPopup={showAddPopup}
              isSettings={true}
              renderHtml={acordioncontent}
              items={accordionsArray?.slice(0, visibleRows)}
              headerextras={[{ name: 'Version and Date', classq: 'me-auto text-break' }, { name: 'Created', classq: 'text-break w-100 min-w-md-200 max-w-md-200' }, { name: 'Is Archived', classq: 'text-nowrap w-100 min-w-md-80 max-w-md-80' }]
              }
              className="accordions py-2"
              accordionitemclass=" shadow card mb-2"
              titleIcon="icon-minusform font-16 color-primary pe-2"
              titlecollapsedIcon="icon-plusform pe-2 font-16 color-primary"
              titleclassName="subtitle-color font-12"
              titlecontentclassName="darktext pe-2"
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
              actions={
                [{
                  label: 'Edit',
                  alabel: 'Edit',
                  icon: 'icon-pencil me-xl-1',
                  className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
                  onClick: onEdit
                },
                {
                  label: 'Delete',
                  alabel: 'Delete',
                  icon: 'icon-delete me-xl-1',
                  className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap',
                  onClick: onDelete
                }]
              }
            />
            {showAlert && (
              <Alert message={DELETE_MSG} yes='Yes' cancel='No' className="alert-info"
                onClick={onClickAlert}
                btn1iconclassNmae='icon-checked  font-11 pe-1'
                btn2iconclassNmae='icon-close  font-11 pe-1'
                btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
              />
            )}
          </div>
        </div>}
    </>
  )
}

export default VersionNotes