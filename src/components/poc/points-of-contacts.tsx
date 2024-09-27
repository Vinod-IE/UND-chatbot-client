/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react'
import './pointsofcontacts.css'
import { Link } from 'react-router-dom'
import { I_PointOfContact } from '../../shared/interfaces'
import { useGetAllSettingsData, useGetPOCs } from '../../store/settings/hooks'
import Noresult from '../noresult/noresult'
import { FetchStatus, NO_OF_POINTS_OF_CONTACTS_DISPLAY_IN_HOMEPAGE } from '../../configuration'
import { fetchFewPOCs } from '../../api/settings'
import PointsOfContact from '../../pages/poc/pointsofcontacts'
export default function PointsOfContacts (props:any) {
  const pocs: Array<I_PointOfContact> = useGetPOCs()
  const FetchDataStatus: any = useGetAllSettingsData()
  const [pocItems, setPOCItems] = useState<Array<I_PointOfContact>>([])
  const { page } = props
  useEffect(() => {
    const filteredPocData = pocs.filter(item => !item.IsArchived)
    const strAscending = [...filteredPocData].sort((a, b) =>
      a.ContactName > b.ContactName ? 1 : -1
    )
    setPOCItems(strAscending.slice(0, NO_OF_POINTS_OF_CONTACTS_DISPLAY_IN_HOMEPAGE))
   
  }, [pocs])
  useEffect(() => {
    if (FetchDataStatus !== FetchStatus.SUCCESS) {
      getItems()
    }
  }, [])
  async function getItems () {
    const items = fetchFewPOCs()
    const filteredPocData = (await items).filter(item => !item.IsArchived)
    const strAscending = [...filteredPocData].sort((a, b) =>
      a.ContactName > b.ContactName ? 1 : -1
    )
    setPOCItems(strAscending?.slice(0, 3))
  }
  const getInitials = (name: string) => {
    const nameParts = name?.split(' ')
    let initials = ''
    if (nameParts.length >= 1) {
      initials += nameParts[0][0]
    }
    if (nameParts.length >= 2) {
      initials += nameParts[nameParts.length - 1][0]
    }
    return initials.toUpperCase()
  }
  return (
    <>
    {page === 'poc' ? (<>
    <PointsOfContact/>
    </>) : (<>
      <div className="card-header pb-0 d-flex justify-content-between align-items-center">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Points of Contact" className="segoeui-bold font-14" >
            Points of Contact
          </div>
        </div>
        {pocs?.length > NO_OF_POINTS_OF_CONTACTS_DISPLAY_IN_HOMEPAGE &&
        <Link title="View All" to="/poc" className="font-12 links  text-decoration-underline">
          View All
        </Link>}
      </div>

      <div className="d-flex flex-column card-body">
        {pocItems?.length > 0
          ? pocItems.map((pocitems: any) =>
            <div className="d-flex mb-3" key={pocitems.ID}>
              <div className="POC-thumb m-0 me-2 align-items-center d-flex justify-content-center">
                {getInitials(pocitems?.ContactName)}
              </div>
              <div className="sourcesanspro">
                <p tabIndex={0} aria-label={pocitems?.ContactName} className="m-0 segoeui-bold font-14">
                  {pocitems.ContactName}
                </p>
                <p tabIndex={0} aria-label={pocitems.ContactTitle} className="m-0 subTitleGrey segoeui-bold font-11" >
                  {pocitems.ContactTitle}
                </p>
                <p className="m-0 d-flex align-items-center">
                  <a href={'mailto:' + pocitems.ContactEmail} className="eMail links font-12 links-over-underline" title={pocitems.ContactEmail}> <span className="icon-mail me-1"></span>{pocitems.ContactEmail}</a>
                </p>
              </div>
            </div>
          )
          : <div className='min-h-200 d-flex align-items-center justify-content-around'>
            <Noresult />
          </div>}
      </div>
    </>)}

    </>
  )
}
