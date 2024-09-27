/* eslint-disable camelcase */
import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
// import { ERDiagramDropIn } from 'erd-sp-plugin'
import '@pnp/sp/fields'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/views'
import '@pnp/sp/webs'
import '@pnp/sp/site-users/web'
import { LoadingSampleData } from './generate.types'
import Buttons from '../buttons/buttons'
import { createRandomCalendarEvents, createRandomPOCs, createRandomQuickLinks } from '../data/settings'
import { useQueryClient } from 'react-query'
import { addOrReplaceDataInListBatch } from '../../api/helpers'
import { ListNames } from '../../configuration'
import { PageHeader } from '../../layouts/header/page-header'
import { MetaDataDropIn, SecurityGroupExcelFileParser } from '../excelParser'
import { sp } from '@pnp/sp'
import { pnpAdd } from '../../Global'

const GeneratePage = () => {
  const [loadingSampleData, setLoadingSampleData] = useState<LoadingSampleData>({
    POC: false,
    QuickLink: false,
    Calendar: false,
    addFolder: false
  })
  const queryClient = useQueryClient()
  /// / SAMPLE DATA ////
  const generateSampleData = async () => {
    // sample POCs
    await generateSamplePOCData()
    // sample quick links
    await GenerateSampleQuickLinks()
    // sample calendar
    // await generateSampleCalendar()
  }
  const getUserData = () => {
    const userData: any = queryClient.getQueryData(['userLoginDetails'])
    return userData
  }
  const GenerateSampleQuickLinks = async () => {
    const userData: any = getUserData()
    if (!userData?.userdetails) {
      return
    }
    setLoadingSampleData({ ...loadingSampleData, QuickLink: true })
    const quickLinks: any = createRandomQuickLinks(14)
    await addOrReplaceDataInListBatch(ListNames.QUICK_LINK, quickLinks, userData?.userdetails)
    setLoadingSampleData({ ...loadingSampleData, QuickLink: false })
  }
  const generateSamplePOCData = async () => {
    const userData1: any = getUserData()
    if (!userData1?.userdetails) {
      return
    }
    setLoadingSampleData({ ...loadingSampleData, POC: true })
    const pocs: any = createRandomPOCs(14)
    await addOrReplaceDataInListBatch(ListNames.POINT_OF_CONTACT, pocs, userData1?.userdetails)
    setLoadingSampleData({ ...loadingSampleData, POC: false })
  }
  const generateSampleCalendar = async () => {
    const userDataDets: any = getUserData()
    if (!userDataDets?.userdetails) {
      return
    }
    setLoadingSampleData({ ...loadingSampleData, Calendar: true })
    const calendarEvents: any = createRandomCalendarEvents(9)
    await addOrReplaceDataInListBatch(ListNames.CALENDAR, calendarEvents, userDataDets?.userdetails)
    setLoadingSampleData({ ...loadingSampleData, Calendar: false })
  }
  const GenerateSampleRecords = () => {
    setLoadingSampleData({ ...loadingSampleData, addFolder: true })
    const guids = ['2F7e565b22-65d8-464c-f7d2-d245a33b1e0a', '3E7e565b22-65d8-464c-f7d2-d245a33b1e1b', '7e565b22-65d8-464c-f7d2-d245a33b1e0b']
    const data = [{
      Title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,',
      ItemGUID: '2F7e565b22-65d8-464c-f7d2-d245a33b1e0a',
      AppID: '1',
      AppTitle: 'Data Title',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    },
    {
      Title: 'One limitation of the use of the false text in the web design is that this text is never read, it does not check its actual readability. Moreover formulas designed with dummy text tend to underestimate the space forcing',
      ItemGUID: '3E7e565b22-65d8-464c-f7d2-d245a33b1e1b',
      AppID: '2',
      AppTitle: 'Data Title 2',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    },
    {
      Title: 'In some agencies in the 90 circulated a text called the yellow tram or yellow subway sensible replace Lorem Ipsum to give a more modern look to content. But too many people were looking to read the text ',
      ItemGUID: '7e565b22-65d8-464c-f7d2-d245a33b1e0b',
      AppID: '3',
      AppTitle: 'Data Title 3',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    }
    ]
    const Historydata = [{
      Title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,',
      ItemGUID: '2F7e565b22-65d8-464c-f7d2-d245a33b1e0a',
      AppID: '1',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      Action: 'Submitted',
      AssignedToId: _spPageContextInfo.userId,
      Role: 'Customer',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    },
    {
      Title: 'One limitation of the use of the false text in the web design is that this text is never read, it does not check its actual readability. Moreover formulas designed with dummy text tend to underestimate the space forcing',
      ItemGUID: '3E7e565b22-65d8-464c-f7d2-d245a33b1e1b',
      AppID: '2',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      Action: 'Submitted',
      AssignedToId: _spPageContextInfo.userId,
      Role: 'Customer',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    },
    {
      Title: 'In some agencies in the 90 circulated a text called the yellow tram or yellow subway sensible replace Lorem Ipsum to give a more modern look to content. But too many people were looking to read the text ',
      ItemGUID: '7e565b22-65d8-464c-f7d2-d245a33b1e0b',
      AppID: '3',
      StatusCode: '2',
      StatusTitle: 'Submitted',
      PreviousStatusCode: '2',
      PreviousStatusTitle: 'Submitted',
      Action: 'Submitted',
      AssignedToId: _spPageContextInfo.userId,
      Role: 'Customer',
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId
    }
    ]
    data.forEach((i) => {
      try {
        pnpAdd(ListNames?.MASTERLIST, i).then(async () => {
          await sp.web.getFolderByServerRelativePath(ListNames?.DOCUMENT_LIBRARY).folders.addUsingPath(i?.ItemGUID)
          setLoadingSampleData({ ...loadingSampleData, addFolder: false })
        })
      } catch (error: any) {
        window.alert(error)
        return new Error(error)
      }
    })
    Historydata.forEach((i) => {
      try {
        pnpAdd(ListNames?.HISTORYLIST, i)
      } catch (error: any) {
        window.alert(error)
        return new Error(error)
      }
    })
  }
  return (
    <>
      <PageHeader name='Generate' />
      <div>
        {/* SECURITY GROUPS */}
        <div className='bordered4 border-dashed m-2 p-2 border-radius'>
                        <p className='font-20 sourcesansprosemibold color-primary p-2'>🔒 Add Security Groups</p>
                        <SecurityGroupExcelFileParser />
  </div>
        {/* LISTS */}
        <div className='bordered4 border-dashed m-2 p-2 border-radius'>
          <p className='font-20 sourcesansprosemibold color-primary p-2'>▤ Update Lists</p>
          <div className='h-auto w-auto mt-2'>
            {/* <ERDiagramDropIn /> */}
          </div>
        </div>
        {/* LOAD METADATA */}
        <div className='bordered4 border-dashed m-2 p-2 border-radius'>
          <p className='font-20 sourcesansprosemibold color-primary p-2'>▤ Load Metadata</p>
          <div className='h-auto w-auto mt-2'>
            <MetaDataDropIn />
          </div>
        </div>
        {/* SAMPLE DATA */}
        <div className='bordered4 border-dashed m-2 p-2 border-radius'>
          <p className='font-20 sourcesansprosemibold color-primary p-2'>Generate All Sample Data</p>
          {Object.values(loadingSampleData).some(value => value === true)
            ? <div className='ms-2 border-radius bgcolor-4 whitetext p-2' style={{ width: '230px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ThreeDots
                height='60'
                width='80'
                radius='9'
                color='#fff'
                ariaLabel='three-dots-loading'
                visible={true}
              />
            </div>
            : <Buttons
              label='Create Sample Data'
              icon='icon-add font-14 me-1'
              className='btn-sm sourcesansprosemibold font13 text-color1 text-uppercase ms-2 border-radius bgcolor-4 whitetext p-2'
              onClick={generateSampleData}
            />
          }
          <div className='bordered4 border-dashed m-2 p-2 border-radius'>
            <p className='font-15 sourcesansprosemibold color-primary p-2'>Upload Individual Sample Data</p>
            {/* <div style={{ height: 'auto', marginTop: '10px' }}>
              {loadingSampleData.Calendar
                ? <div className='ms-2 border-radius bgcolor-4 whitetext p-2' style={{ width: '230px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ThreeDots
                    height='60'
                    width='80'
                    radius='9'
                    color='#fff'
                    ariaLabel='three-dots-loading'
                    visible={true}
                  />
                </div>
                : <Buttons
                  label='Create Sample Calendar Data'
                  icon='icon-add font-14 me-1'
                  className='btn-sm sourcesansprosemibold font13 text-color1 text-uppercase ms-2 border-radius bgcolor-4 whitetext p-2'
                  onClick={generateSampleCalendar}
                />
              }
            </div> */}
            <div style={{ height: 'auto', marginTop: '10px' }}>
              {loadingSampleData.POC
                ? <div className='ms-2 border-radius bgcolor-4 whitetext p-2' style={{ width: '230px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ThreeDots
                    height='60'
                    width='80'
                    radius='9'
                    color='#fff'
                    ariaLabel='three-dots-loading'
                    visible={true}
                  />
                </div>
                : <Buttons
                  label='Create Sample POC Data'
                  icon='icon-add font-14 me-1'
                  className='btn-sm sourcesansprosemibold font13 text-color1 text-uppercase ms-2 border-radius bgcolor-4 whitetext p-2'
                  onClick={generateSamplePOCData}
                />
              }
            </div>
            <div style={{ height: 'auto', marginTop: '10px' }}>
              {loadingSampleData.QuickLink
                ? <div className='ms-2 border-radius bgcolor-4 whitetext p-2' style={{ width: '230px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ThreeDots
                    height='60'
                    width='80'
                    radius='9'
                    color='#fff'
                    ariaLabel='three-dots-loading'
                    visible={true}
                  />
                </div>
                : <Buttons
                  label='Create Sample Quick Link Data'
                  icon='icon-add font-14 me-1'
                  className='btn-sm sourcesansprosemibold font13 text-color1 text-uppercase ms-2 border-radius bgcolor-4 whitetext p-2'
                  onClick={GenerateSampleQuickLinks}
                />
              }
            </div>
            <div style={{ height: 'auto', marginTop: '10px' }}>
            {loadingSampleData.addFolder
              ? <div className='ms-2 border-radius bgcolor-4 whitetext p-2' style={{ width: '230px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ThreeDots
                    height='60'
                    width='80'
                    radius='9'
                    color='#fff'
                    ariaLabel='three-dots-loading'
                    visible={true}
                  />
                </div>
              : <Buttons
                  label='Create Sample Records'
                  icon='icon-add font-14 me-1'
                  className='btn-sm sourcesansprosemibold font13 text-color1 text-uppercase ms-2 border-radius bgcolor-4 whitetext p-2'
                  onClick={GenerateSampleRecords}
                />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GeneratePage
