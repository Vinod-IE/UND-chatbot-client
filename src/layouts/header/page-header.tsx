/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react'
// types
import { PageHeaderProps } from './header.types'
const PageHeader = (props: PageHeaderProps) => {
  const [pageheaderHeight, setpageHeaderHeight] = useState<number>(0)
  window.addEventListener('resize', handleWindowResize)
  useEffect(() => {
    // Get header height based on attribute or tag
    handleWindowResize()
  }, [])
  function handleWindowResize() {
    const headerElement = document.querySelector('[data-pageheader="true"]')
    if (headerElement instanceof HTMLElement) {
      const height = headerElement.offsetHeight
      setpageHeaderHeight(height)
    }
  }
  useEffect(() => {
    // Update CSS variable when headerHeight changes
    document.documentElement.style.setProperty('--pageheader-height', `${pageheaderHeight}px`)
  }, [pageheaderHeight])
  const [count, setCount] = useState('')
  useEffect(() => {
    if (props?.count < 10) {
      setCount('0' + props?.count)
    } else {
      setCount(props?.count)
    }
  }, [props])
  return (
    <>
    <div data-pageheader="true" className='pageheader pb-1 pt-5 px-3 d-flex justify-content-between align-items-start align-items-sm-center flex-wrap sticky-lg-top p-relative'>
      <div className="d-flex align-items-center py-1">
        {props?.leftExtras &&
          <>{props?.leftExtras}</>
         }
        {props?.name && <div tabIndex={0} aria-describedby='pagetitles' id="pagetitles" className='d-flex align-items-center segoeui-semibold darktext font-20'>
          {props?.icon && <span className={`${props.icon}  font-18 pe-1`}></span>}
          <h2 className={`segoeui-semibold  ${props?.titleClass}`}>{props.name}
          {props?.subtitle && <p className={props?.subTitleClass}>{props.subtitle}</p>}
          </h2>
          
          {props?.count &&
            <span className="badge bgcolor-secondary border-radius3 px-1 whitetext ms-2" aria-label={count}> {count}</span>
          }
          {props?.titleExtras &&
            <div className='h-100' status-kpis={props?.titleExtrasColor}>
              <span className={props?.titleExtrasClassName}>{props?.titleExtras}</span>
            </div>
          }
        </div>
        }
        {props?.toolTip &&
          <>
            {props.toolTip}
          </>
        }
      </div>
      <div className='d-flex flex-column flex-sm-row align-items-md-center  maxfitcontent-sm ms-auto'>
        <div className="d-flex flex-wrap flex-column flex-sm-row justify-content-sm-end gap-2">
          {props.extras &&
            <>
              {props.extras}
            </>
          }
        </div>
      </div>
    </div>
    </>
  )
}
export { PageHeader }
