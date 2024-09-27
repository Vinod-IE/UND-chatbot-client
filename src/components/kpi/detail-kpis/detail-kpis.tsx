/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react'
import { discovery, appointingauthority } from './detail-kpis-data'

export default function DetailKPIs(props: any) {
  const [data, setData] = useState<any>([])
  useEffect(() => {
    if (props?.accordiontitle === 'discovery') {
      setData(discovery)
    }
    if (props?.accordiontitle === 'appointingauthority') {
      setData(appointingauthority)
    }
  }, [props?.accordiontitle])

  const listItems = data.map((kpiitem: any) =>

    <div className="col col-md-6 align-items-stretch d-flex" key={kpiitem.title}>
      <a tabIndex={0} className="kpiborder align-items-center shadow6 kpiborderbottom border-radius text-decoration-none d-flex flex-column w-100" title={kpiitem.title} status-kpis={kpiitem.colorcode} aria-live='polite'>
        <span className="font-16">{kpiitem.count}</span>
        <span className="font-12 latobold text-nowrap text-uppercase">{kpiitem.title}</span>
      </a>
    </div>
  )
  return (
    <>
      <div className='row'>
        {listItems}
      </div>
    </>
  )
}
