import React, { useEffect, useState } from 'react'
import { ListNames } from '../../../configuration'
import { getList } from '../../../api/helpers'
import { convertDate, formatDatetoTime } from '../../../Global'
import Noresult from '../../../components/noresult/noresult'
export default function PiiAuditlog () {
  const [AuditPIIData, setAuditPIIData] = useState([])
  const getAuditTrailListData = async () => {
    const list = await getList(ListNames.PIIAUDITTRAIL)
      .then(result => {
        if (result instanceof Error) {
          console.error(result.message) // Log the error message
        } else {
          return result
        }
      })
      .catch(error => {
        console.error('An error occurred:', error)
        return error
      })
    const data = await list?.items
      .getAll()
    data.sort(function (a : any, b : any) {
      return new Date(b.ItemCreated).valueOf() - new Date(a.ItemCreated).valueOf()
    })
    data.forEach((element: { itemDate: string; ItemCreated: string | number | Date | null | undefined }) => {
      element.itemDate = convertDate(element.ItemCreated, '')
    })

    const modifiedItemByDate = data.reduce((agg: { itemDate: any; DateObjects: any[] }[], curr: { itemDate: any }) => {
      const found = agg.find((x: { itemDate: any }) => x.itemDate === curr.itemDate)
      if (found) {
        found.DateObjects.push(curr)
      } else {
        agg.push({
          itemDate: curr.itemDate,
          DateObjects: [curr]
        })
      }
      return agg
    }, [])
    setAuditPIIData(modifiedItemByDate)
  }
  useEffect(() => {
    getAuditTrailListData()
  }, [])
  function getOccurences (jsonObj: string) {
    let type = jsonObj?.split('label":')[1].split(',')[0]
    type = type?.replaceAll('"', ' ')
    const times = jsonObj?.split('label":')[1].split(':')[1].split('}')[0]
    return times + type
  }
  return (
    <div className='container'>
          <div className='row'>
            <div className="col-sm-12 d-flex align-items-stretch">
              <div className="shadow card w-100">
                <div className="d-flex flex-column card-body h-100">
                {AuditPIIData?.length && AuditPIIData?.length > 0
                  ? AuditPIIData?.map((item : any) =>
                    <div key={item?.itemDate} className='auditlogs'>
                      <div className='bgcolor-primary py-1 px-2 border-radius'>
                        <h2 aria-label={item?.itemDate} tabIndex={0} className='whitetext segoeui-semibold font-14'>{item?.itemDate}</h2>
                      </div>
                      <ul className='list-type-none progress v-steps w-100'>
                      {item?.DateObjects?.length && item?.DateObjects?.length > 0
                        ? item?.DateObjects?.map((element : any) =>
                          <li className="px-2 px-xl-3" key={formatDatetoTime(element?.ItemCreated)}>
                            <div className="progress-steps">
                              <div className='audittime'>{formatDatetoTime(element?.ItemCreated)}</div>
                              <div className="circle">  </div>
                              <div tabIndex={0} className="progress-title pb-1 d-flex flex-column" aria-live="polite">
                              {element?.DocumentPath
                                ? <><p className='ps-2'>
                                        <span><a href='#' tabIndex={0} title={element?.FieldorFileName}>{element?.FieldorFileName}</a>
                                         File Uploaded</span>
                                     </p> </>
                                : <><span className='ps-2'>
                                        {element?.FieldorFileName}  is added</span> </>
                                  }
                                {/* <span><a href='#' className='links'> {element?.Comment}</a> {element?.Comment}</span> */}
                                {element?.AppID !== '' && element?.AppID
                                  ? (<span className="font-10 subtitle-color">App Number: <a href={ element?.AppID} className='links'>{ element?.AppID}</a></span>)
                                  : (
                                  <span className="pii-aduit-title" tabIndex={0}>{element?.Comment}</span>
                                    )}
                                <span className="font-10 subtitle-color">{getOccurences(element?.JsonResult)}</span>
                                <span className="font-10 subtitle-color">{element.ItemModifiedBy?.Title}</span>
                              </div>
                            </div>
                          </li>
                        )
                        : ''}
                      </ul>
                    </div>
                  )
                  : <div className='text-center min-h-100 align-items-center justify-content-center d-flex'><Noresult /></div> }
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
