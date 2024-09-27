import React from 'react'
import './calendartabitem.css'

interface CalendarTabItemProps {
  ID: number;
  title: string;
  recurringStartingDay: string | null |any;
  start: string | null |any ;
  end: string | null | any;
  location: string | null;
  description: string | null;
}

const CalendarTabItem: React.FC<CalendarTabItemProps> = (props) => {
  const monthLookup:any = {
    0: 'JAN',
    1: 'FEB',
    2: 'MAR',
    3: 'APR',
    4: 'MAY',
    5: 'JUN',
    6: 'JUL',
    7: 'AUG',
    8: 'SEP',
    9: 'OCT',
    10: 'NOV',
    11: 'DEC'
  }

  const timeFormat:any = { hour: 'numeric', minute: 'numeric' }
  const dateFormat:any = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' }

  const startDayOfMonth = props.recurringStartingDay ? new Date(props.recurringStartingDay).getDate() : new Date(props.start).getDate()
  const startMonth = props.recurringStartingDay ? monthLookup[new Date(props.recurringStartingDay).getMonth()] : monthLookup[new Date(props.start).getMonth()]

  const fullDateStart = new Date(props.start).toLocaleString('en-US', dateFormat)
  const fullDateEnd = new Date(props.end).toLocaleString('en-US', dateFormat)
  const toFromTimeFormat = `${new Date(props.start).toLocaleTimeString('en-US', timeFormat)} to ${new Date(props.end).toLocaleTimeString('en-US', timeFormat)}`

  const displayText = (text: string | null, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }
  const displayDescription = (description: string | null, maxLength: number) => {
    if (description && description.length > maxLength) {
      return description.substring(0, maxLength) + '...'
    }
    return description
  }

  const displayedTitle = displayText(props.title, 27)
  const displayedDescription = displayDescription(props.description, 27)
  const displayedLocation = displayText(props.location, 27)

  if (props.end && new Date(props.end) < new Date()) {
    return null
  }

  return (

    <div className="mb-2 calenderlist bordered1 border-radius1 p-1 pe-3 dots d-flex p-relative" key={displayedTitle}>
          <div tabIndex={0} aria-describedby='eventdatemonth' id="eventdatemonth" className="p-2 py-1 border-right2 me-2 title-color8 mb-1 montserratbold text-center">
            <p>{startDayOfMonth}</p>
            <p>{startMonth}</p>
          </div>
          <div tabIndex={0} aria-live="polite" className="meetings-border-left">
          <div className="title-color1 font-14">{displayedTitle}</div>
            <div className="subtitle-color">
            Venue: {displayedLocation} | Time: {fullDateStart} {fullDateEnd}
            </div>
          </div>

          <div className="calendarpopup">
              <div className="divarrow"></div>
              <div className="calendarpopupinfo">
                <h2 tabIndex={0} aria-label={props.title}>{displayedTitle}</h2>
                <div className="divcalendarinfo w-100 position-relative">
                  <ul className="m-0 p-0 w-100 list-type-none">
                    <li className='mb-1'>
                      Start: <span>{fullDateStart}</span>
                    </li>
                    <li className='mb-1'>
                      End: <span>{fullDateEnd}</span>
                    </li>
                    <li className='mb-1'>
                    Venue: <span>{displayedLocation}</span>
                    </li>
                  </ul>
                  <h3 tabIndex={0} aria-label="Description">Description:</h3>
                  <p tabIndex={0} aria-live="polite">{displayedDescription}</p>
                </div>
              </div>
            </div>
        </div>
  )
}

export default CalendarTabItem
