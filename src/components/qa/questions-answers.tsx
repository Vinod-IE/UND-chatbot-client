/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { I_QandA } from '../../shared/interfaces'
import { useGetAllSettingsData, useGetQandA } from '../../store/settings/hooks'
import { FetchStatus, NO_OF_QA_DISPLAY_IN_HOMEPAGE } from '../../configuration'
import { convertDate, returnDashesIfNull } from '../../Global'
import Noresult from '../noresult/noresult'
import { fetchFewQandA } from '../../api/settings'
import { decodeHTML } from '../../shared/utility'
import { QandA } from '../../pages'
export default function QuestionAnswers (props:any) {
  const qanda: Array<I_QandA> = useGetQandA()
  const FetchDataStatus: any = useGetAllSettingsData()
  const [qandaItems, setQandaItems] = useState<Array<I_QandA>>([])
  const { page } = props
  useEffect(() => {
    const filteredQaData = qanda.filter(item => !item.IsArchived)
    setQandaItems(filteredQaData)
  }, [qanda])
  useEffect(() => {
    if (FetchDataStatus !== FetchStatus.SUCCESS) {
      getItems()
    }
  }, [])
  async function getItems () {
    const items = fetchFewQandA()
    const filteredKAData = (await items).filter(item => !item.IsArchived)
    setQandaItems(filteredKAData)
  }
  return (
    <>
    {page === 'questions-answers' ? (<>
      <QandA/>
    </>) : (<>
      <div className="d-flex justify-content-between align-items-center pb-0 card-header">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="quetions & Answers" className="segoeui-bold font-14">
            Q & A
          </div>
        </div>
        {qandaItems.length > NO_OF_QA_DISPLAY_IN_HOMEPAGE
          ? <Link title="View All" to="/qa" className="font-12 links text-decoration-underline">
          View All
        </Link>
          : ''}
      </div>
      <div className="d-flex flex-column pt-0 card-body">
        <div className="font-13">
          {qandaItems.length > 0
            ? qandaItems.slice(0, NO_OF_QA_DISPLAY_IN_HOMEPAGE).map(qalist =>
              <div className="mb-3" key={qalist?.Question}>
                <p className="m-0">
                  <Link
                    to='/qa'
                    title={qalist.Question}
                    className="segoeui-semibold font13 color-primary links-over-underline"
                  >
                    {qalist.Question}
                  </Link>
                </p>
                Answer: <p tabIndex={0} aria-label={qalist.Answer} className="m-0 lineClamp2 sourcesanspro hmdescription" dangerouslySetInnerHTML={{
                  __html: returnDashesIfNull(decodeHTML(qalist.Answer))
                }}></p>
                <p tabIndex={0} aria-label={qalist.Description} className="m-0 lineClamp2 sourcesanspro hmdescription" dangerouslySetInnerHTML={{
                  __html: returnDashesIfNull(decodeHTML(qalist.Description))
                }}>
                </p>
                <p tabIndex={0} aria-label={qalist.ItemCreated} className="m-0 sourcesanspro subtitle-color">
                  {qalist?.ItemCreatedBy?.Title + ' | ' + convertDate(qalist.ItemCreated, 'date')}
                </p>
              </div>
            )
            : <div className='min-h-200 d-flex align-items-center justify-content-around'>
              <Noresult />
            </div>}
        </div>
      </div>
      </>)}
    </>
  )
}
