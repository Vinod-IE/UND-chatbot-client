/* eslint-disable no-script-url */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
import './tabs.css'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
export default function Vtabs(props: any) {
  const [items, setItems] = useState(props.items)
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const [popupClose, setPopupClose ]= useState(false)
  useEffect(() => {
    setMultiplePopup()
  }, [popupClose])
  function show(event: any, index: number) {
    const tabs = items
    tabs.map((item: any, index_item: any) => {
      item.is_active = 'false'
      if (index === index_item) {
        item.is_active = 'true'
      }
      return item
    })
    setItems([...tabs])
    setPopupClose(!popupClose)
  }
  return (
    <div className={props?.mainTabsclass ? `tabs ${props?.mainTabsclass}` : 'tabs'}>
      <div className={props?.className ? `customtabs ${props?.className}` : 'customtabs'} >
        <ul className={props?.tabsul}>
          <div className={props?.tablistclassName ? `customtabs-list ${props?.tablistclassName}` : 'customtabs-list'}>
            {
              items.map((item: any, index: number) => {
                return (
                  <>
                    <li id={`vtabs-${index}`}>
                      <a tabIndex={0} href="javascript:void(0)" title={item?.title || item?.tabtitle} key={index} onClick={(event) => show(event, index)} className={item.is_active === 'true' ? props?.anchorclass ? `active ${props?.anchorclass}` : 'active' : props?.anchorclass ? `${props?.anchorclass}` : ''}>
                        {item?.icon && <span className={item?.icon}></span>} {item?.tabtitle} {props?.badge && <span className={props?.badge}>{item?.count}</span>}
                      </a>

                    </li>
                    {/* {item.is_active === 'true' && <div key={index} className={`customtabs-content ${props?.vtabscontentclassName} ${item.is_active === 'true' ? 'active' : ''}`}>

                      <div className={props?.contentstyles}>{item?.content}</div>
                    </div>} */}

                  </>
                )
              })
            }
          </div>
          {props?.isButtons}
        </ul>
        {items.map((item: any, index: number) => (
            item.is_active === 'true' && (
              <div key={index} className={`customtabs-content ${item.is_active === 'true' ? 'active' : ''} ${props?.vtabscontentclassName}`}>
                <div className={props?.contentstyles}>{item?.content}</div>
              </div>
            )
          ))}
      </div>

    </div>
  )
}
