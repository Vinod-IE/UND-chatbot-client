/* eslint-disable react/no-unknown-property */
import { AllPrograms, Actions, Notifications } from './notifications-data'
import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  tabId?:any,
}

export default function Notificationtabcontent (props : Props) {
  let notificationItems : any = []
  if (props.tabId === 'all') {
    notificationItems = AllPrograms
  }
  if (props.tabId === 'actions') {
    notificationItems = Actions
  }
  if (props.tabId === 'notifications') {
    notificationItems = Notifications
  }
  const listItems = notificationItems.map((items : any) =>
        <li tabIndex={0} aria-describedby={items.id} id={items.id} className={items.listclassname} notification-code={items.colorcode} key={items.idcontent}>
                    <div>
                      <span>{items.content1}</span>
                      <Link
                        to="#"
                        title={items.idcontent}
                        className="links"
                      >
                        {items.idcontent}
                      </Link>
                      <span> {items.content2}</span>
                    </div>
                    <div className="subtitle-color2 latoregular">
                    {items.date}
                    </div>
                  </li>
  )
  return (
        <>
        <ul>
            {listItems}
            </ul>
        </>
  )
}
