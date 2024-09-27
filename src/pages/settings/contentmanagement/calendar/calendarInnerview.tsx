import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule'
import { Calendar } from '@fullcalendar/core'
import './calendar.css'
import { Modal, ModalBody } from 'reactstrap'
import { PageHeader } from '../../../../layouts/header/page-header'
import Buttons from '../../../../components/buttons/buttons'
import { sp } from '@pnp/sp'
import { DocumentIconNames } from '../../../../Global'

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
interface CalendarInnerviewProps {
  onClose: () => void;
}
interface LocationState {
  calendarEvents: CalendarEvent[];
}

const CalendarInnerview: React.FC<CalendarInnerviewProps> = (props) => {
  const [calendarEvents, setCalendarEvents] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [calendarIndividualEvent, setCalendarIndividualEvent] = useState<CalendarEvent | undefined>()
  const [thisEventStartDate, setThisEventStartDate] = useState<string | undefined>()
  const [thisEventEndDate, setThisEventEndDate] = useState<string | undefined>()
  const location = useLocation<LocationState>()
  const fetchCalendarData = async () => {
    try {
      const list = sp.web.lists.getByTitle('CalendarList')
      const items = await list.items.getAll()
      items.sort((a, b) =>
        a.Modified > b.Modified ? 1 : -1)
      const itemPromises = items.map(async (item: any) => {
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
    fetchCalendarData()
  }, [])
  useEffect(() => {
    setCalendarEvents(location?.state?.calendarEvents)
  }, [location?.state?.calendarEvents])

  const calendarEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const parsedEvents = calendarEvents?.map((item: any) => {
      const parsedItem = { ...item }
      try {
        parsedItem.rrule = JSON.parse(item?.FreeBusy)
        parsedItem.rrule.byweekday = parsedItem?.rrule?.byweekday[0]
      } catch (e) { console.log(e) }
      return parsedItem
    })

    const calendar = new Calendar(calendarEl.current!, {
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
  }, [calendarEvents])

  const selectEvent: any = (event: { event: CalendarEvent }) => {
    setShowModal(true)
    setCalendarIndividualEvent(event.event)
    dateConverter(event.event)
  }

  const dateConverter = (calendarEvent: CalendarEvent) => {
    const parsedEvent = calendarEvents.find((item: any) => item.ID === calendarEvent?.extendedProps?.ID)
    let parsedRrule
    try {
      parsedRrule = JSON.parse(parsedEvent?.FreeBusy)
    } catch (e) { console.log(e) }

    let startDateTime: Date
    let endDateTime: Date

    const firstHyphenIndexStart = parsedRrule?.dtstart?.indexOf('-')
    if (firstHyphenIndexStart === 2) {
      const isoFormatStart =
        parsedRrule.dtstart.slice(6, 10) +
        '-' + parsedRrule.dtstart.slice(3, 5) +
        '-' + parsedRrule.dtstart.slice(0, 2) +
        'T' + parsedRrule.dtstart.slice(11, 19) + '.000Z'
      startDateTime = new Date(isoFormatStart)
    } else {
      startDateTime = new Date(parsedRrule?.dtstart)
    }
    const firstHyphenIndexEnd = parsedRrule?.until?.indexOf('-')
    if (firstHyphenIndexEnd === 2) {
      const isoFormatEnd =
        parsedRrule.until.slice(6, 10) +
        '-' + parsedRrule.until.slice(3, 5) +
        '-' + parsedRrule.until.slice(0, 2) +
        'T' + parsedRrule.until.slice(11, 19) + '.000Z'
      endDateTime = new Date(isoFormatEnd)
    } else {
      endDateTime = new Date(parsedRrule?.until)
    }

    const DateFormates: any = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
    const localStartDateTime = startDateTime.toLocaleString('en-US', DateFormates)
    const localEndDateTime = endDateTime.toLocaleString('en-US', DateFormates)

    setThisEventStartDate(localStartDateTime)
    setThisEventEndDate(localEndDateTime)
  }

  const closeModal = () => setShowModal(false)
  const redirecttoHome = () => {
    window.location.href = '#'
  }
  return (
    <section className="Bodysection" id='scroll'>
      <PageHeader name='Calendar'
        icon='icon-calendar'
        extras={
            <Buttons
            label="Back"
            aria-label="Back"
            licon="icon-left-arrow title-color6 font-10 mt-1"
            className='btn-sm font-14 segoeui-regular title-color6 text-nowrap  ps-0 links-underline'
              onClick={(e: any) => redirecttoHome()}
            />
        }
      />
      <div className="container">
        <div className='row'>
          <div className='col-md-12'>
            <div className='innerrightcontainer'>
              <div ref={calendarEl}></div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        toggle={closeModal}
        className='modalpopup border-radius2'
        wrapClassName='modalpopupmain'
      >
        <ModalBody onClose={props.onClose}>
          <div className='eventpopupheader'>
            <h4 tabIndex={0} aria-label="Calendar Event"><span className="icon-calendar"></span> Calendar Event</h4>
            <button title="Close" aria-label="Close" className="closeeventpopup" onClick={closeModal}>
              <span className="icon-close"></span>
            </button>
          </div>
          <div className='popup-body eventpopup-details'>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Title</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{calendarIndividualEvent?.title}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Location</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{calendarIndividualEvent?.extendedProps.Location}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Start Time</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{thisEventStartDate}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>End Time</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{thisEventEndDate}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>All Day Event</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{calendarIndividualEvent?.extendedProps.fIsAllDayEvent ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Description</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{calendarIndividualEvent?.extendedProps.Description}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Category</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <span className='calendarmodaldata'>{calendarIndividualEvent?.extendedProps.Category}</span>
              </div>
            </div>
            <div className='calendarmodalinfo row' tabIndex={0} aria-live='polite'>
              <div className='col-lg-3 col-sm-12'>
                <span className='calendarmodalfield'>Attachments</span>
              </div>
              <div className='col-lg-9 col-sm-12'>
                <div className="font13 montserratSemibold text-color4"> {calendarIndividualEvent?.extendedProps.AttachmentFiles?.length && calendarIndividualEvent?.extendedProps.AttachmentFiles?.length > 0
                  ? calendarIndividualEvent?.extendedProps.AttachmentFiles?.map((val: any) =>
                    <a href={val.ServerRelativeUrl} download target="_blank" title={val?.FileName} rel="noreferrer" key={val?.FileName} className='px-1'>
                      <span className={DocumentIconNames(val?.FileName)}>  </span>{val?.FileName}</a>
                  )
                  : null}
                </div>
              </div>
            </div>

          </div>
          <div className="divaddpopupbtns p-2">
            <Buttons
              label="Close"
              aria-label="Close"
              icon="icon-close font-9 me-1"
              className='btn-sm btn-primary ms-auto whitetext font-13 text-nowrap border-radius3'
              onClick={closeModal}
            />
          </div>
        </ModalBody>
      </Modal>
    </section>
  )
}

export default CalendarInnerview
