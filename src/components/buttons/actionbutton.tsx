/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import React, { useImperativeHandle} from 'react'

interface Props {
    props?:any,
    ref?:any,
    inputProps?:any,
    onClick?:any,
    onmousehover?:any
     reference?:any,
     label?: any,
     className?: any,
     type? : any,
     btnclassName? : any,
     id?: any,
     isClick?: any,
     badgeinfo?: any,
     badge? : any,
     ricon? : any,
     icon?: any,
     name? : any,
     showhide?: any,
     displayname?: any,
     'aria-label'?: any,
     isAccordionToggle?: boolean,
     onScroll?:any
     isFixedPopup?:any
     fixedpopuptopposition?:any
     parentscrollPosition?: any
     fixedpopupleftposition?:any
     popupCloseOpenFunctionality: (params: any, a : any, b: any, c: any, d: any, f: any, g: any, h?: any, j?: any, k?: any) => any;
  }
const ActionButtons = React.forwardRef((props: Props, ref: any) => {
  let showhide = false
  useImperativeHandle(ref, () => ({
    buttonRefs: () => {
      showhide = false
    }
  }))
  const popupopenclose = (ele:any) => {
    if (props?.onClick) { props?.onClick() }
    const elementHeight = ele.currentTarget.offsetHeight
    const offsettopValue = ele.currentTarget.offsetTop
    const elementRect = ele.currentTarget.getBoundingClientRect()
    const fixedpopuptopValue = elementHeight + elementRect.top
    const fixedpopupleftValue = elementRect.left
    const offsetWidthValue = ele.currentTarget.offsetWidth
    const offsetLeftValue = ele.currentTarget.offsetLeft
    const popupTop = ((elementHeight + offsettopValue))
    const popupLeft = ((offsetWidthValue + offsetLeftValue))
    const data = ele.currentTarget.attributes
    let displayName = ''
    for (const element of data) {
      if (element.nodeName === 'value' && element.nodeValue === 'false') {
        showhide = true
      }
      if (element.nodeName === 'data-displayname') {
        displayName = element.nodeValue
      }
    }

    props?.props?.popupCloseOpenFunctionalityWork(displayName)
    props.popupCloseOpenFunctionality(displayName, showhide, popupTop, popupLeft, offsetLeftValue, elementHeight, offsetWidthValue, fixedpopuptopValue, fixedpopupleftValue)
    if (props?.isAccordionToggle) {
      props.popupCloseOpenFunctionality(props?.id, showhide, popupTop, popupLeft, offsetLeftValue, elementHeight, offsetWidthValue)
      ele?.stopPropagation()
    }
    if (props?.isFixedPopup) {
      props.popupCloseOpenFunctionality(props?.id, showhide, popupTop, popupLeft, offsetLeftValue, elementHeight, offsetWidthValue, fixedpopuptopValue, fixedpopupleftValue)
      ele?.stopPropagation()
    }
  }
  return (
        <div className={props?.btnclassName ? `button-container ${props?.btnclassName}` : 'button-container'}>
            <button type={props?.type || 'button'} id={props?.id} aria-label={props['aria-label'] || props?.label} className={`btn ${props?.className}`} onClick={popupopenclose} onMouseOver={props?.onmousehover && popupopenclose} onMouseOut={props?.onmousehover && popupopenclose} data-displayname={props?.isClick} value={props?.showhide} title={props['aria-label'] || props?.label}>{props?.icon && <span className={props?.icon}></span>} {props?.name} {props?.ricon && <span className={props?.ricon}></span>} {props?.badgeinfo && <sup className={props?.badge}>{props?.badgeinfo}</sup>}</button>
        </div>
  )
}
)
export default ActionButtons
