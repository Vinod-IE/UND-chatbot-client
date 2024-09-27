/* eslint-disable camelcase */
import { Link } from 'react-router-dom'
import React from 'react'
import { knowledgearticles } from './knowledge-articles-data'
import Noresult from '../noresult/noresult'
export default function KnowledgeArticles(props: any) {
  // const knowledgeArticles: Array<I_KnowledgeGraph> = useGetKnowledgeGraphs()

  return (
    <>
      <div className="card-header pb-0 d-flex justify-content-between align-items-center">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Knowledge Articles" className="segoeui-bold font-14">
            <span className='icon-trendingquestions me-0 title-color6'></span> Knowledge Articles
          </div>
        </div>
      </div>
      <div className="d-flex flex-column pt-3 card-body">
        <div className="font-13 pe-1">
          {knowledgearticles.slice(0, 4).map(knowledgearticlesdata =>
            <div className="mb-3 widget-data border-bottom1 pb-3" key={knowledgearticlesdata.title}>
              <p className="m-0">
                <Link
                  to={knowledgearticlesdata.link}
                  title={knowledgearticlesdata.title}
                  className="poppins-semibold font13 darktext lineclamp1"
                >
                  {knowledgearticlesdata.title}
                </Link>
              </p>
              <p tabIndex={0} aria-label={knowledgearticlesdata.subcontent} className="m-0 pt-1 sourcesanspro subtitle-color">
                {knowledgearticlesdata.subcontent}
              </p>
            </div>
          )}
          {knowledgearticles.length <= 0 &&
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
