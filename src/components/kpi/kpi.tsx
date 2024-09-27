/* eslint-disable react/no-unknown-property */
import Summarykpis from './summary-kpis/summary-kpis'
import Accordionkpis from './accordion-kpis/accordions-kpis'
import React from 'react'
import './kpi.css'
export default function Kpis() {
    return (
        <>
            <div className="bgcolor-13 border-radius1 overflow-hidden m-2 d-flex">
                <div id="kpisheader" className="d-flex align-items-center segoeui-bold w-100" tabIndex={0} aria-describedby="kpisheader" >
                    <h3 className="m-0 me-2 px-2 ps-3 py-1">
                        <p className="whitetext font-14">TOTAL</p>
                        <p className="whitetext">$ 1,000,000.00</p></h3>
                    <h3 className="ms-auto align-items-center p-3 d-flex h-100 bgcolor-3 whitetext font-26">
                        28
                    </h3>
                </div>
            </div>
            <div className="row flex-wrap px-2">
                <Summarykpis />
            </div>
            <div className="p-2">
                <Accordionkpis />
            </div>
        </>
    )
}
