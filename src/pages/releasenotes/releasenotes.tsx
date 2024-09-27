import React, { useEffect, useState } from 'react'
import { PageHeader } from '../../layouts/header/page-header'
import Accordions from '../../components/accordions/accordions'
import './releasenotes.css'
import { useGetAllSettingsData, useGetReleaseNotes } from '../../store/settings/hooks'
import { I_ReleaseNotes } from '../../shared/interfaces'
import { FetchStatus } from '../../configuration'
import {returnNAIfNull } from '../../Global'
import { decodeHTML } from '../../shared/utility'
import PageOverlay from '../../pageoverLay/pageoverLay'

function ReleaseNotes() {
  const accordionitems: any = []
  const releasenotes: Array<I_ReleaseNotes> = useGetReleaseNotes()
  const FetchDataStatus: any = useGetAllSettingsData()
  const [releaseNoteItems, setReleaseNoteItems] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [accordionsArray, setAccordionsArray] = useState<Array<I_ReleaseNotes>>([])
  useEffect(() => {
    const filteredData = releasenotes?.filter(item => !item.IsArchived)
    setReleaseNoteItems(filteredData)
    dataArray(filteredData)
    if (FetchDataStatus === FetchStatus.SUCCESS) {
      setLoading(false)
    }
    document.title='Release Notes'
  }, [releasenotes])
  function dataArray(releasenotes: any) {
    releasenotes?.map((releasenoteslist: any) => {
      if (releasenoteslist?.VersionName) {
        accordionitems.push({
          ID: releasenoteslist?.ID,
          Id: releasenoteslist?.ID,
          title: releasenoteslist?.VersionName,
          NewFeatures: decodeHTML(releasenoteslist?.NewFeatures),
          ResolvedIssues: decodeHTML(releasenoteslist?.ResolvedIssues),
          KnownIssues: decodeHTML(releasenoteslist?.KnownIssues)
        })
      }
    })
    setAccordionsArray(accordionitems)
  }
  const onAccourdian = (item: any) => {
    dataArray(releaseNoteItems)
  }
  function accordioncontent(releasenotes: any) {
    return (
      <>
        <div tabIndex={0} aria-live='polite' className='my-2 pb-2 d-flex flex-column mx-3 description'>
        <span className='segoeui-semibold font-12 color-primary p-2 ps-0'>New Features:</span>
          <span className='mx-3 dots' dangerouslySetInnerHTML={{
            __html: returnNAIfNull(releasenotes?.NewFeatures)
          }}></span>
                  <span className='segoeui-semibold font-12 color-primary p-2 ps-0'>Resolved Issues: </span>
          <span className='mx-3 dots' dangerouslySetInnerHTML={{
            __html: returnNAIfNull(releasenotes?.ResolvedIssues)
          }}></span>
                  <span className='segoeui-semibold font-12 color-primary p-2 ps-0'>Known Issues:</span>
          <span className='mx-3 dots' dangerouslySetInnerHTML={{
            __html: returnNAIfNull(releasenotes?.KnownIssues)
          }}></span>
        </div>
      </>
    )
  }
  return (
    <>
      <PageHeader name='Release Notes'
        icon="icon-files-checked" />
      <div className='card-body m-2 shadow1 whitebg'>
        <Accordions
          items={accordionsArray}
          isSettings={true}
          renderHtml={accordioncontent}
          className="accordions"
          accordionitemclass="border-bottom1"
          titleIcon="icon-right-arrow color-primary rotate90  p-2"
          titleClass='segoeui-bold font-14'
          titlecollapsedIcon="icon-right-arrow color-primary p-2 "
          dataobj={onAccourdian}
          defaultActivekey={accordionsArray?.length > 0 && accordionsArray[0]?.ID}
          inputProps={{
            className: 'justify-content-start title-color12 px-0',
            contentclassName: 'p-0'
          }}
        />
      </div>
      {loading && <PageOverlay />}
    </>
  )
}

export default ReleaseNotes