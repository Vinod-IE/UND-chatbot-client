import React from 'react'
import './buttons.css'
import Tooltip from '../tooltip/tooltips'
const Buttons = (props: any) => {
  return (
    <>
        {props?.licon && <span className={`${props?.licon}`}></span>}
        <button ref={props.ref} id={props?.id} disabled={props.disabled} type={props?.type || 'button'} aria-label={props['aria-label'] || props?.label} className={`btn ${props?.className}`} value={props?.showhide} onClick={props?.onClick} onMouseOver={props?.onMouseOver} onMouseOut={props?.onMouseOut} title={props['aria-label'] || props?.label}>{props?.icon && <span className={`${props?.icon}`}></span>} {props?.label} {props?.ricon && <span className={`${props?.ricon}`}></span>}
            {/* {props?.isInfo && <span className={props?.infoClassName} data-tip={props?.info} >
                <span className={props?.infoIcon}></span>
            </span>} */}
              {props?.info && <Tooltip content = {props?.info}>
                  <span className={`icon-info ps-1 color-primary ${props?.infoClassName}`}></span>
              </Tooltip>}
        </button>
    </>
  )
}
export default (Buttons)
