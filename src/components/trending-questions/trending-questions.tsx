/* eslint-disable camelcase */
import { Link } from 'react-router-dom'
import React from 'react'
import { trendingquestions } from './trending-questions-data'
import Noresult from '../noresult/noresult'
export default function Trendingquestions(props: any) {
  // const knowledgeArticles: Array<I_KnowledgeGraph> = useGetKnowledgeGraphs()

  return (
    <>
      <div className="card-header pb-0 d-flex justify-content-between align-items-center">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Trending Quetions" className="segoeui-bold font-14">
            <span className='icon-trendingquestions me-0 title-color6'></span> Trending Quetions
          </div>
        </div>
      </div>
      <div className="d-flex flex-column pt-3 card-body">
        <div className="font-13 pe-1">
          {trendingquestions.slice(0, 4).map(knowledgearticles =>
            <div className="mb-3 widget-data border-bottom1 pb-3" key={knowledgearticles.title}>
              <p className="m-0">
                <Link
                  to={knowledgearticles.link}
                  title={knowledgearticles.title}
                  className="poppins-semibold font13 darktext lineclamp1"
                >
                  {knowledgearticles.title}
                </Link>
              </p>
              <p tabIndex={0} aria-label={knowledgearticles.subcontent} className="m-0 pt-1 sourcesanspro subtitle-color">
                <span className={`border-right2 pe-1 me-1 ${knowledgearticles.icon}`}></span> {knowledgearticles.subcontent}
              </p>
            </div>
          )}
          {trendingquestions.length <= 0 &&
            <div className='min-h-200 d-flex align-items-center justify-content-around'>
              <Noresult />
            </div>
          }
        </div>

      </div>
      <div className='card-footer border-top1'>
        <Link title="View More" to="/qa" className="segoeui-semibold font-12 darktext">
          Show More
        </Link>
      </div>
    </>)
}
