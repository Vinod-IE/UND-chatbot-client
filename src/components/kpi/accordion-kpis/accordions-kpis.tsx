import React from 'react'
import DetailKPIs from '../detail-kpis/detail-kpis'
import Accordions from '../../accordions/accordions'
const Accordionkpis = () => {
  const accordionitems = [
    {
      Id: 1,
      title: 'KPI Title',
      is_active: 'true',
      count: '02',
      kpicode: '3',
      content: (
        <>
          <DetailKPIs accordiontitle={'discovery'} />
        </>
      )
    },
    {
      Id: 2,
      title: 'KPI Title 1',
      is_active: 'false',
      count: '02',
      kpicode: '4',
      content: (
        <>
          <DetailKPIs accordiontitle={'appointingauthority'} />
        </>
      )
    }
  ]
  return (
    <Accordions
      items={accordionitems}
      className="accordions accordion-bordered overflow-hidden"
      titleIcon="icon-arrow-down rotate180 font-10 px-1"
      titlecollapsedIcon="icon-arrow-down font-10 px-1"
      accordionitemclass="border-radius"
      defaultActivekey='1'
      count="border-left1 p-2 ms-auto"
      inputProps={{
        className: 'w-100 p-0',
        contentclassName: 'border-top2 py-0'
      }}
    />
  )
}
export default Accordionkpis
