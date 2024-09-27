import React, { useEffect, useState, useRef, useContext } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule'
import { Calendar } from '@fullcalendar/core'
import './calendar.css'
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import { Modal, ModalBody } from 'reactstrap'
import AddEventForm from './addevent/addeventform'
import Buttons from '../../../../components/buttons/buttons'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
interface CalendarEvent {
    Id: number;
    Title: string;
    EventDate: string;
    EndDate: string;
    FreeBusy: string;
    rrule:any;
    
}
const CalendarSettings: React.FC = () => {
  const [showEventForm, setShowEventForm] = useState<boolean>(false)
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [eventRRule, setEventRRule] = useState<string | undefined>()
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const isInitialLoad = useRef(true)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)

  const fetchCalendarData = async () => {
    try {
      const list = sp.web.lists.getByTitle('CalendarList')
      const items = await list.items.getAll()
      items.sort((a, b) =>
        a.Modified > b.Modified ? 1 : -1)
      const itemPromises = items.map(async (item:any) => {
        const AttachmentFile = await list.items.getById(item.Id).attachmentFiles.get()
        return {
          ...item,
          title: item.Title.toUpperCase(),
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
  useEffect(() => {
    if(isEdit || showEventForm  ) {
      setMultiplePopup()
    }
  }, [isEdit, showEventForm])
  useEffect(() => {
    if (refresh || isInitialLoad.current) {
      fetchCalendarData()
      isInitialLoad.current = false
      setRefresh(false)
    }
  }, [refresh])

  // Inside the useEffect block
  const calendarEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const parsedEvents = calendarEvents.map((item) => {
      const parsedItem: CalendarEvent = { ...item }
      try {
        parsedItem.rrule = JSON.parse(item?.FreeBusy)
      } catch (e) {
        console.log(e)
      }
      return parsedItem
    })

    if (calendarEl.current) {
      const calendar = new Calendar(calendarEl.current, {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        dayMaxEvents: true,
        events: parsedEvents,
        eventClick: selectEvent,
        eventContent: function (info) {
          const title = info.event.title
          const timeText = info.timeText.replace('a', 'AM').replace('p', 'PM')
          return {
            html: `<div title="${title}"><b>${timeText}</b><span> ${title}</span></div>`
          }
        }
      })

      calendar.render()
    }
  }, [calendarEvents])

  const selectEvent = (info:any) => {
    const event = info.event
    setShowEventForm(true)
    setEditEvent(event)
    const item = calendarEvents.find((i) => i.Id === event?.extendedProps?.Id)
    setEventRRule(item?.FreeBusy)
    setIsEdit(true)
  }

  const addCalendarEventHandler = () => {
    setShowEventForm(true)
    setEditEvent(null)
    setIsEdit(false)
    setRefresh(!refresh)
    setEventRRule('')
  }

  const getRefresh = () => {
    setRefresh(true)
  }

  const refreshAfterSave = () => {
    setShowEventForm(false)
  }

  const hideModalHandler = () => {
    setShowEventForm(false)
  }
  return (
        <>
            <div className="d-flex align-items-center justify-content-between settingheader">
                <div className="d-flex justify-content-between tabsheads p-absolute">
                    <h2
                        className="montserratSemibold font16 text-color4"
                        tabIndex={0}
                        aria-label="CALENDAR"
                    >
                        CALENDAR
                    </h2>
                </div>
                <Buttons
            label="ADD"
            aria-label="Add"
            icon="icon-add me-1"
            className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius no-border mb-2'
            onClick={addCalendarEventHandler}
          />
            </div>
            <Modal
                isOpen={showEventForm}
                toggle={addCalendarEventHandler}
                className='modalpopup border-radius2'
                wrapClassName='modalpopupmain'
            >
                <ModalBody>
                    <AddEventForm
                        onClose={hideModalHandler}
                        closeAfterSubmit={refreshAfterSave}
                        editEvent={editEvent}
                        sendRefresh={getRefresh}
                        eventRRule={eventRRule}
                        isEdit={isEdit}
                    />
                </ModalBody>
            </Modal>
            <div ref={calendarEl}></div>
        </>
  )
}

export default CalendarSettings
