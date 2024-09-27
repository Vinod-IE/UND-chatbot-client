import React from 'react'
import { PiiScandata } from './scan-list'
export default function PiiScan () {
  return (
    <div className='container'>
                    <div className='row'>
                        <div className="col-sm-12">
                            <div className='row'>
                                <div className="col-sm-12 d-flex align-items-stretch">
                                    <div className="shadow card w-100">
                                        <div className="d-flex flex-column card-body h-100">
                                           <PiiScandata items={undefined} inputProps={undefined} className={undefined} titlecollapsedIcon={undefined} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
  )
}
