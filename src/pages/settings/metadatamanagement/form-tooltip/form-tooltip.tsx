/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import AddeditView from './add-edit'
import { I_ToolTips } from '../../../../shared/interfaces/Settings.interface'
import { useGetTooltip } from '../../../../store/settings/hooks'
import { convertDate } from '../../../../Global'
const FormTooltip = (props:any) => {
  const tooltipitems: Array<I_ToolTips> = useGetTooltip()
  const [tooltipItems, setTooltipItems] = useState<Array<I_ToolTips>>([])
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null
  })

  useEffect(() => {
    setTooltipItems(tooltipitems)
  }, [tooltipitems])

  /* Function call on edit */
  const onEdit = (item:any) => {
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
  return (
 <div className='row m-0'>
                    <div className='mt-0 p-0 d-flex align-items-center tabsheads p-absolute'>
                        <h2 tabIndex={0} aria-label='Form Tooltips'>FORM TOOLTIPS</h2>

                    </div>
                    <div className='p-0 settings-main'>
                        {tooltipItems.map(item =>
                            <div className="d-flex flex-column shadow card segoeui-regular mb-2 p-2" key={item.LabelName}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-wrap w-100'>
                                        <div className="d-flex flex-column col-md-3 text-break" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Label Name</span>
                                            <span>{item.LabelName}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column me-auto breakall" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Label ID</span>
                                            <span>{item.ToolTipID}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-3 text-break" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Description</span>
                                            <span>{item.TooltipDescription}</span>
                                        </div>
                                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-3 text-break" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color font-12'>Modified</span>
                                            <span>{item.ItemModifiedBy?.Title + ' | ' + convertDate(item.ItemModified, 'date')}</span>
                                        </div>
                                        <div className="dividerdashed vertical ms-2 ms-xxl-3 d-none d-md-block"></div>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <div className='d-flex gap-1 settings-actionbtns ms-2 ms-xxl-3'>
                                            <Buttons
                                                label="Edit"
                                                aria-label="Edit"
                                                icon="icon-pencil me-xl-1"
                                                className='btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap'
                                                onClick={() => onEdit(item)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {inEditMode.status && inEditMode.rowKey === item.ID
                                  ? (
                                        <AddeditView cancel={() => onCancel() } details={item}/>
                                    )
                                  : ''}
                            </div>
                        )}
                    </div>
                </div>
  )
}
export default FormTooltip
