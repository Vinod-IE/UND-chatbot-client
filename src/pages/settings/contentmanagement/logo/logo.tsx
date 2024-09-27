/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
import { I_Logo } from '../../../../shared/interfaces'
import { useGetAllSettingsData, useGetLogo } from '../../../../store/settings/hooks'
import Noresult from '../../../../components/noresult/noresult'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import { useInfiniteScroll } from '../../../../shared/hooks/infiniteScroll'
import { AttachmentsType, FetchStatus } from '../../../../configuration'
import AddeditView from './add-edit'
import Buttons from '../../../../components/buttons/buttons'
import { getPublicURL } from '../../../../shared/utility'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const SettingsLogo = () => {
  const [loading, setLoading] = useState(true)
  const logo: Array<I_Logo> = useGetLogo()
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [logoImage, setLogoImage] = useState<any>([])
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
    setLogoImage(logo)
    if (FetchDataStatus === FetchStatus.SUCCESS) {
      const logoItems = logo.filter((item: any) => item?.AttachmentsType === AttachmentsType?.Logo)
      setLogoImage(logoItems)
      setLoading(false)
    }
    setLoading(false)
  }, [logo])
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
          <h2 tabIndex={0} aria-label='LOGO' className='segoeui-semibold font-16 title-color'>LOGO</h2>
        </div>
        <div className='p-0 settings-main'>
          {logoImage?.length > 0 && logoImage?.slice(0, visibleRows).sort((a: any, b: any) => a.DisplayPosition - b.DisplayPosition).map((logolist: any) =>
            <div className="d-flex flex-column shadow card segoeui-regular mb-2 p-2" key={logolist.ID}>
              <div className="d-flex">
                <div className='d-flex flex-column flex-md-row flex-nowrap w-100 px-2 mb-1'>
                  <div className="d-flex d-flex mx-md-1 py-1" tabIndex={0} aria-label='Logo'>
                    {logolist?.AttachmentFiles && logolist.AttachmentFiles.length > 0
                      ? logolist.AttachmentFiles.map((attachList: any) =>
                        <img key={attachList?.ServerRelativeUrl} src={attachList?.ServerRelativeUrl} alt={attachList?.ServerRelativeUrl} title='LOGO' width="200" className='w-80 h-auto' />
                      )
                      : <img src={getPublicURL() + 'assets/images/logo.svg'} alt='Rhybus' title='Rhybus' width="200" />
                    }
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
                    onClick={(event: any) => onEdit(logolist, event)}
                  />
                </div>
              </div>
              {inEditMode.status && inEditMode.rowKey === logolist.ID
                ? (
                  <AddeditView cancel={() => onCancel()} logo={logoImage} details={logolist} />
                )
                : ''}
            </div>
          )}
          {logoImage?.length === 0 && <div className='min-h-200 d-flex align-items-center justify-content-around'>
            <Noresult />
          </div>}
        </div>
      </div>
    }
  </>
  )
}
export default SettingsLogo
