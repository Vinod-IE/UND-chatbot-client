/* eslint-disable react/no-unknown-property */
/* eslint-disable no-script-url */
import React, { useState, useEffect, useRef, useContext } from 'react'
import './accordions.css'
import Buttons from '../buttons/buttons'
import Noresult from '../noresult/noresult'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
interface Props {
  actionbuttons?: any;
  kpicode?: any;
  setheight?: any,
  items: any,
  inputProps: any,
  titleIcon?: any,
  label?: any,
  className: any,
  isClick?: any,
  icon?: any,
  titlecollapsedIcon?: any;
  headerextras?: any;
  extrasClass?: any;
  titleclassName?: any;
  titleClass?: any;
  titlecontentclassName?: any;
  actions?: any;
  count?: any;
  defaultActivekey?: any
  'aria-label'?: any,
  accordionitemclass?: any,
  dividerClass?: any,
  content?: any;
  statukpis?: any
  contentclassName?: any,
  dataobj?: any
  IsEdit?: any,
  ItemId?: any,
  renderHtml?: any,
  isSettings?: boolean,
  isExpandAll?: any,
  extras?: any,
  extras1?: any,
  extras1Class?: any,
  isExtra?: boolean,
  showAddPopup?: boolean,
  popupBodyRef?:any,
  popupScrollRef?:any
}
export default function Accordions(props: Props) {
  const [clicked, setClicked] = useState<any>(0)
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const [expandall, setExpandall] = useState<boolean>(false)
  const toggle = (index: number, value: any) => {
    setExpandall(false)
    // props?.IsEdit(false)
    setExpandall(false)
    if (props?.isSettings) { props?.dataobj(index) }
    if (props?.setheight) { props?.setheight(true) }
    if (clicked === index && value === 'expanded') {
      return setClicked(null)
    } else if (value !== 'expanded') {
      return setClicked(index)
    }
    return setClicked(index)
  }
useEffect(() =>{
  if(clicked)
  setMultiplePopup()
},[clicked])
  useEffect(() => {
    if (props?.ItemId?.ID) {
      setClicked(props?.ItemId?.ID)
    } else if (props?.ItemId) {
      setClicked(props?.ItemId)
    } else if (props?.ItemId === null) {
      setClicked(0)
    }
  }, [props?.ItemId])
  useEffect(() => {
    setExpandall(props?.isExpandAll)
  }, [props?.isExpandAll])
  useEffect(() => {
    if (props?.showAddPopup) {
      setClicked(null)
    }
  }, [props?.showAddPopup])
  useEffect(() => {
    if (props?.defaultActivekey) {
      setClicked(props?.defaultActivekey)
    }
  }, [props?.defaultActivekey])
  return (
    <div>
      <div className={props?.className}>
        {props?.items?.length > 0
          ? props?.items?.map((item: any) => {
            const options: any = {}
            if (item.kpicode) {
              options['status-kpis'] = item.kpicode
            }
            return (
              <div className={clicked === item?.Id || expandall ? props?.accordionitemclass ? `accordion-item active ${props?.accordionitemclass}` : 'accordion-item active' : props?.accordionitemclass ? `accordion-item ${props?.accordionitemclass}` : 'accordion-item'} key={item?.title}>
                <div className={props?.inputProps?.accordionheadClass}>
                  <a className={props?.inputProps?.className ? `accordion-head ${props?.inputProps?.className}` : 'accordion-head'} href='javascript:void(0)' title={item?.titlename || item?.title} key={item?.Id} onClick={() => toggle(item?.Id, clicked === item?.Id || expandall ? 'expanded' : 'collapsed')} {...options} >
                    {item?.extras && <span>{item?.extras}</span>} {props?.titleIcon && <span className={clicked === item?.Id ? props?.titleIcon : props?.titlecollapsedIcon}></span>}  <span className={props?.titleClass}>{item?.title}</span> {item?.count > -1 && <span className={props?.count}>{item?.count}</span>}
                    {props?.icon && <span className={clicked === item?.Id ? props?.icon : `rotate180 ${props?.icon}`}></span>} {item?.isExtra && <span className={props?.extras1Class}>{item?.extras1(item?.title)}</span>}
                    {props?.headerextras &&
                      <div className={props?.extrasClass}>
                        {props?.headerextras.map((i: any, index: number) =>
                          <>
                            <div className={i?.classq}>
                              <div className={props?.titleclassName}> {i.name === 'Templates' ? '' : i.name}</div>
                              <div className={props?.titlecontentclassName}>{i.name === 'Is Archived' ? (item?.[i.name] === true ? 'Yes' : 'No') : item?.[i.name]}</div>
                            </div>
                            <div className={props?.dividerClass}>
                            </div>
                          </>
                        )
                        }
                      </div>
                    }
                  </a>
                  <div className={`d-flex gap-1 ${props?.actionbuttons}`}>
                    {props?.actions?.map((poclist: any) =>
                      <Buttons key={poclist?.label}
                        label={poclist?.label}
                        aria-label={poclist?.alabel}
                        icon={poclist?.icon}
                        className={poclist?.className}
                        onClick={() => poclist?.onClick(item)}
                        ref={props?.popupScrollRef}
                      />
                    )}
                  </div>
                </div>
                {props?.isSettings && <div className={props?.inputProps?.contentclassName ? `accordion-content ${props?.inputProps?.contentclassName}` : 'accordion-content'}>{props?.renderHtml(item, clicked)}</div>}
                {item?.content && <div className={props?.inputProps?.contentclassName ? `accordion-content ${props?.inputProps?.contentclassName}` : 'accordion-content'}>{item?.content}</div>}
                {props?.content && <div className={props?.inputProps?.contentclassName ? `accordion-content ${props?.inputProps?.contentclassName}` : 'accordion-content'}>{props?.content}</div>}
              </div>
            )
          })
          : !props?.showAddPopup && <div className='min-h-200 d-flex align-items-center justify-content-around'>
            <Noresult />
          </div>}
      </div>
    </div>
  )
}
