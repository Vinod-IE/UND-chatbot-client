/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
// import { I_Logo, I_Widgets } from '../../../../shared/interfaces'
// import { useGetAllSettingsData, useGetLogo, useGetWidgets } from '../../../../store/settings/hooks'
import Noresult from '../../../components/noresult/noresult'
import PageOverlay from '../../../pageoverLay/pageoverLay'
import { useInfiniteScroll } from '../../../shared/hooks/infiniteScroll'
// import { AttachmentsType, FetchStatus, UPDATE_ALERT} 
import { FetchStatus } from '../../../configuration'
import AddeditView from './add-edit'
import Buttons from '../../../components/buttons/buttons'
import Alert from '../../../components/alert/alert'
import { useGetAllSettingsData, useGetClassifiedText } from '../../../store/settings/hooks'
import { I_Banner } from '../../../shared/interfaces/Settings.interface'
import { PopupCloseContext } from '../../../shared/contexts/popupclose-context'
const ClassificationBanner = () => {
  const [loading, setLoading] = useState(true)
  const bannertext: Array<I_Banner> = useGetClassifiedText()
  const [classifiedItems, setclassifiedItems] = useState<any>([])
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const visibleRows = useInfiniteScroll('wrapper')
  const FetchDataStatus: any = useGetAllSettingsData()
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() =>{
    if(inEditMode)
      setMultiplePopup()
  },[inEditMode])
  useEffect(() => {
    if (FetchDataStatus === FetchStatus.SUCCESS) {
      setclassifiedItems(bannertext)
      setLoading(false)
    }
    setLoading(false)
  }, [bannertext, FetchDataStatus])
  /* Function call on edit */
  const onEdit = (item: any, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
  return (<>
    {loading
      ? <PageOverlay />
      : <div className='row'>
        <div className='mt-0 p-0 d-flex align-items-center flex-wrap tabsheads p-absolute'>
          <h2 tabIndex={0} aria-label='Classification Banner' className='segoeui-semibold font-16 title-color text-uppercase'>Classification Banner</h2>
        </div>
        <div className='p-0 settings-main'>
          {classifiedItems?.length > 0 && classifiedItems?.slice(0, visibleRows)?.sort((a: any, b: any) => a.DisplayPosition - b.DisplayPosition)?.map((bannerlist: any) =>
            <div className="d-flex flex-column shadow card segoeui-regular mb-2 p-2" key={bannerlist.ID}>
              <div className="d-flex">
                <div className='d-flex flex-column flex-md-row flex-nowrap w-100 px-2 mb-1'>
                  <div className="d-flex flex-column w-100 me-auto" tabIndex={0} aria-live='polite'>
                    <span className='subtitle-color font-12 segoeui-regular'>Title</span>
                    <span className='segoeui-semibold font-12 title-color text-break'>{bannerlist.ClassificationMessage}</span>
                  </div>
                  <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                  <div className="d-flex flex-column min-w-md-100 w-100 max-w-md-100" tabIndex={0} aria-live='polite'>
                    <span className='subtitle-color font-12 segoeui-regular'>Color</span>
                    <div className="d-flex align-items-center">
                      <div
                        className="color-indicator"
                        style={{ backgroundColor: bannerlist.ClassificationColor, width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px' }}
                      ></div>
                      <span className='segoeui-semibold font-12 title-color'>{bannerlist.ClassificationColor}</span>
                    </div>
                  </div>
                  <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                  <div className="d-flex flex-column min-w-md-100 w-100 max-w-md-100" tabIndex={0} aria-live='polite'>
                    <span className='subtitle-color font-12 segoeui-regular'>Text Color</span>
                    <div className="d-flex align-items-center">
                      <div
                        className="color-indicator"
                        style={{ backgroundColor: bannerlist.TextColor, width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px' }}
                      ></div>
                      <span className='segoeui-semibold font-12 title-color'>{bannerlist.TextColor}</span>
                    </div>
                  </div>
                </div>
                <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                <div className='d-flex align-items-center'>
                  <Buttons
                    type="button"
                    label="Edit"
                    aria-label="Edit"
                    icon="icon-pencil me-xxl-1 font-12"
                    className='btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap sourcesansprosemibold'
                    onClick={(event: any) => onEdit(bannerlist, event)}
                  />
                </div>
              </div>
              {inEditMode.status && inEditMode.rowKey === bannerlist.ID
                ? (
                  <AddeditView cancel={() => onCancel()} bannertext={classifiedItems} details={bannerlist} />
                )
                : ''}
            </div>
          )}
          {classifiedItems?.length === 0 && <div className='min-h-200 d-flex align-items-center justify-content-around'>
            <Noresult />
          </div>}
        </div>
      </div>
    }
  </>
  )
}
export default ClassificationBanner
