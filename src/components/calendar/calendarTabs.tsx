import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule'
import { Calendar } from '@fullcalendar/core'
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import './calendar.css'
import CalendartabItem from './calendartabItem'
import Noresult from '../noresult/noresult'
import { NO_OF_CALENDAR_DISPLAY_IN_HOMEPAGE } from '../../configuration'
interface CalendarEvent {
  ID: number;
  title: string;
  EventDate: string;
  EndDate: string;
  FreeBusy: any;
  rrule: any;
  _instance: any;
  extendedProps: any;
  _def: any;
}

const DashboardCalendar: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [nextThreeEvents, setNextThreeEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    fetchCalendarData()
  }, [])

  const fetchCalendarData = async () => {
    try {
      const list = sp.web.lists.getByTitle('CalendarList')
      const items = await list.items.getAll()
      items.sort((a, b) =>
        a.Modified > b.Modified ? 1 : -1)
      const itemPromises = items.map(async (item) => {
        const AttachmentFile = await list.items.getById(item.Id).attachmentFiles.get()
        return {
          ...item,
          title: item?.Title?.toUpperCase(),
          start: new Date(item.EventDate).toISOString(),
          end: new Date(item.EndDate).toISOString(),
          AttachmentFiles: AttachmentFile
        }
      })
      const modifiedItems = await Promise.all(itemPromises)
      setCalendarEvents(modifiedItems)
    } catch (error) {
      console.error(error)
    }
  }
  const calendarEl = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const parsedEvents = calendarEvents?.map((item) => {
      const parsedItem: CalendarEvent = { ...item }
      try {
        parsedItem.rrule = JSON.parse(item?.FreeBusy)
      } catch (e) {
        parsedItem.rrule = null
      }
      return parsedItem
    })
    if (calendarEl.current) {
      const calendar = new Calendar(calendarEl.current, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
        initialView: 'dayGridMonth',
        events: parsedEvents,
        timeZone: 'UTC'
      })
      calendar.render()
      const currentDate = new Date()

      const next3Events: any = calendar.getEvents()
        .filter(event => {
          if (event.extendedProps.fAllDayEvent) {
            const eventEndTime = event?._instance?.range.end
            if (eventEndTime) {
              return currentDate.getTime() < eventEndTime.getTime()
            }
          } else {
            const eventEndTime = event?._instance?.range.end
            if (eventEndTime) {
              return currentDate.getTime() < eventEndTime.getTime()
            }
          }
          return false
        })
        .sort((a, b) => {
          const startTimeA = a.start
          const startTimeB = b.start
          if (startTimeA && startTimeB) {
            return startTimeA.getTime() - startTimeB.getTime()
          }
          if (!startTimeA && startTimeB) {
            return 1
          }
          if (startTimeA && !startTimeB) {
            return -1
          }
          return 0
        })
        .slice(0, NO_OF_CALENDAR_DISPLAY_IN_HOMEPAGE)
      setNextThreeEvents(next3Events)
    }
  }, [calendarEvents])

  const calendarItems = nextThreeEvents.map((cal: CalendarEvent) => {
    const parsedEvent = calendarEvents.find((item) => item.ID === cal?.extendedProps?.ID)
    let parsedRrule
    try {
      parsedRrule = JSON.parse(parsedEvent?.FreeBusy)
    } catch (e) {
      return false
    }

    let startDateDay: Date | undefined
    if (parsedRrule?.count > 1 ||
      parsedRrule?.byweekday?.length > 0 ||
      parsedRrule?.bysetpos !== null ||
      parsedRrule?.bymonthday !== null ||
      parsedRrule?.bymonth !== null
    ) {
      startDateDay = new Date(cal._instance.range.start)
    }

    const startDateTime = new Date(parsedRrule?.dtstart)
    const endDateTime = new Date(parsedRrule?.until)

    const localStartDateTime = startDateTime.toLocaleString()
    const localEndDateTime = endDateTime.toLocaleString()

    return (
      <CalendartabItem
        key={cal.extendedProps.ID}
        ID={cal.extendedProps.ID}
        title={cal._def.title}
        location={cal.extendedProps.Location}
        description={cal.extendedProps.Description}
        recurringStartingDay={startDateDay}
        start={localStartDateTime}
        end={localEndDateTime}
      />
    )
  })

  return (
    <>
      <div className="card-header pb-0 d-flex align-items-center justify-content-between">
        <div className="d-flex mb-2 title-border">
          <div tabIndex={0} aria-label="Calendar" className="segoeui-bold font-14">
          Calendar
          </div>
        </div>
        {nextThreeEvents?.length > NO_OF_CALENDAR_DISPLAY_IN_HOMEPAGE &&
        <Link title="View All" to={{
          pathname: '/calendar',
          state: { calendarEvents }
        }} className="font-12 links text-decoration-underline">
          View All
        </Link>}
      </div>
      <div className="card-body pt-0">{calendarItems}</div>
      {nextThreeEvents.length === 0 && (
        <div className='min-h-200 d-flex align-items-center justify-content-around'>
          <Noresult />
        </div>
      )}
      <div style={{ display: 'none' }} ref={calendarEl}></div>
    </>
  )
}

export default DashboardCalendar
