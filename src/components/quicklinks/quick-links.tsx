/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './quicklinks.css'
import { I_QuickLink } from '../../shared/interfaces'
import { useGetAllSettingsData, useGetQuickLinks } from '../../store/settings/hooks'
import Noresult from '../noresult/noresult'
import { FetchStatus, NO_OF_QUICKLINKS_DISPLAY_IN_HOMEPAGE } from '../../configuration'
import { fetchFewQuickLinks } from '../../api/settings'
import { Quicklinks } from '../../pages'
export default function QuickLinks (props:any) {
  const quicklinks: Array<I_QuickLink> = useGetQuickLinks()
  const FetchDataStatus: any = useGetAllSettingsData()
  const [quicklinksItems, setQuicklinksItems] = useState<Array<I_QuickLink>>([])
  const { page } = props
  useEffect(() => {
    const filteredQuickLinksData = quicklinks.filter(item => !item.IsArchived)
    const strAscending = [...filteredQuickLinksData].sort((a, b) =>
      a.Title > b.Title ? 1 : -1
    )
    setQuicklinksItems(strAscending.slice(0, NO_OF_QUICKLINKS_DISPLAY_IN_HOMEPAGE))
  }, [quicklinks])
  useEffect(() => {
    if (FetchDataStatus !== FetchStatus.SUCCESS) {
      getItems()
    }
  }, [])
  async function getItems () {
    const items = fetchFewQuickLinks()
    const filteredQuickLinksData = (await items).filter(item => !item.IsArchived)
    const strAscending = [...filteredQuickLinksData].sort((a, b) =>
      a.Title > b.Title ? 1 : -1
    )
    setQuicklinksItems(strAscending.slice(0, NO_OF_QUICKLINKS_DISPLAY_IN_HOMEPAGE))
  }
  return (
    <>
    {page === 'quick-links' ? (<>
    <Quicklinks/>
    </>) : (<>
      <div className="d-flex justify-content-between align-items-center card-header pb-0">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Quick Links" className="segoeui-bold font-14">
            Quick Links
          </div>
        </div>
        {quicklinks.length > NO_OF_QUICKLINKS_DISPLAY_IN_HOMEPAGE
          ? <Link title="View All" to="/quicklinks" className="font-12 links text-decoration-underline">
          View All
        </Link>
          : ''}
      </div>
      <div className="quickLinks no-icons card-body">
        <ul className="mt-0 ">
          {quicklinksItems.length > 0
            ? quicklinksItems.map(links =>
              <li key={links?.ID}>
                <a className="segoeui-regular font-12 color-primary links-over-underline"  target = '_blank' href={links.URL} title={links.Title} rel="noreferrer">
                  {links.Title}
                </a>
              </li>)
            : <div className='min-h-200 d-flex align-items-center justify-content-around'>
               <Noresult />
            </div>}
        </ul>
      </div>
    </>)}
  
    </>
  )
}
