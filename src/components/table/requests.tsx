/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react'
import './table.css'
import InputCheck from '../../utils/controls/input-checkbox'
interface Props {
  page: string;
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
const Employees = [
  {
    key: 'column-id-1',
    column1: '6738333',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-7',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-2',
    column1: '6738332',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-3',
    column1: '6738331',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-4',
    column1: '6738329',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-5',
    column1: '6738328',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-6',
    column1: '6738327',
    column2: 'Phlegm Suction Machine',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },
  {
    key: 'column-id-7',
    column1: '6738326',
    column2: 'Oxygen Cylinder',
    column3: '7782-44-5',
    column4: 'Safety',
    column5: '10',
    column6: 'Dr. Ramesh',
    column7: '23/07/2024',
    status: 'Requested',
    colorcode: '9'
  },


]
function Row (employees : any) {
  return (
    employees.map((props :any) =>
      <>
        <tr className='border-bottom'>
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
          <th tabIndex={0} aria-label={props.column1}><a href="#/detail-view" className='links links-over-underline text-center' title={props.column1}>{props.column1}</a></th>
          <td tabIndex={0} aria-label={props.column2}>{props.column2}</td>
          <td tabIndex={0} aria-label={props.column3}>{props.column3}</td>
          <td tabIndex={0} aria-label={props.column4}>{props.column4}</td>
          <td tabIndex={0} aria-label={props.column5}>{props.column5}</td>
          <td tabIndex={0} aria-label={props.column6}>{props.column6}</td>
          <td tabIndex={0} aria-label={props.column7}>{props.column7}</td>
          <th status-kpis={props.colorcode} className='text-center font-12'><span tabIndex={0} aria-label={props.status} className='text-nowrap kpibg-color p-1 px-2 border-radius3'>{props.status}</span></th>
        </tr>
      </>
    )
  )
}
export const NewRequests = (props:any) => {
  const [employees, setEmployees] = useState<any>([Employees])
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
              <th tabIndex={0} aria-label="ID">ID</th>
              <th tabIndex={0} aria-label="Equipment">Equipment</th>
              <th tabIndex={0} aria-label="Model">Model</th>
              <th tabIndex={0} aria-label="Type">Type</th>
              <th tabIndex={0} aria-label="Quantity">Quantity</th>
              <th tabIndex={0} aria-label="Requested by">Requested by</th>
              <th tabIndex={0} aria-label="Requested Date">Requested Date</th>
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
