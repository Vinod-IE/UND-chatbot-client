/* eslint-disable react/no-unknown-property */
import { summarykpis } from './summary-kpis-data'
import React from 'react'
export default function Summarykpis() {
    const listItems = summarykpis.map(kpiitem =>
        <div className="col col-md-6 align-items-stretch d-flex" key={kpiitem.title}>
            <div className='bordered2 border-radius w-100 p-1'>
                <a tabIndex={0} className="kpiborder border-radius kpi-before align-items-center p-relative text-decoration-none d-flex flex-column w-100" title={kpiitem.title} status-kpis={kpiitem.colorcode} aria-live='polite'>
                    <span className="font-16">{kpiitem.count}</span>
                    <span className="font-12 px-2 latobold text-nowrap text-uppercase">{kpiitem.title}</span>
                </a>
            </div>
        </div>
    )
    return (
        <>
            {listItems}
        </>
    )
}
