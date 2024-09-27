/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { I_Announcement } from '../../shared/interfaces'
import { useGetAllSettingsData, useGetAnnouncements } from '../../store/settings/hooks'
import Noresult from '../noresult/noresult'
import { FetchStatus, NO_OF_ANNOUNCEMENTS_DISPLAY_IN_HOMEPAGE } from '../../configuration'
import { convertDate, toCheckNullValues, returnDashesIfNull } from '../../Global'
import { fetchFewAnnouncements } from '../../api/settings'
import { decodeHTML } from '../../shared/utility'
import Announcement from '../../pages/announcements/announcements'
export default function Announcements(props: any) {
  const announcements: Array<I_Announcement> = useGetAnnouncements()
  const FetchDataStatus: any = useGetAllSettingsData()
  const [announcementsItems, setAnnouncementsItems] = useState<Array<I_Announcement>>([])
  const { page } = props
  useEffect(() => {
    const filteredPocData = announcements.filter(item => !item.IsArchived)
    setAnnouncementsItems(filteredPocData)
  }, [announcements])
  useEffect(() => {
    if (FetchDataStatus !== FetchStatus.SUCCESS) {
      getItems()
    }
  }, [])
  async function getItems() {
    const items = fetchFewAnnouncements()
    const filteredPocData = (await items).filter(item => !item.IsArchived)
    setAnnouncementsItems(filteredPocData)
  }
  return (
    <>
      {page === 'announcements' ? (<>
      <Announcement/>
      </>) : (<>
        <div className="d-flex justify-content-between align-items-center pb-0 card-header">
          <div className="d-flex mb-2 title-border">
            <div tabIndex={0} aria-label="Announcements" className="segoeui-bold font-14">
              Announcements
            </div>
          </div>
          {announcementsItems?.length > NO_OF_ANNOUNCEMENTS_DISPLAY_IN_HOMEPAGE &&
            <Link title="View All" to="/announcements" className="font-12 links text-decoration-underline">
              View All
            </Link>}
        </div>
        <div className="d-flex flex-column card-body pt-0">
          <div className="font-13 pe-1">
            {announcementsItems.slice(0, NO_OF_ANNOUNCEMENTS_DISPLAY_IN_HOMEPAGE).map(announcement =>
              <div className="mb-3" key={announcement?.Title}>
                <p className="m-0">
                  <Link
                    to='/announcements'
                    title={announcement.Title}
                    className="segoeui-semibold lineClamp1 links-over-underline font13 color-primary"
                  >
                    {announcement.Title}
                  </Link>
                </p>
                <p tabIndex={0} aria-live="polite" className="m-0 lineClamp2 sourcesanspro hmdescription" dangerouslySetInnerHTML={{
                  __html: returnDashesIfNull(decodeHTML(announcement?.Description))
                }}>
                </p>
                <p tabIndex={0} aria-describedby='announcententtext' id="announcententtext" className="m-0 sourcesanspro subtitle-color">
                  {announcement?.ItemCreatedBy?.Title + ' | ' + convertDate(announcement.ItemCreated, 'date') + ' | ' + 'Tags' + ' : ' + toCheckNullValues(announcement?.Tags)}
                </p>
              </div>
            )}
            {announcementsItems?.length === 0 && <div className='min-h-200 d-flex align-items-center justify-content-around'>
              <Noresult />
            </div>}
          </div>
        </div>
      </>)}
    </>
  )
}
