/* eslint-disable react/no-unknown-property */
import React from 'react'
import { dashboardkpis } from './dashboard-kpis-data'
import './dashboard-kpis.css'
export default function Dashboardkpis() {
  return (
    <div className='row'>
        {dashboardkpis.map(dashboardkpis =>
          <div className='col-12 col-sm-6 col-md-4 col-lg-20per mt-2' key={dashboardkpis.title}>
            <a tabIndex={0} href='#' title={`${dashboardkpis.title} ${dashboardkpis.count}`} className="shadow card p-3 border-radius2 w-100 d-flex justify-content-between align-items-center card-body h-100 gap-1" status-kpis={dashboardkpis.kpicode}>
              <div className='d-flex flex-column gap-2 h-100'>
                <h2 className=' darktext d-flex align-items-center segoeui-semibold font-11 font-xxl-14'>{dashboardkpis.title}</h2>
                <h2 className="d-flex align-items-center segoeui-bold font-22 mt-auto darktext">{dashboardkpis.count}</h2>
              </div>
              <div className='d-flex align-items-center kpibg-color p-2 border-radius2 max-h-fitcontent'>
                <span className={`icon-${dashboardkpis.iconname} font-20`}></span>
              </div>
            </a>
          </div>
        )}
      </div>
  )
}
