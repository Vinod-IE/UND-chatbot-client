import { PiiScaninnerdata } from '../scanlist-accorcontent'
import React from 'react'
export const scanlistheaddings = [{
  id: 0,
  title: ''
},
{
  id: 1,
  title: 'Scan ID'
}, {
  id: 2,
  title: 'Created'
}, {
  id: 3,
  title: 'Start'
}, {
  id: 4,
  title: 'End'
}, {
  id: 5,
  title: 'Elapsed Time'
}, {
  id: 6,
  title: 'Detected Records'
}, {
  id: 7,
  title: 'Status'
}, {
  id: 7,
  title: ''
}]

export const Piiscanlists = [
  {
    key: 'column-id-1',
    column1: 'column 1',
    column2: 'column 2',
    column3: 'column 3',
    column4: 'column 4',
    column5: 'column 5',
    column6: 'column 6',
    status: 'status 1',
    discription: (<><PiiScaninnerdata items={undefined} inputProps={undefined} className={undefined} titlecollapsedIcon={undefined} /></>),
    colorcode: '1'
  },
  {
    key: 'column-id-2',
    column1: 'column 1',
    column2: 'column 2',
    column3: 'column 3',
    column4: 'column 4',
    column5: 'column 5',
    column6: 'column 6',
    status: 'status 2',
    discription: (<><PiiScaninnerdata items={undefined} inputProps={undefined} className={undefined} titlecollapsedIcon={undefined} /></>),
    colorcode: '2'
  },
  {
    key: 'column-id-3',
    column1: 'column 1',
    column2: 'column 2',
    column3: 'column 3',
    column4: 'column 4',
    column5: 'column 5',
    column6: 'column 6',
    status: 'status 3',
    discription: (<><PiiScaninnerdata items={undefined} inputProps={undefined} className={undefined} titlecollapsedIcon={undefined} /></>),
    colorcode: '3'
  }]
