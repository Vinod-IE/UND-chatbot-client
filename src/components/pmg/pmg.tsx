/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import './pmg.css'
import Accordions from '../accordions/accordions'
import { I_PolicyMemo } from '../../shared/interfaces'
import { useGetPolicyMemo } from '../../store/settings/hooks'
import Noresult from '../noresult/noresult'
import { DocumentIconNames } from '../../Global'
import { Policymemosguidelines } from '../../pages'
const PMG = (props:any) => {
  const accordionitems: any = []
  const filesitems: any[] = []
  const policymemo: Array<I_PolicyMemo> = useGetPolicyMemo()
  const [showedit, setShowedit] = useState(false)
  const [policyMemoItems, setPolicyMemoItems] = useState<Array<I_PolicyMemo>>([])
  const [accordionsArray, setAccordionsArray] = useState<Array<I_PolicyMemo>>([])
  const { page } = props
  const [filesArray, setFilesArray] = useState<any>([])
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  useEffect(() => {
    setPolicyMemoItems(policymemo)
    dataArray(policymemo)
  }, [policymemo])
  function dataArray(policyMemoItems: any) {
    policyMemoItems?.map((policymemoList: any) => {
      if (policymemoList?.Files && policymemoList?.Name !== 'Forms') {
        accordionitems.push({
          ID: policymemoList?.UniqueId,
          Id: policymemoList?.UniqueId,
          title: policymemoList?.Name,
          is_active: 'true',
          count: policymemoList?.Files?.length,
          Files: policymemoList?.Files
        })
      } else {
        if (policymemoList?.Name !== 'Forms') {
          filesitems.push(policymemoList)
        }
      }
    })
    filesitems?.sort((a: any, b: any) => a?.Name?.localeCompare(b?.Name))
    setFilesArray(filesitems)
    accordionitems?.sort((a: any, b: any) => a?.title?.localeCompare(b?.title))
    setAccordionsArray(accordionitems)
  }
  const onAccourdian = (item: any) => {
    setInEditMode({
      status: false,
      rowKey: item
    })
    dataArray(policyMemoItems)
  }
  function showEditPopup(ele: any) {
    setShowedit(ele)
  }
  function acordioncontent(list: any, clickedIndex: any) {
    if (!list || !list.Files) {
      return null
    }

    // Create a copy of the files array using the spread operator
    const filesList = [...list.Files]

    // Sort the copied array
    filesList.sort((a: any, b: any) => a?.Name?.localeCompare(b?.Name))
    return (
      <>
        {filesList?.length > 0 ?
          (<ul>
            {filesList && filesList?.map((guidelines: any) =>
              <li key={guidelines.Name}>
                <div className='align-items-center'>
                  <a className='links links-over-underline' href={guidelines.ServerRelativeUrl} title={guidelines.Name} download>
                    <span className={`${DocumentIconNames(guidelines.Name)} pe-1`}></span> {guidelines.Name}
                  </a>
                </div>
              </li>)}
          </ul>) : <div className='min-h-50 d-flex align-items-center justify-content-around'>
            <Noresult />
          </div>
        }
      </>
    )
  }
  return (
    <>
    {page === 'pmg' ? (<>
    <Policymemosguidelines/>
    </>) : (<>
      <div className="card-header pb-0 d-flex align-items-center">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Policy Memos & Guidelines" className="segoeui-bold font-14">
            Policy Memos & Guidelines
          </div>
        </div>
      </div>
      <div className="d-flex flex-column card-body h-100 pt-0">
        <div className="max-h-250 overflow-auto pe-1">
          <div className='divcardinnerconnet p-1'>
            <div className='pmglinks'>
              {accordionsArray?.length > 0 && <Accordions
                items={accordionsArray}
                renderHtml={acordioncontent}
                isSettings={true}
                className="accordions"
                titleIcon="icon-open-folder pe-1"
                titlecollapsedIcon="icon-close-folder pe-1"
                defaultActivekey='1'
                count="bordered px-1 ms-1 border-radius bgcolor-primary whitetext"
                inputProps={{
                  className: 'justify-content-start segoeui-semibold font-13 px-0'
                }}
                IsEdit={showEditPopup}
                ItemId={inEditMode?.rowKey}
                dataobj={onAccourdian}
                actions={
                  [{
                    label: 'Edit',
                    alabel: 'Edit',
                    icon: 'icon-pencil me-xl-1',
                    className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
                  },
                  {
                    label: 'Delete',
                    alabel: 'Delete',
                    icon: 'icon-delete me-xl-1',
                    className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
                  }]
                }
              />}
              {filesArray?.map((poclist: any) =>
                <div className="d-flex flex-column " key={poclist.Name}>
                  <div className="d-flex">
                    <div className='d-flex flex-column flex-md-row flex-nowrap w-100'>
                      <div className="d-flex  align-items-center me-auto">
                        <span className={`${DocumentIconNames(poclist.Name)} pe-1`}></span>
                        <span>
                          <a href={poclist?.ServerRelativeUrl} download className='links links-over-underline' title={poclist.Name}>{poclist.Name}</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {filesArray?.length === 0 && accordionsArray?.length === 0 && <div className='min-h-200 d-flex align-items-center justify-content-around'>
                <Noresult />
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>)}
      
    </>
  )
}
export default PMG
