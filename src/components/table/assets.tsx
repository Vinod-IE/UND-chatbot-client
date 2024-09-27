/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react'
import './table.css'
import InputCheck from '../../utils/controls/input-checkbox'
import Listone from '../../pages/listview/tablist'
import { Tableaccordion } from './table-accordians'
interface Props {
  page?: string;
  kpicode?: any;
  setheight?: any,
  items?: any,
  inputProps?: any,
  titleIcon?: any,
  label?: any,
  className?: any,
  isClick?: any,
  icon?: any,
  titlecollapsedIcon?: any;
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
const Employees = [
  {
    key: 'column-id-1',
    column1: 'PHL6738333',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-7',
    column4: 'Diagnostic',
    column5: '500',
    column6: '400',
    column7: '100',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-2',
    column1: 'OXY6738328',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Therapeutic',
    column5: '224',
    column6: '220',
    column7: '4',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-3',
    column1: 'OXY6738327',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Basic Stock',
    column5: '600',
    column6: '540',
    column7: '60',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-4',
    column1: 'OXY6738326',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Basic Stock',
    column5: '150',
    column6: '10',
    column7: '140',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-5',
    column1: 'OXY6738325',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Therapeutic',
    column5: '421',
    column6: '100',
    column7: '321',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-6',
    column1: 'OXY6738324',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Basic Stock',
    column5: '421',
    column6: '100',
    column7: '321',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-7',
    column1: 'OXY6738323',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Therapeutic',
    column5: '787',
    column6: '600',
    column7: '187',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-8',
    column1: 'OXY6738322',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Basic Stock',
    column5: '487',
    column6: '87',
    column7: '400',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-7',
    column1: 'OXY6738321',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Therapeutic',
    column5: '246',
    column6: '46',
    column7: '200',
    status: 'In Use',
    colorcode: '7'
  },
  {
    key: 'column-id-10',
    column1: 'OXY6738320',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Basic Stock',
    column5: '200',
    column6: '48',
    column7: '100',
    status: 'In Use',
    colorcode: '7'
  }


]
export const AllAssets = (props:Props) => {
    const [employees, setEmployees] = useState<any>([Employees])

    const [clicked, setClicked] = useState<any>(0)
    const toggle = (index: number, value: any) => {
      if (props?.setheight) { props?.setheight(true) }
      if (clicked === index && value === 'expanded') {
        return setClicked(null)
      } else if (value !== 'expanded') {
        return setClicked(index)
      }
      return setClicked(index)
    }
  
    function handleSelectChnage(event: any) {
      if (event.target.value === 'column1') {
        setEmployees(Employees[0])
      } else {
        const searchData: any = []
        const departmentfilter = Employees.filter((emp: any) => {
          return emp.column1 === event.target.value
        })
        searchData.push(departmentfilter)
        setEmployees(searchData)
      }
    }
  
    function handleInputChnage(event: any) {
      const searchText = event.target.value.toLowerCase()
      const searchData: any = []
      const statusfilter = Employees.filter((emp: any) => {
        return emp.status.toLowerCase().indexOf(searchText) > -1
      })
      searchData.push(statusfilter)
      setEmployees(searchData)
    }
  
    const rows: any = []
function Row (employees : any) {

  return (

    employees.map((props :any, index: number) =>
      <>
        <tr className='border-bottom ' >
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
          <th className='checkbox'>
              <a className={props?.inputProps?.className ? `accordion-head ${props?.inputProps?.className}` : 'accordion-head'} href='javascript:void(0)' title={props.column1} key={props.column1} onClick={() => toggle(index, clicked === index ? 'expanded' : 'collapsed')} ><span className={clicked === index ? 'icon-arrow-down font-14 rotate180 d-inline-block' : 'icon-arrow-down font-14  d-inline-block'}></span></a>
            </th>
          <th tabIndex={0} aria-label={props.column1}><a href="#/detail-view" className=' links-over-underline text-center' title={props.column1}>{props.column1}</a></th>
          <td tabIndex={0} aria-label={props.column2}>{props.column2}</td>
          <td tabIndex={0} aria-label={props.column3}>{props.column3}</td>
          <td tabIndex={0} aria-label={props.column4}>{props.column4}</td>
          <td tabIndex={0} aria-label={props.column5}>{props.column5}</td>
          <td tabIndex={0} aria-label={props.column6}>{props.column6}</td>
          <td tabIndex={0} aria-label={props.column7}>{props.column7}</td>
          <th status-kpis={props.colorcode} className='text-center font-12'><span tabIndex={0} aria-label={props.status} className='text-nowrap kpibg-color p-1 px-2 border-radius3'>{props.status}</span></th>
        </tr>
        <tr>
            <td colSpan={13} className="p-3">
              <div className={clicked === index ? 'accordion-tableview active w-100' : 'accordion-tableview w-100'}>
                <Tableaccordion />
              </div>
            </td>
          </tr>
      </>
    )
  )
}
return (

<div className={`w-100 overflow-auto px-1 ${props?.page == 'HomePage' ? 'max-h-250' : 'listview-table' }`}>
            <table className="table-borderless w-100 sticky-top second-column last-column" >
              <thead>
              <tr>
              <th>
              <InputCheck
                    inputProps={{
                      id: 'all',
                      name: 'Input Check',
                      type: 'checkbox',
                      label: 'All'
                    }}
                    formClassName='form-horizontal font-0'
                  />
            </th>
            <th tabIndex={0} aria-label="heading11">&nbsp;</th>
                <th tabIndex={0} aria-label="SKU ID">SKU ID</th>
                <th tabIndex={0} aria-label="Equipment Name">Equipment Name</th>
                <th tabIndex={0} aria-label="Model">Model</th>
                <th tabIndex={0} aria-label="Type">Type</th>
                <th tabIndex={0} aria-label="Stock In">Stock In</th>
                <th tabIndex={0} aria-label="Stock Out">Stock Out</th>
                <th tabIndex={0} aria-label="Remaining Stock">Remaining Stock</th>
                <th tabIndex={0} aria-label="Status" className='text-center'>Status</th>
              </tr>
              </thead>
              <tbody>
              { Row(employees[0])}
              </tbody>
            </table>
          </div>
)
}