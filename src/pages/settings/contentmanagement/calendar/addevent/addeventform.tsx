/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-case-declarations */
import React, { useState, useEffect, useRef, useContext } from 'react'
import './addEvent.css'
import RecurrencePattern from './recurrencepattern'
import '../calendar.css'
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/attachments'
import FileUpload from '../../../../../components/upload/upload-file'
import Buttons from '../../../../../components/buttons/buttons'
import { convertDate, formatUTCDateToLocal } from '../../../../../Global'
import { CALENDAR_EVENT_MSG, NO_CHANGE_MSG, VALIDATE_PII_CONTENT } from '../../../../../configuration'
import { loadPII, validatePII, shouldAddToPIIAuditTrail, addtoPIIAuditTrail } from '../../../../pii/commonFunctions/piiFunctions'
import RenderPIIPopup from '../../../../pii/piiPopup/PiiPopup'
import Alert from '../../../../../components/alert/alert'

interface AttachmentFile {
  name: string;
  content: any;
}
interface EventHours {
  value: string;
  label: string;
  ID: number;
}
interface EventData {
  title: string;
  Location: string;
  IsAllDayEvent: boolean;
  Recurrence: string | boolean;
  rrule: Record<string, any> | string | any;
  Description: string;
  Category: string | string[];
  IsArchived: string | boolean;
  StartDate: string;
  EndDate: string;
}

interface RRuleTime {
  dtstartTime: string;
  untilTime: string;
}
interface RRule {
  freq: string;
  dtstart: string;
  until: string;
  interval?: number | null;
  byweekday?: string[];
  bysetpos?: number;
  bymonthday?: number;
  bymonth?: number;
}

interface OneTimeRule {
  freq: string;
  dtstart: string;
  until: string;
}

interface CalendarList {
  Id: number;
  Title: string;
  EventDate: string;
  EndDate: string;
}

interface Props {
  editEvent?: any;
  eventRRule?: any;
  calendarList?: CalendarList;
  isEdit?: boolean;
  onClose: () => void;
  closeAfterSubmit: () => void;
  sendRefresh: () => void;
}

const AddEventForm: React.FC<Props> = (props) => {
  const [existingEvent, setExistingEvent] = useState<any>()
  const [eventTitle, setEventTitle] = useState<string>('')
  const [eventLocation, setEventLocation] = useState<string>('')
  const [eventDescription, setEventDescrtiption] = useState<string>('')
  const [eventHoursStart, setEventHoursStart] = useState<string>('T00:')
  const [eventMinutesStart, setEventMinutesStart] = useState<string>('00:00')
  const [eventHoursEnd, setEventHoursEnd] = useState<string>('T00:')
  const [eventMinutesEnd, setEventMinutesEnd] = useState<string>('00:00')
  const [isAllDayEvent, setIsAllDayEvent] = useState<boolean>(false)
  const [recurrence, setRecurrence] = useState<boolean>(false)
  const [startingDate, setStartingDate] = useState<string | undefined>()
  const [endingDate, setEndingDate] = useState<string | undefined>()
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string | undefined>()
  const [files, setFiles] = useState<AttachmentFile[]>([])
  const [ownCategoryValue, setOwnCategoryValue] = useState<string>('')
  const [eventCategory, setEventCategory] = useState<any>('')
  const [calendarList, setCalendarList] = useState<CalendarList | undefined>()
  const [isEditEnabled, setIsEditEnabled] = useState<any>(false)
  const [existingfiles, setExistingfiles] = useState<any>([])
  const [categorySelect, setCategorySelect] = useState<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [changeAlert, setchangeAlert] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [rruleTime, setRRuleTime] = useState<RRuleTime>({
    dtstartTime: '',
    untilTime: ''
  })
  const [rrule, setRRule] = useState<RRule>({
    freq: '',
    dtstart: '',
    until: ''
  })
  const [oneTimeRule, setOneTimeRule] = useState<OneTimeRule>({
    freq: '',
    dtstart: '',
    until: ''
  })
  const [calendarEvent, setCalendarEvent] = useState<any>({
    title: '',
    Location: '',
    IsAllDayEvent: false,
    rrule: {},
    Recurrence: '',
    Description: '',
    Category: [] || '',
    IsArchived: '',
    StartDate: '',
    EndDate: ''
  })
  const [filteredHoursList, setFilteredHoursList] = useState<EventHours[]>()
  const [dateRange, setDateRange] = useState<any>(null)
  const listName = 'CalendarList'

  useEffect(() => {
    if (props?.editEvent) {
      setExistingEvent(props?.editEvent)
    }
  }, [props?.editEvent])
  useEffect(() => {
    if (existingEvent) {
      setEventTitle(existingEvent.title)
      setEventLocation(existingEvent.extendedProps.Location)
      const eventRRule = JSON.parse(props?.eventRRule)
      const startDate = new Date(eventRRule?.dtstart)
      const untilDate = new Date(eventRRule?.until)
      const localTimeOffset = startDate.getTimezoneOffset()
      const adjustedStartDate = new Date(startDate.getTime() - localTimeOffset * 60000)
      const adjustedUntilDate = new Date(untilDate.getTime() - localTimeOffset * 60000)
      if (adjustedUntilDate < adjustedStartDate) {
        adjustedUntilDate.setDate(adjustedStartDate.getDate() - 1)
      }
      const formattedStartDate = adjustedStartDate.toISOString().split('T')[0]
      const formattedUntilDate = adjustedUntilDate.toISOString().split('T')[0]

      const startHours = startDate.getHours()
      const formattedStartHours = startHours < 10 ? `0${startHours}` : `${startHours}`
      setEventHoursStart(`T${formattedStartHours}:`)

      const startMinutes = startDate.getMinutes()
      const formattedStartMinutes = startMinutes < 10 ? `0${startMinutes}:00` : `${startMinutes}:00`
      setEventMinutesStart(formattedStartMinutes)

      const endHours = untilDate.getHours()
      const formattedEndHours = endHours < 10 ? `0${endHours}` : `${endHours}`
      setEventHoursEnd(`T${formattedEndHours}:`)

      const endMinutes = untilDate.getMinutes()
      const formattedEndMinutes = endMinutes < 10 ? `0${endMinutes}:00` : `${endMinutes}:00`
      setEventMinutesEnd(formattedEndMinutes)

      if (isRecurringEvent(props?.eventRRule)) {
        setRecurrence(true)
        setStartingDate(formattedStartDate)
        setEndingDate(formattedUntilDate)
      } else {
        setRecurrence(false)
        setStartingDate(formattedStartDate)
        setEndingDate(formattedUntilDate)
      }
      setIsAllDayEvent(existingEvent.extendedProps.fAllDayEvent)
      setEventDescrtiption(existingEvent.extendedProps.Description)
      setEventCategoryFilter(checkCheckbox(existingEvent.extendedProps.Category) ? existingEvent.extendedProps.Category : 'Select Event Category')
      setOwnCategoryValue(checkCheckbox(existingEvent.extendedProps.Category) ? '' : existingEvent.extendedProps.Category)
      setCategorySelect(checkCheckbox(existingEvent.extendedProps.Category) ? 0 : (existingEvent.extendedProps.Category ? 1 : null))
      setFiles(existingEvent.extendedProps.AttachmentFiles)
      setExistingfiles(existingEvent.extendedProps.AttachmentFiles)
    }
  }, [existingEvent, props?.eventRRule])
  const [displayPII, setDisplayPII] = useState(false)
  const [piiScan, setPIIScan] = useState<any>({})
  useEffect(() => {
    loadPII()
  }, [])
  useEffect(() => {
    setDisplayPII(false)
    if (Object.keys(piiScan).length > 0) {
      Object.keys(piiScan).forEach((key) => {
        if (key === 'FileArray') {
          for (const file of piiScan[key].value) {
            if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
              setDisplayPII(true)
            }
          }
        } else {
          if (
            piiScan[key].resultsArray.length > 0 &&
            !piiScan[key].userAnswer
          ) {
            setDisplayPII(true)
          }
        }
      })
    }
  }, [piiScan])
  const isRecurringEvent = (rule: any | undefined): boolean => {
    rule = rule && JSON?.parse(rule)
    return rule?.count > 1 || rule?.byweekday?.length > 0 || rule?.interval || rule?.bysetpos
  }
  useEffect(() => {
    if (isAllDayEvent) {
      setEventHoursStart('T00:')
      setEventMinutesStart('00:00')
      setEventHoursEnd('T23:')
      setEventMinutesEnd('59:00')
    } else {
      setEventHoursStart('T00:')
      setEventHoursEnd('T00:')
    }
  }, [isAllDayEvent])
  useEffect(() => {
    if (isAllDayEvent) {
      setEventHoursStart('T00:')
      setEventMinutesStart('00:00')
      setEventHoursEnd('T23:')
      setEventMinutesEnd('59:00')
    }
    if (recurrence) {
      setRRuleTime({
        dtstartTime: eventHoursStart + eventMinutesStart,
        untilTime: eventHoursEnd + eventMinutesEnd
      })
    } else {
      setOneTimeRule({
        freq: 'daily',
        dtstart: startingDate + eventHoursStart + eventMinutesStart,
        until: endingDate + eventHoursEnd + eventMinutesEnd
      })
    }
  }, [endingDate,
    eventHoursEnd,
    eventHoursStart,
    eventMinutesEnd,
    eventMinutesStart,
    isAllDayEvent,
    recurrence,
    startingDate])

  useEffect(() => {
    const timeRule = recurrence ? rrule : oneTimeRule
    const startEventDate = timeRule?.dtstart
    const endEventDate = timeRule?.until
    setCalendarEvent({
      title: eventTitle,
      Location: eventLocation,
      IsAllDayEvent: isAllDayEvent,
      rrule: recurrence ? rrule : oneTimeRule,
      Recurrence: recurrence,
      Description: eventDescription,
      Category: (eventCategoryFilter !== 'Select Event Category' ? eventCategoryFilter : ownCategoryValue),
      IsArchived: false,
      StartDate: startEventDate,
      EndDate: endEventDate
    })
  }, [eventCategoryFilter, eventDescription, eventLocation, eventTitle, isAllDayEvent, oneTimeRule, ownCategoryValue, recurrence, rrule])
  useEffect(() => {
    setCalendarList(props.calendarList)
  }, [props.calendarList])
  const eventHoursList = [
    { value: 'T00:', label: '12 AM', ID: 0 },
    { value: 'T01:', label: '1 AM', ID: 1 },
    { value: 'T02:', label: '2 AM', ID: 2 },
    { value: 'T03:', label: '3 AM', ID: 3 },
    { value: 'T04:', label: '4 AM', ID: 4 },
    { value: 'T05:', label: '5 AM', ID: 5 },
    { value: 'T06:', label: '6 AM', ID: 6 },
    { value: 'T07:', label: '7 AM', ID: 7 },
    { value: 'T08:', label: '8 AM', ID: 8 },
    { value: 'T09:', label: '9 AM', ID: 9 },
    { value: 'T10:', label: '10 AM', ID: 10 },
    { value: 'T11:', label: '11 AM', ID: 11 },
    { value: 'T12:', label: '12 PM', ID: 12 },
    { value: 'T13:', label: '1 PM', ID: 13 },
    { value: 'T14:', label: '2 PM', ID: 14 },
    { value: 'T15:', label: '3 PM', ID: 15 },
    { value: 'T16:', label: '4 PM', ID: 16 },
    { value: 'T17:', label: '5 PM', ID: 17 },
    { value: 'T18:', label: '6 PM', ID: 18 },
    { value: 'T19:', label: '7 PM', ID: 19 },
    { value: 'T20:', label: '8 PM', ID: 20 },
    { value: 'T21:', label: '9 PM', ID: 21 },
    { value: 'T22:', label: '10 PM', ID: 22 },
    { value: 'T23:', label: '11 PM', ID: 23 }
  ]
  const eventMinutesList = [
    { value: '00:00', label: '00', ID: 0 },
    { value: '05:00', label: '05', ID: 1 },
    { value: '10:00', label: '10', ID: 2 },
    { value: '15:00', label: '15', ID: 3 },
    { value: '20:00', label: '20', ID: 4 },
    { value: '25:00', label: '25', ID: 5 },
    { value: '30:00', label: '30', ID: 6 },
    { value: '35:00', label: '35', ID: 7 },
    { value: '40:00', label: '40', ID: 8 },
    { value: '45:00', label: '45', ID: 9 },
    { value: '50:00', label: '50', ID: 10 },
    { value: '55:00', label: '55', ID: 11 }
  ]
  const eventCategories = [
    { value: 'Select Event Category', label: 'Select Event Category', ID: 0 },
    { value: 'Meeting', label: 'Meeting', ID: 1 },
    { value: 'Work Hours', label: 'Work Hours', ID: 2 },
    { value: 'Business', label: 'Business', ID: 3 },
    { value: 'Holiday', label: 'Holiday', ID: 4 },
    { value: 'Get Together', label: 'Get Together', ID: 5 }
  ]
  useEffect(() => {
    const today = new Date()
    const todaysHours = today.getHours() % 12 || 12
    if (startingDate === today.toISOString().split('T')[0]) {
      setFilteredHoursList(eventHoursList.filter(i => i.ID > todaysHours))
    } else {
      setFilteredHoursList(eventHoursList)
    }
  }, [startingDate])

  useEffect(() => {
    if (startingDate && endingDate) {
      const startDateObj = new Date(startingDate)
      const endDateObj = new Date(endingDate)

      if (endDateObj < startDateObj) {
        setEndingDate(startingDate)
      }
    }
  }, [startingDate, endingDate])

  const todayDate = new Date().toISOString().split('T')[0]
  const maxDate = new Date('9999-12-31').toISOString().split('T')[0]
  const eventHoursOptions = filteredHoursList?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })
  const eventMinuteOptions = eventMinutesList?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })
  const eventCategoryOptions = eventCategories?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })
  const hoursStartChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEventHoursStart(event.target.value)
    setEndDateError('')
  }
  const minutesStartChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEventMinutesStart(event.target.value)
    setEndDateError('')
  }
  const hoursEndChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEventHoursEnd(event.target.value)
    setEndDateError('')
  }
  const minutesEndChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEventMinutesEnd(event.target.value)
    setEndDateError('')
  }
  const startDateSelectHandler = (event: any) => {
    setStartingDate(event.target.value)
    setStartDateError('')
    setErrorFixMessage('')
  }
  const endDateSelectHandler = (event: any) => {
    setEndingDate(event.target.value)
    setEndDateError('')
    setErrorFixMessage('')
  }
  const allDaySelectHandler = () => {
    setIsAllDayEvent(!isAllDayEvent)
  }

  const titleInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventTitle(event.target.value)
    setTitleError('')
    setErrorFixMessage('')
  }
  const locationInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEventLocation(event.target.value)
  const recurringEventHandler = () => {
    setRecurrence(!recurrence)
    setRangeError('')
    setPatternError('')
  }
  const descriptionHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => setEventDescrtiption(event.target.value)
  const eventCategoryChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => setEventCategoryFilter(event.target.value)
  const specifyOwnValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => setOwnCategoryValue(event.target.value)

  const getRRule = (val: any, dateRange: any) => {
    setRRule(val)
    setDateRange(dateRange)
  }
  const eventCategoryHandler = (input: any) => {
    switch (input) {
      case 0:
        setCategorySelect(0)
        setEventCategory('selectEventCategory')
        const specifyOwnValueInput = document.getElementById('specifyOwnValueInput') as HTMLInputElement | null
        if (specifyOwnValueInput) {
          specifyOwnValueInput.value = ''
        }
        setOwnCategoryValue('')
        break
      case 1:
        setCategorySelect(1)
        setEventCategory('specifyOwnValue')
        const eventCategoriesDropdown = document.getElementById('eventCategoriesDropdown') as HTMLSelectElement | null
        if (eventCategoriesDropdown) {
          eventCategoriesDropdown.value = 'Select Event Category'
        }
        setEventCategoryFilter('Select Event Category')
        break
      default:
        break
    }
  }

  const saveCalendarEvent = async () => {
    let Id
    if (props.isEdit) {
      Id = existingEvent?.extendedProps.Id
    }
    let canSubmit = true
    validationCheck()
    if (errorCount === 0 && VALIDATE_PII_CONTENT) {
      const itemPII: any = {}
      itemPII.Title = calendarEvent.title
      itemPII.Description = calendarEvent.Description
      itemPII.Files = Object.values(files)
      const piiScanResult: any = await validatePII(itemPII, piiScan)
      setPIIScan({ ...piiScanResult })
      if (Object.keys(piiScanResult).length > 0) {
        Object.keys(piiScanResult).forEach((key) => {
          if (key === 'FileArray') {
            for (const file of piiScanResult[key].value) {
              if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
                setDisplayPII(true)
                canSubmit = false
              }
            }
          } else {
            if (
              piiScanResult[key].resultsArray.length > 0 &&
              !piiScanResult[key].userAnswer
            ) {
              setDisplayPII(true)
              canSubmit = false
            }
          }
        })
      }
    }
    if (errorCount === 0 && !canSubmit) {
      scrollToMiddle()
    }
    if (errorCount === 0 && canSubmit) {
      if (Id) {
        let changesDetected = true
        const filestodelete: any[] = []
        const file = []
        if (files.length > 0) {
          for (const element of files) {
            if (element.name) {
              file.push({
                name: element.name,
                content: element
              })
            }
          }
        }
        existingfiles.forEach((val: any) => {
          const attachmentNam = Array.from(new Set(files.map((v: any) => v.FileName)))
          if (!attachmentNam.includes(val.FileName)) { filestodelete.push(val.FileName) }
        })
        const rrule = JSON.parse(existingEvent?.extendedProps?.FreeBusy)

        const eventRRule = JSON.parse(props?.eventRRule)
        const startDate = new Date(eventRRule?.dtstart)
        const untilDate = eventRRule?.until ? new Date(eventRRule?.until) : null
        const localTimeOffset = startDate.getTimezoneOffset()
        const adjustedStartDate = new Date(startDate.getTime() - localTimeOffset * 60000)
        const adjustedUntilDate = untilDate ? new Date(untilDate.getTime() - localTimeOffset * 60000) : null
        if (adjustedUntilDate && adjustedUntilDate < adjustedStartDate) {
          adjustedUntilDate.setDate(adjustedStartDate.getDate() - 1)
        }

        const startHours = startDate.getHours()
        const formattedStartHours = startHours < 10 ? `0${startHours}` : `${startHours}`
        const eventHoursStart1 = `T${formattedStartHours}:`

        const startMinutes = startDate.getMinutes()
        const formattedStartMinutes = startMinutes < 10 ? `0${startMinutes}:00` : `${startMinutes}:00`

        const endHours = untilDate ? untilDate.getHours() : null
        const formattedEndHours = endHours !== null && endHours < 10 ? `0${endHours}` : `${endHours}`
        const eventHoursEnd1 = `T${formattedEndHours}:`
        const endMinutes = untilDate && untilDate.getMinutes()
        const formattedEndMinutes = endMinutes !== null && endMinutes < 10 ? `0${endMinutes}:00` : `${endMinutes}:00`
        const startdate = recurrence ? formatUTCDateToLocal(eventRRule?.dtstart) + eventHoursStart1 + formattedStartMinutes : startingDate + eventHoursStart1 + formattedStartMinutes
        const enddate = recurrence ? untilDate && (formatUTCDateToLocal(eventRRule?.until) + eventHoursEnd1 + formattedEndMinutes) : untilDate && (endingDate + eventHoursEnd1 + formattedEndMinutes)
        const utcEndDates = calendarEvent?.EndDate ? new Date(new Date(calendarEvent.EndDate).toISOString()).toISOString() : null
        const utcStartDates = new Date(new Date(calendarEvent.StartDate).toISOString()).toISOString()

        if (compareWeekday(rrule?.byweekday, calendarEvent?.rrule?.byweekday) && file?.length === 0 && filestodelete?.length === 0 && existingEvent?.extendedProps?.Title?.toLowerCase()?.trim() === calendarEvent?.title?.toLowerCase()?.trim() && existingEvent?.extendedProps?.Description?.trim() === calendarEvent?.Description?.trim() &&
          (existingEvent?.extendedProps?.Category === (calendarEvent?.Category ? calendarEvent?.Category : null)) && existingEvent?.extendedProps?.Location === calendarEvent?.Location &&
          enddate === calendarEvent?.EndDate && startdate === calendarEvent?.StartDate &&
          existingEvent?.extendedProps?.fAllDayEvent === calendarEvent?.IsAllDayEvent && existingEvent?.extendedProps?.fRecurrence === calendarEvent?.Recurrence &&
          rrule?.dtstart?.split('T')[0] === utcStartDates?.split('T')[0] && rrule?.until?.split('T')[0] === utcEndDates?.split('T')[0] && rrule?.freq === calendarEvent?.rrule?.freq &&
          rrule?.interval == calendarEvent?.rrule?.interval && rrule?.bymonth == calendarEvent?.rrule?.bymonth &&
          rrule?.bymonthday == calendarEvent?.rrule?.bymonthday && rrule?.bysetpos == calendarEvent?.rrule?.bysetpos && rrule?.count == calendarEvent?.rrule?.count) {
          changesDetected = false
          setchangeAlert(true)
        }
        if (changesDetected) {
          try {
            if (calendarEvent.rrule.freq === 'yearly' && calendarEvent.rrule.interval === null) {
              calendarEvent.rrule.interval = 1
            }
            const dtstart = new Date(calendarEvent.rrule.dtstart)
            const dtstartUTC = dtstart.toISOString()
            const until = calendarEvent.rrule.until ? new Date(calendarEvent.rrule.until) : null
            const untilUTC = until ? until.toISOString() : null
            calendarEvent.rrule.dtstart = dtstartUTC
            calendarEvent.rrule.until = untilUTC
            calendarEvent.rrule = JSON.stringify(calendarEvent.rrule)
            const data = calendarEvent
            const updateObj = {
              Title: data.title,
              Location: data.Location,
              fAllDayEvent: data.IsAllDayEvent,
              fRecurrence: calendarEvent.Recurrence,
              FreeBusy: calendarEvent.rrule,
              EventDate: data.StartDate,
              EndDate: data.EndDate ? data.EndDate : null,
              Description: data.Description,
              Category: data.Category
            }
            await sp.web.lists.getByTitle(listName).items.getById(Id).update(updateObj)
            if (files.length > 0 || filestodelete?.length > 0) {
              const item = sp.web.lists.getByTitle(listName).items.getById(Id)
              const filearray: any = []
              for (const element of files) {
                if (element.name) {
                  filearray.push({
                    name: element.name,
                    content: element
                  })
                }
              }
              if (filestodelete?.length > 0) {
                await item.attachmentFiles.deleteMultiple(...filestodelete).then(function () {
                  setExistingfiles([])
                  props.closeAfterSubmit()
                  sendRefreshToParent()
                })
              }
              if (filearray.length > 0) {
                await item?.attachmentFiles.addMultiple(filearray).then(function () {
                  setFiles([])
                  props.closeAfterSubmit()
                  sendRefreshToParent()
                })
              } else {
                setFiles([])
                props.closeAfterSubmit()
                sendRefreshToParent()
              }
            } else {
              setFiles([])
              props.closeAfterSubmit()
              sendRefreshToParent()
            }
          } catch (error) {
            console.error('Error updating item:', error)
          }
          const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
          if (await shouldAddPIIAuditTrail) {
            await addtoPIIAuditTrail('Calendar', '', piiScan, '')
          }
        }
      } else {
        try {
          if (calendarEvent.rrule.freq === 'yearly' && calendarEvent.rrule.interval === null) {
            calendarEvent.rrule.interval = 1
          }
          const dtstart = new Date(calendarEvent?.rrule?.dtstart)
          const dtstartUTC = dtstart.toISOString()
          const until = calendarEvent?.rrule?.until ? new Date(calendarEvent?.rrule?.until) : ''
          const untilUTC = until ? until?.toISOString() : null

          calendarEvent.rrule.dtstart = dtstartUTC
          calendarEvent.rrule.until = untilUTC
          calendarEvent.rrule = JSON.stringify(calendarEvent.rrule)

          const data = calendarEvent
          const newItem = {
            Title: data.title,
            Location: data.Location,
            fRecurrence: data.Recurrence,
            fAllDayEvent: data.IsAllDayEvent,
            FreeBusy: calendarEvent.rrule,
            EventDate: data.StartDate,
            EndDate: data.EndDate ? data.EndDate : null,
            Description: data.Description,
            Category: data.Category
          }
          const addedItem = await sp.web.lists.getByTitle(listName).items.add(newItem)
          if (files.length > 0) {
            const item = sp.web.lists.getByTitle(listName).items.getById(addedItem.data.Id)
            const filearray: any[] = []
            for (const element of files) {
              if (element.name) {
                filearray.push({
                  name: element.name,
                  content: element
                })
              }
            }
            if (filearray.length > 0) {
              await item.attachmentFiles.addMultiple(filearray).then(function () {
                setFiles([])
                props.closeAfterSubmit()
                sendRefreshToParent()
              })
            } else {
              setFiles([])
              props.closeAfterSubmit()
              sendRefreshToParent()
            }
          } else {
            setFiles([])
            props.closeAfterSubmit()
            sendRefreshToParent()
          }
        } catch (error) {
          console.error('Error adding item:', error)
        }
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Calendar', '', piiScan, '')
        }
      }
    }
  }
  const onChangeAlert = () => {
    setchangeAlert(false)
  }
  const showDeleteWindow = (item: any) => {
    setDeleteItem(item)
    setShowAlert(true)
  }
  const onClickAlert = async (button: string) => {
    if (button === 'Yes') {
      setShowAlert(false)
      if (deleteItem) {
        try {
          await sp.web.lists.getByTitle(listName).items.getById(deleteItem).delete()
          props.onClose()
          sendRefreshToParent()
        } catch (error) {
          console.error(`Error deleting item with ID ${deleteItem}:`, error)
        }
      }
    } else {
      setShowAlert(false)
      setDeleteItem(null)
    }
  }
  function enableEdit() {
    setIsEditEnabled(true)
  }

  let errorCount: any
  const [patternError, setPatternError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [errorFixMessage, setErrorFixMessage] = useState('')
  const [rangeError, setRangeError] = useState('')
  const validationCheck = () => {
    errorCount = 0
    if (calendarEvent.title.trim() === '') {
      setTitleError('Please enter a title.')
      errorCount++
    }
    if (!recurrence) {
      if (calendarEvent.rrule.dtstart === 'undefinedT00:00:00' || startingDate === undefined) {
        setStartDateError('You must specify a value for this required field.')
        errorCount++
      }
      if (calendarEvent.rrule.until === 'undefinedT00:00:00' || endingDate === undefined) {
        setEndDateError('You must specify a value for this required field.')
        errorCount++
      }
      if (startingDate === undefined && endingDate === undefined) {
        setStartDateError('You must specify a value for this required field.')
        setEndDateError('You must specify a value for this required field.')
        errorCount++
      }
      if ((startingDate && endingDate && startingDate === endingDate)) {
        const eventHoursStartID: any = eventHoursList.find(item => item.value === eventHoursStart)?.ID
        const eventHoursEndID: any = eventHoursList.find(item => item.value === eventHoursEnd)?.ID
        const eventMinutesStartID: any = eventMinutesList.find(item => item.value === eventMinutesStart)?.ID
        const eventMinutesEndID: any = eventMinutesList.find(item => item.value === eventMinutesEnd)?.ID
        if (eventHoursStartID > eventHoursEndID || (eventHoursEndID === eventHoursStartID && eventMinutesStartID > eventMinutesEndID)) {
          setEndDateError('Start Time cannot be greater than End Time.')
          errorCount++
        } else if (eventHoursEndID === eventHoursStartID && eventMinutesEndID === eventMinutesStartID) {
          setEndDateError('Start Time and End Time cannot be the same.')
          errorCount++
        }
      }
    } else {
      rruleErrorCheck()
    }
  }
  const rruleErrorCheck = () => {
    if (recurrence) {
      switch (rrule.freq) {
        case 'daily':
          rruleDayErrorCheck()
          break
        case 'weekly':
          rruleWeekErrorCheck()
          break
        case 'monthly':
          rruleMonthErrorCheck()
          break
        case 'yearly':
          rruleYearErrorCheck()
          break
        default:
          break
      }
      if ((rrule?.dtstart?.split('T')[0] === 'undefined' ||
        rrule?.until?.split('T')[0] === 'undefined' ||
        rrule?.dtstart?.split('T')[0] === 'null' ||
        rrule?.until?.split('T')[0] === 'null') && dateRange === null) {
        setRangeError('Please select start and end date for range of recurrence.')
        errorCount++
      } else if (rrule?.dtstart?.split('T')[0] === 'undefined' ||
        rrule?.dtstart?.split('T')[0] === 'null') {
        setRangeError('Please select start date.')
        errorCount++
      } else if (dateRange === null) {
        setRangeError('Please select end date.')
        errorCount++
      }
      else {
        setRangeError('')
      }
    }
  }
  const rruleDayErrorCheck = () => {
    if ((rrule.interval === null || rrule.interval === undefined) && (!rrule?.byweekday || !rrule?.byweekday[0]?.length)) {
      setPatternError('Please enter daily frequency and try again.')
      errorCount++
    } else {
      setPatternError('')
    }
  }
  const rruleWeekErrorCheck = () => {
    if ((rrule.interval === null || rrule.interval === undefined) || (!rrule?.byweekday || !rrule?.byweekday[0]?.length)) {
      setPatternError('Please select days/frequency for weekly recurrence.')
      errorCount++
    } else {
      setPatternError('')
    }
  }
  const rruleMonthErrorCheck = () => {
    if (((rrule?.interval === null || rrule.interval === undefined) && (rrule.bymonthday === null || rrule.bymonthday === undefined)) ||
      ((rrule.bysetpos === null || rrule.bysetpos === undefined) && (!rrule?.byweekday || !rrule.byweekday[0]?.length) && (rrule.interval === null || rrule.interval === undefined))) {
      setPatternError('Please enter day/frequency for the monthly recurring pattern.')
      errorCount++
    } else {
      setPatternError('')
    }
  }
  const rruleYearErrorCheck = () => {
    if ((rrule.interval === null || rrule.interval === undefined) &&
      (((rrule.bymonth === null || rrule.bymonth === undefined) && (rrule.bymonthday === null || rrule.bymonthday === undefined)) ||
        ((rrule.bysetpos === null || rrule.bysetpos === undefined) && (rrule.bymonth === null || rrule.bymonth === undefined)))) {
      setPatternError('Please enter yearly frequency and try again.')
      errorCount++
    } else {
      setPatternError('')
    }
  }
  const cancelSaveEvent = () => {
    props.onClose()
    setExistingEvent(null)
  }
  const sendRefreshToParent = () => {
    props.sendRefresh()
  }
  const inputReference = useRef<HTMLInputElement>(null!)
  useEffect(() => {
    inputReference.current.focus()
  }, [])
  function checkCheckbox(categoryValue: string) {
    let foundMatch = false
    eventCategories.forEach(category => {
      if (category.value === categoryValue) {
        foundMatch = true
      }
    })
    return foundMatch
  }
  function compareWeekday(obj1: any, obj2: any) {
    if (!obj1 && !obj2) {
      return true
    }
    if (obj1 && obj2) {
      return obj1?.length === obj2?.length &&
        obj1?.every((value: any, index: any) => value === obj2?.[index])
    }
  }
  function scrollToMiddle() {
    const container = document.getElementById('calendar-container')
    if (container) {
      const middlePosition = (window.innerHeight - 218) - container.offsetTop
      container.scrollTop = middlePosition
    }
  }
  return (
    <>
      {showAlert && (
        <Alert message={CALENDAR_EVENT_MSG} yes='Yes' cancel='No' className="alert-info"
          onClick={onClickAlert}
          btn1iconclassNmae='icon-checked  font-11 pe-1'
          btn2iconclassNmae='icon-close  font-11 pe-1'
          btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
          btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"

        />
      )}
      {changeAlert && (
        <Alert message={NO_CHANGE_MSG} yes='OK' cancel='Cancel' className="alert-info"
          onClick={onChangeAlert}
          btn1iconclassNmae='icon-checked  font-11 pe-1'
          btn2iconclassNmae='icon-close  font-11 pe-1'
          btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
          btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"

        />
      )}
      <div className='eventpopupheader px-3'>
        <h4 tabIndex={0} aria-label={existingEvent ? 'Calendar Event' : 'Add Calendar Event'}><span className="icon-calendar font-13"></span>{existingEvent ? 'Calendar Event' : 'Add Calendar Event'}
          {existingEvent && !!((existingEvent && !isEditEnabled)) &&
            <a title='Edit' className='eventedit' onClick={enableEdit}><span className="icon-pencil ps-2"></span></a>
          }
        </h4>

        <button title="Close" aria-label="Close" className="closeeventpopup" onClick={cancelSaveEvent}>
          <span className="icon-close"></span>
        </button>
      </div>
      <div className='popup-body px-2' id="calendar-container">
        <div className="forminputrow">
          <div className='col-lg-3 col-sm-12'>
            <label htmlFor='event-title'>Title
              <span className="mandatory"> * </span><span className='tool-tip tooltip-right font-12 sourcesanspro' data-tip='Title'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-lg-9 col-sm-12'>
            <div className="inputwidth">
              <input type="text" onChange={titleInputHandler} placeholder="Enter Title" ref={inputReference}
                id="event-title" className="input" value={eventTitle} aria-label="Title" aria-required="true" maxLength={255} disabled={!!((existingEvent && !isEditEnabled))} />

              <p className="required">{titleError}</p>
            </div>
          </div>
        </div>

        <div className="forminputrow">
          <div className='col-lg-3 col-sm-12'>
            <label htmlFor='event-location'>Location <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='Location'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-lg-9 col-sm-12'>
            <div className="inputwidth">
              <input type="text" onChange={locationInputHandler} placeholder="Enter Location" id="event-location" aria-label="Location"
                className="input" value={eventLocation} maxLength={255} disabled={!!((existingEvent && !isEditEnabled))} />
            </div>
          </div>
        </div>

        <div className="forminputrow">
          <div className='col-lg-3 col-sm-12'>
            <label htmlFor='start-time'>Start Time
              {!recurrence && <span className="mandatory"> * </span>}<span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='Start Time'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-lg-9 col-sm-12'>
            <div className="inputwidth">
              {!recurrence && <input type="date" min={todayDate} max={maxDate} onChange={startDateSelectHandler} placeholder="MM/DD/YYYY"
                id="start-time" className="inputDate"
                value={startingDate} aria-label="Start Date" disabled={!!((existingEvent && !isEditEnabled))} />}
              <select id="selectHoursStart" disabled={isAllDayEvent || !!((existingEvent && !isEditEnabled))} onChange={hoursStartChangeHandler} value={eventHoursStart} className="inputDate" aria-label="Time">
                {eventHoursOptions}
              </select>:&nbsp;
              <select id="selectMinutesStart" disabled={isAllDayEvent || !!((existingEvent && !isEditEnabled))} onChange={minutesStartChangeHandler} value={eventMinutesStart} className="inputDate" aria-label="Seconds">
                {eventMinuteOptions}
              </select>
              {!recurrence && <p className="required">{startDateError}</p>}
            </div>
          </div>
        </div>
        <div className="forminputrow">
          <div className='col-sm-3'>
            <label htmlFor='end-time'>End Time
              {!recurrence && <span className="mandatory"> *</span>} <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='End Time'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-sm-9'>
            <div className="inputwidth">
              {!recurrence && <input type="date" min={startingDate} max={maxDate} onChange={endDateSelectHandler} placeholder="MM/DD/YYYY"
                id="end-time" className="inputDate"
                value={endingDate} aria-label="End Date" disabled={!!((existingEvent && !isEditEnabled))} />}
              <select id="selectHoursEnd" disabled={isAllDayEvent || !!((existingEvent && !isEditEnabled))} onChange={hoursEndChangeHandler} value={eventHoursEnd} className="inputDate" aria-label="Time">
                {eventHoursOptions}
              </select>:&nbsp;
              <select id="selectMinutesEnd" disabled={isAllDayEvent || !!((existingEvent && !isEditEnabled))} onChange={minutesEndChangeHandler} value={eventMinutesEnd} className="inputDate" aria-label="Seconds">
                {eventMinuteOptions}
              </select>
              {!recurrence && <p className="required">{endDateError}</p>}
            </div>
          </div>
        </div>
        <div className="forminputrow">
          <div className='col-sm-3'>
            <label htmlFor='allDaySelect'>All Day Event <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='All Day Event'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-sm-9'>
            <div className="inputwidth ">
              <div className="checkboxInput align-items-center">
                <input type="checkbox" id="allDaySelect" className="checkbox" onChange={allDaySelectHandler}
                  checked={isAllDayEvent} aria-label="All Day Event" disabled={!!((existingEvent && !isEditEnabled))} />
                <span>Make this an all-day event that doesn't start or end at a specific hour</span>
              </div>
            </div>
          </div>
        </div>

        <div className="forminputrow">
          <div className='col-sm-3'>
            <label htmlFor='recurrenceSelect'>Recurrence <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='Recurrence'><span className='icon-info'></span></span>
            </label>
          </div>
          <div className='col-sm-9'>
            <div className="inputwidth">
              <div className="checkboxInput align-items-center">
                <input type="checkbox" id="recurrenceSelect" className="checkbox" onChange={recurringEventHandler} checked={recurrence} disabled={!!((existingEvent && !isEditEnabled))} />
                <span>Make this repeating event</span>
              </div>
            </div>
          </div>
        </div>

        {recurrence &&
          <RecurrencePattern
            rrule={rruleTime}
            getRRule={getRRule}
            patternError={patternError}
            rangeError={rangeError}
            eventRRule={props.eventRRule}
            isEdit={props.isEdit}
            disabled={!!((existingEvent && !isEditEnabled))}
          />
        }
        <div className="forminputrow">
          <div className='col-sm-3'>
            <label htmlFor='event-description'>Description <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='Description'><span className='icon-info'></span></span></label>
          </div>
          <div className='col-sm-9'>
            <div className="inputwidth">
              <textarea onChange={descriptionHandler}
                placeholder="Enter Description" id="event-description" aria-label="Description"
                className="input" value={eventDescription} disabled={!!((existingEvent && !isEditEnabled))}>
              </textarea>
            </div>
          </div>
        </div>
        <div className="forminputrow align-items-start">
          <div className='col-sm-3 pt-1'>
            <label htmlFor='EventCategory'>Event Category <span className='tool-tip tooltip-top font-12 sourcesanspro' data-tip='Event Category'><span className='icon-info'></span></span></label>
          </div>
          <div className='col-sm-9'>
            <div className="eventCategory">
              <div className={['inputwidth', 'eventDropdown', ' d-flex'].join('')}>
                <input className='me-2' type="radio" checked={categorySelect === 0} onChange={() => eventCategoryHandler(0)}
                  name="eventCategoryGroup" aria-label="Event Category" disabled={!!((existingEvent && !isEditEnabled))} />
                <select className="dropdown" id="eventCategoriesDropdown"
                  onChange={eventCategoryChangeHandler} value={eventCategoryFilter} disabled={!!((existingEvent && !isEditEnabled))} aria-label="Event Category" >
                  {eventCategoryOptions}
                </select>
              </div>
              <div className="inputwidth pt-2">
                <input type="radio" checked={categorySelect === 1} onChange={() => eventCategoryHandler(1)}
                  name="eventCategoryGroup" aria-label="Specify your own value" disabled={!!((existingEvent && !isEditEnabled))} />
                <span className='spanSpecify'>Specify your own value</span>
                <input type="text" onChange={specifyOwnValueHandler} value={ownCategoryValue} id="specifyOwnValueInput" aria-label="Specify your own value"
                  disabled={!!((existingEvent && !isEditEnabled))} className="input" />
              </div>
            </div>
          </div>
        </div>
        <div className="forminputrow">
          <FileUpload
            label="Attach File(s)"
            info="Attach File(s)"
            files={files}
            setFiles={setFiles}
            disabled={!!((existingEvent && !isEditEnabled))}
            hintClassName='color-primary'
            noteClassName='color-primary ps-2'
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            infoIcon="icon-info"
            isInfo
            hint="Upload the files which are in the .png, .jpeg, .xlsx, .txt .docx, .pdf files and special characters will not be used in the document names. Maximum size for file is 25 MB. Limit is up to 10 files per screen"
            note='Screenshots need to be saved locally before uploading into system.'
          />
        </div>
        {displayPII && (
          <div className='pt-2'>
            <div className="pii-compliance-validation p-10">
              {displayPII && <RenderPIIPopup piiScan={piiScan} setPIIScan={setPIIScan} />}
            </div>
          </div>
        )}
      </div>

      <div className="divaddpopupbtns p-2">
        <div className='d-flex justify-content-end list-unstyled p-2'>
          {(existingEvent && !isEditEnabled) && <div className='ps-2'>
            <Buttons
              label="DELETE"
              aria-label="Delete"
              icon="icon-delete me-1"
              className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius3'
              onClick={() => showDeleteWindow(existingEvent?.extendedProps.Id)}
            />
          </div>}
          {(existingEvent && isEditEnabled) &&
            <>
              <div className='ps-2'>
                <Buttons
                  label="UPDATE"
                  aria-label="UPDATE"
                  icon="icon-update me-1"
                  className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius3'
                  onClick={saveCalendarEvent}
                />
              </div>
              <div className='ps-2'>
                <Buttons
                  label="CANCEL"
                  aria-label="Cancel"
                  icon="icon-close me-1"
                  className='btn btn-border1 darktext btn-sm font-14 btn-border-radius3'
                  onClick={cancelSaveEvent}
                />
              </div>
            </>
          }
          {!existingEvent &&
            <>
              <div className='ps-2'>
                <Buttons
                  label="SAVE"
                  aria-label="Save"
                  icon="icon-save me-1"
                  className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius3'
                  onClick={saveCalendarEvent}
                />
              </div>
              <div className='ps-2'>
                <Buttons
                  label="CANCEL"
                  aria-label="Cancel"
                  icon="icon-close me-1"
                  className='btn btn-border1 darktext btn-sm font-14 btn-border-radius3'
                  onClick={cancelSaveEvent}
                />
              </div>
            </>
          }
        </div>
      </div>

      <div className="inputwidth">
        <p className="required">{errorFixMessage}</p>
      </div>
    </>
  )
}
export default AddEventForm 
