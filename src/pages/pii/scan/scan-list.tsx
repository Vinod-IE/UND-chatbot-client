
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react'
import '../../../components/table/table.css'
import { scanlistheaddings, Piiscanlists } from './piiscan-list-data'
import InputCheck from '../../../utils/controls/input-checkbox'
import Buttons from '../../../components/buttons/buttons'
interface Props {
  kpicode?: any;
    setheight?:any,
    items:any,
    inputProps:any,
     titleIcon?:any,
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
     defaultActivekey?:any
     'aria-label'?: any,
     accordionitemclass?:any,
     dividerClass?:any,
     content?: any;
     statukpis?:any
     contentclassName?:any
  }

export const PiiScandata = (props:Props) => {
  const [piiscanlists, setPiiscanlists] = useState<any>([Piiscanlists])

  const [clicked, setClicked] = useState<any>(0)
  const toggle = (index : number, value : any) => {
    if (props?.setheight) { props?.setheight(true) }
    if (clicked === index && value === 'expanded') {
      return setClicked(null)
    } else if (value !== 'expanded') {
      return setClicked(index)
    }
    return setClicked(index)
  }

  function handleSelectChnage (event : any) {
    if (event.target.value === 'column1') {
      setPiiscanlists(Piiscanlists[0])
    } else {
      const searchData: any = []
      const departmentfilter = Piiscanlists.filter((emp:any) => {
        return emp.column1 === event.target.value
      })
      searchData.push(departmentfilter)
      setPiiscanlists(searchData)
    }
  }

  function handleInputChnage (event : any) {
    const searchText = event.target.value.toLowerCase()
    const searchData: any = []
    const statusfilter = Piiscanlists.filter((emp : any) => {
      return emp.status.toLowerCase().indexOf(searchText) > -1
    })
    searchData.push(statusfilter)
    setPiiscanlists(searchData)
  }

  const rows : any = []
  function Row (piiscanlists : any) {
    return (
      piiscanlists.map((props :any, index : number) =>
      <>
        <tr>
          <th>
          <a className={props?.inputProps?.className ? `accordion-head text-decoration-none ${props?.inputProps?.className}` : 'accordion-head text-decoration-none'} href='javascript:void(0)' title={props.column1} key={props.column1} onClick={() => toggle(index, clicked === index ? 'expanded' : 'collapsed')} ><span className={clicked === index ? 'icon-arrow-down font-14 d-inline-block' : 'icon-arrow-down font-14 rotate180 d-inline-block'}></span></a>
          </th>
          <th tabIndex={0} aria-label={props.column1}>{props.column1}</th>
          <td tabIndex={0} aria-label={props.column2}>{props.column2}</td>
          <td tabIndex={0} aria-label={props.column3}>{props.column3}</td>
          <td tabIndex={0} aria-label={props.column4}>{props.column4}</td>
          <td tabIndex={0} aria-label={props.column5}>{props.column5}</td>
          <td tabIndex={0} aria-label={props.column6}>{props.column6}</td>
          <th status-kpis={props.colorcode} tabIndex={0} aria-label={props.status}>{props.status}</th>
          <th className='max-w-120'>
            <Buttons
                label="EXPORT TO CSV"
                aria-label="Export to CSV"
                icon="icon-exportexcel me-1"
                className='btn btn-sm btn-primary ms-auto whitetext text-nowrap border-radius'
            /></th>
        </tr>
       {/* <tr>
        <th colSpan={12}><a href="#/detail-view" className='links' title={props.discription}>{props.discription}</a></th>
      </tr> */}
        <tr className={clicked === index ? 'accordion-tableview active' : 'accordion-tableview'}>
        <th tabIndex={0} aria-live='polite' colSpan={12}> {props.discription}</th>
      </tr>
      </>
      )
    )
  }
  return (
      <div className='w-100 overflow-auto p-1'>
        {/* for search functionality */}
        {/* <div className='d-flex'>
          <div className='form-group'>
          <select className="form-control" onChange={handleSelectChnage} >
            <option value=''>Select Department</option>
            <option value='Tech'>column</option>
            <option value='Mech'>Mech</option>
            <option value='Prod'>Prod</option>
          </select>
          </div>
          <div className='form-group ms-auto'>
            <input className="form-control" placeholder="Search Status" onChange ={handleInputChnage} />
          </div>
          </div> */}
        <table className="table-borderless table-dis w-100 sticky-top second-column last-column scanlist" >
          <thead>
            <tr>
            {scanlistheaddings.map(headings =>
              <th tabIndex={0} aria-label={headings.title} key={headings.id}>{headings.title}</th>
            )}
            </tr>
          </thead>
          <tbody>

       { Row(piiscanlists[0])}

          </tbody>
        </table>
      </div>
  )
}
