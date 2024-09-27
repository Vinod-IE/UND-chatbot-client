/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import Accordions from '../../../../components/accordions/accordions'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import PmgData from './pmgdata'
import { I_PolicyMemo } from '../../../../shared/interfaces'
import { useGetPolicyMemo } from '../../../../store/settings/hooks'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { convertDate } from '../../../../Global'
const accordionitems : any[] = []
const Settingssubaccordion = (props: any) => {
  const [showAddPopup, setshowAddPopup] = useState(false)
  const [showedit, setshowedit] = useState(false)
  const accordionitems : any[] = []
  const dispatch = useDispatch<AppDispatch>()
  const policymemo: Array<I_PolicyMemo> = useGetPolicyMemo()
  const [policyMemoItems, setPolicyMemoItems] = useState<Array<I_PolicyMemo>>([])
  const [accordionsArray, setAccordionsArray] = useState<Array<I_PolicyMemo>>([])
  useEffect(() => {
    setPolicyMemoItems(policymemo)
    dataArray(policymemo)
  }, [policymemo])
  function dataArray (policyMemoItems: any) {
    if (policyMemoItems?.Name) {
      accordionitems.push({
        ID: policyMemoItems?.UniqueId,
        Id: policyMemoItems?.UniqueId,
        Templates: policyMemoItems?.Name,
        Created: convertDate(policyMemoItems?.TimeCreated, 'date'),
        Modified: convertDate(policyMemoItems?.TimeLastModified, 'date'),
        'Is Archived': '',
        content: acordioninnercontent(policyMemoItems,
          '',
          '')
      })
    }
    setAccordionsArray(accordionitems)
  }
  function addeditValue (showAddPopup: any) {
    setshowAddPopup(showAddPopup)
  }

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })
  /* Function call on clicking Add button */
  const onclickADD = () => {
    setshowAddPopup(!showAddPopup)
    setInEditMode({
      status: false,
      rowKey: null
    })
  }
  /* Function call on edit */
  const onEdit = (item: any) => {
    setInEditMode({
      status: true,
      rowKey: item.ItemKey
    })
  }
  /* Function call on cancel */
  const onCancel = (item: any) => {
    setInEditMode({
      status: false,
      rowKey: null
    })
  }

  function acordioninnercontent (list: any, Desc: any, AttachedFileName: any) {
    return (
      (
                <PmgData list={list}/>
      )
    )
  }
  return (
                <div className='row m-0'>
                    <div className='p-0 settings-main'>
                        {showAddPopup && (
                            <AddeditView showAddPopup={showAddPopup} filtersvalue={addeditValue} />
                        )}
                        {<Accordions
                            items={accordionsArray}
                            headerextras={[{ name: 'Templates', classq: 'me-auto' }, { name: 'Created', classq: 'min-w-md-100 min-w-xl-175' }, { name: 'Modified', classq: 'text-nowrap maxfitcontent-lg' }]
                            }
                            className="accordions py-2"
                            accordionitemclass=" shadow card mb-2"
                            titleIcon="icon-open-folder font-16 color-primary pe-2"
                            titlecollapsedIcon="icon-close-folder pe-2 font-16 color-primary"
                            titleclassName="subtitle-color font-12"
                            titlecontentclassName="darktext lineClamp1 pe-2"
                            defaultActivekey='1'
                            dividerClass="dividerdashed vertical me-2 mx-2 mx-xxl-3 d-none d-md-block"
                            extrasClass="d-flex flex-column align-items-center flex-md-row flex-nowrap w-100"
                            count="bordered px-1 ms-1 border-radius"
                            actionbuttons="settings-actionbtns mx-2 mx-xxl-3"
                            inputProps={{
                              className: 'justify-content-start segoeui-regular font-13 w-100 p-0',
                              accordionheadClass: 'd-flex align-items-center p-2',
                              contentclassName: 'p-0'
                            }}
                            actions= {
                              [{
                                label: 'Edit',
                                alabel: 'Edit',
                                icon: 'icon-pencil me-xxl-1 font-11',
                                className: 'btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
                              },
                              {
                                label: 'Delete',
                                alabel: 'Delete',
                                icon: 'icon-delete me-xxl-1 font-11',
                                className: 'btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
                              }]
                            }
                        />}
                    </div>
                </div>
  )
}
export default Settingssubaccordion
