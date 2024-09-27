/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react'
import '../../components/table/table.css'
import InputCheck from '../../utils/controls/input-checkbox'
import Buttons from '../../components/buttons/buttons'
interface Props {
  kpicode?: any;
  setheight?: any,
  items: any,
  inputProps: any,
  titleIcon?: any,
  label?: any,
  className: any,
  isClick?: any,
  icon?: any,
  titlecollapsedIcon: any;
  headerextras?: any;
  extrasClass?: any;
  titleclassName?: any;
  titlecontentclassName?: any;
  actions?: any;
  count?: any;
  defaultActivekey?: any
  'aria-label'?: any,
  accordionitemclass?: any,
  dividerClass?: any,
  content?: any;
  statukpis?: any
  contentclassName?: any
}
const accordionlist = [
  {
    key: '1',
    title: 'InquiryDiscussionsList',
    UserDefines: 'UserDefines1',
    EIN: 'EIN',
    count: '8',
    UserDefinescount: '5',
    EINvalue: 'column 6'
  },
  {
    key: '2',
    title: 'InquiryDiscussionsList',
    UserDefines: 'UserDefines1',
    EIN: 'EIN',
    count: '8',
    UserDefinescount: '5',
    EINvalue: 'column 6'
  },
  {
    key: '3',
    title: 'InquiryDiscussionsList',
    UserDefines: 'UserDefines1',
    EIN: 'EIN',
    count: '8',
    UserDefinescount: '5',
    EINvalue: 'column 6'
  }]
const scanlistinnerheaddings = [{
  id: 1,
  title: 'List Name'
}, {
  id: 2,
  title: 'Row ID'
}, {
  id: 3,
  title: 'Column Name'
}, {
  id: 4,
  title: 'Occurrences'
}, {
  id: 5,
  title: 'Data with PII'
}]
const scanlistinnercells = [
  {
    column1: 'InquiryDiscussionsList',
    column2: '11',
    column3: 'Comment',
    column4: '1',
    column5: 'Hi, This is my SSN Number as you requested   123-3X-XXXX',
    colorcode: '1'
  },
  {
    column1: 'InquiryDiscussionsList',
    column2: '11',
    column3: 'Comment',
    column4: '1',
    column5: 'Hi, This is my SSN Number as you requested   123-3X-XXXX',
    colorcode: '2'
  },
  {
    column1: 'InquiryDiscussionsList',
    column2: '11',
    column3: 'Comment',
    column4: '1',
    column5: 'Hi, This is my SSN Number as you requested   123-3X-XXXX',
    colorcode: '3'
  }]
export const PiiScaninnerdata = (props: Props) => {
  const [piiscanlists, setPiiscanlists] = useState<any>([scanlistinnercells])

  const [clicked, setClicked] = useState<any>(0)
  const [clicked1, setClicked1] = useState<any>(0)
  const toggle = (index: number, value: any) => {
    if (props?.setheight) { props?.setheight(true) }
    if (clicked === index && value === 'expanded') {
      return setClicked(null)
    } else if (value !== 'expanded') {
      return setClicked(index)
    }
    return setClicked(index)
  }

  const rows: any = []
  function Row(scanlistinnercells: any) {
    return (
      scanlistinnercells.map((props: any, index: number) =>
        <>
          <tr>
            <th className='checkbox'>
              <InputCheck
                inputProps={{
                  id: props.key,
                  name: 'Input Check',
                  type: 'checkbox',
                  label: props.column1
                }}
                formClassName='form-horizontal font-0'
              />
            </th>
            <th tabIndex={0} aria-label={props.column1}>{props.column1}</th>
            <td tabIndex={0} aria-label={props.column2}>{props.column2}</td>
            <td tabIndex={0} aria-label={props.column3}>{props.column3}</td>
            <td tabIndex={0} aria-label={props.column4}>{props.column4}</td>
            <td tabIndex={0} aria-label={props.column5}>{props.column5}</td>
          </tr>
        </>
      )
    )
  }
  return (
    <div className='w-100 overflow-auto'>
      <h2 className='color-primary'>QUARANTINE LIST</h2>
      {accordionlist.map((accordionlists: any, index: number) =>
        <>
          <div className='bgcolor-2 mt-1 p-2'><a className={props?.inputProps?.className ? `accordion-head darktext text-decoration-none ${props?.inputProps?.className}` : 'accordion-head darktext text-decoration-none'} href='javascript:void(0)' key={accordionlists.title} onClick={() => toggle(index, clicked === index ? 'expanded' : 'collapsed')} ><span className={clicked === index ? 'icon-arrow-down font-14 d-inline-block' : 'icon-arrow-down font-14 rotate180 d-inline-block'}></span> <span className='pe-2'>{accordionlists.title} ({accordionlists.count})</span> <span className='pe-2'>{accordionlists.UserDefines}: {accordionlists.UserDefinescount}</span> <span className='pe-2'>{accordionlists.EIN}: {accordionlists.EINvalue}</span></a></div>
          <div className={clicked === index ? 'accordion-tableview d-flex active ps-2' : 'accordion-tableview ps-2'}>
            <table className="table-borderless table-dis w-100 sticky-top second-column last-column mt-1" >
              <thead>
                <tr>
                  <th>
                    <InputCheck
                      inputProps={{
                        name: 'Input Check',
                        type: 'checkbox'
                      }}
                      formClassName='form-horizontal font-0'
                    />
                  </th>
                  {scanlistinnerheaddings.map(innerheadings =>
                    <th tabIndex={0} aria-label={innerheadings.title} key={innerheadings.id}>{innerheadings.title}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Row(piiscanlists[0])}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
