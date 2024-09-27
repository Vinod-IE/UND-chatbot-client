/* eslint-disable no-script-url */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import './tabs.css'
import { event } from 'jquery'
interface Props {
  pagetitle?: any
  pagetitleClass?: any
  items?: any,
  mainTabsclass?: any,
  tabsul?: any,
  tablistclassName?: any,
  className?: any,
  type?: any,
  anchorclass?: any,
  id?: any,
  isButtons?: any,
  tabscontentarea?: any,
  badge?: any,
  contentstyles?: any,
  isInfo?: any,
  infoClassName?: any,
  info?: any,
  infoIcon?: any,
}
export default function Tabs(props: any) {
  const [items, setItems] = useState(props.items)
  const [bottonhide, setBottonhide] = useState(false)
  const [selectedTab, setSelectedTab] = useState<number | undefined>()
  const show = (event: any, selectedIndex: number) => {
    event.preventDefault()
    const tabs = [...props.items]
    props.setActiveTab(selectedIndex)
    tabs.map((item: any, index: number) => {
      if ('is_active' in item) {
        item.is_active = false
        if (selectedIndex === index) {
          item.is_active = true
        }
      }
      return item
    })
    setItems([...tabs])
    setSelectedTab(selectedIndex)
  }
  useEffect(() => {
    props.statusNotesActive && show(event, 1)
  }, [props.statusNotesActive])
  useEffect(() => {
    setItems(props?.items)
  }, [props?.items])
  return (
    <div className={props?.mainTabsclass ? `tabs ${props?.mainTabsclass}` : 'tabs'}>
      <div className={props?.className ? `customtabs ${props?.className}` : 'customtabs'} >
        <ul className={props?.tabsul}>
          {props?.pagetitle && <h2 className={props?.pagetitleClass} tabIndex={0} aria-label={props?.pagetitle}>{props?.pagetitleicon && <span className={props?.pagetitleicon}></span>}{props?.pagetitle}</h2>}
          <div className={props?.tablistclassName ? `customtabs-list ${props?.tablistclassName}` : 'customtabs-list'}>
            {
              props?.items?.map((item: any, index: number) => {
                return (
                  <li key={item?.tabtitle}>
                    <a tabIndex={0} href="javascript:void(0)" title={item?.title || item?.tabtitle} key={index} onClick={(event) => show(event, index)} className={item.is_active ? props?.anchorclass ? `active ${props?.anchorclass}` : 'active' : props?.anchorclass ? `${props?.anchorclass}` : ''}>
                      {item?.icon && <span className={item?.icon}></span>} {item?.tabtitle} {props?.badge && <span className={props?.badge}>{item?.count}</span>}
                      {props?.isInfo && <span className={props?.infoClassName} data-tip={props?.info || item?.tabtitle} >
                        <span className={props?.infoIcon}></span>
                      </span>}
                    </a>
                  </li>
                )
              })
            }
          </div>
          <div className={props?.isButtonsClassName}>
              {!bottonhide && props?.isButtons}
          </div>
        </ul>
      </div>
      <div className={props?.tabscontentarea}>
        {
          props?.items?.map((item: any, index: number) => {
            return (
              <>
                {item.is_active && <div key={index} className={`customtabs-content ${item.is_active ? 'active' : ''}`}>
                  <div className={props?.contentstyles}>{item?.content}</div>
                </div>}</>
            )
          })
        }
      </div>
    </div>
  )
}
