import React, { useState, useEffect } from 'react'
import './recurrencePattern.css'
import { formatUTCDateToLocal } from '../../../../../Global'

interface RecurrencePatternProps {
    eventRRule: string | null;
    rrule: {
      dtstartTime:any ;
      untilTime: any ;
    };
    patternError: string;
    rangeError: string;
    isEdit: any;
    disabled: any
    getRRule: (rrule: any, dateRange: any) => void;
  }
const RecurrencePattern: React.FC<RecurrencePatternProps> = (props) => {
  const [rrule, setRRule] = useState({
    freq: '',
    interval: 1,
    byweekday: [] as string[],
    bysetpos: 1,
    bymonthday: 1,
    bymonth: 1,
    count: 0,
    dtstart: '' as any,
    until: '' as any
  })

  const eventRule = props?.eventRRule && JSON.parse(props?.eventRRule)

  const [frequency, setFrequency] = useState('daily')
  const [interval, setInterval] = useState<any>()
  const [byWeekDays, setByWeekDays] = useState<string[]>([])
  const [bySetPos, setBySetPos] = useState<any>()
  const [byMonthDay, setByMonthDay] = useState<any >()
  const [byMonth, setByMonth] = useState<any>()
  const [count, setCount] = useState<any>()
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()

  const [dayRadioSelection, setDayRadioSelection] = useState<any>(null)
  const [monthRadioSelection, setMonthRadioSelection] = useState<any>(null)
  const [yearRadioSelection, setYearRadioSelection] = useState<any>(null)
  const [endRadioSelection, setEndRadioSelection] = useState<any>()

  const [dailyOption, setDailyOption] = useState<any>(null)
  const [monthlyOption, setMonthlyOption] = useState<any>(null)
  const [yearlyOption, setYearlyOption] = useState<any>(null)
  const [dateRange, setDateRange] = useState<any>(null)

  const todayDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (eventRule) {
      setFrequency(eventRule.freq)

      frequencySetter()
      setStartDate(formatUTCDateToLocal(eventRule.dtstart))
      if (eventRule.count) {
        setEndRadioSelection('endAfterCount')
        setEndDate(null)
        setDateRange(1)
        setCount(eventRule.count)
      } else if (eventRule.until) {
        setEndRadioSelection('endBy')
        setCount(null)
        setDateRange(2)
        setEndDate(eventRule?.until ? new Date(eventRule.until).toISOString().split('T')[0] : null)
      } else {
        setEndRadioSelection('noEndDate')
        setCount(null)
        setEndDate(null)
        setDateRange(0)
      }
    } else {
      setDailyOption(null)
      setMonthlyOption(null)
      setYearlyOption(null)

      setFrequency('daily')
      setInterval(null)
      setByWeekDays([])
      setBySetPos(null)
      setByMonthDay(null)
      setByMonth(null)
      setCount(null)
      setStartDate(null)
      setEndDate('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.eventRRule])

  const frequencySetter = () => {
    switch (eventRule.freq) {
      case 'daily':
        if (eventRule?.byweekday?.length === 5) {
          radioSelectHandler(1)
          setDailyOption(true)
          setBySetPos(null)
          setByMonth(null)
          setByMonthDay(null)
          setByWeekDays([])
        } else {
          radioSelectHandler(0)
          setDailyOption(false)
          setInterval(eventRule.interval)
          setBySetPos(null)
          setByMonth(null)
          setByMonthDay(null)
          setByWeekDays([])
        }
        break

      case 'weekly':
        setInterval(eventRule.interval)
        setByWeekDays(eventRule.byweekday)
        setBySetPos(null)
        setByMonth(null)
        setByMonthDay(null)
        break

      case 'monthly':
        if (eventRule.bymonthday) {
          setMonthlyOption(true)
          setMonthRadioSelection('dayOfMonth')
          setByMonthDay(eventRule.bymonthday)
          setInterval(eventRule.interval)
          setByWeekDays([])
          setBySetPos(null)
          setByMonth(null)
        } else {
          setMonthlyOption(false)
          setMonthRadioSelection('positionOfMonth')
          setInterval(eventRule.interval)
          setByWeekDays(eventRule.byweekday)
          setBySetPos(eventRule.bysetpos)
          setByMonthDay(null)
          setByMonth(null)
        }
        break

      case 'yearly':
        setInterval(eventRule.interval)
        setByMonth(eventRule.bymonth)
        if (eventRule.bymonthday) {
          setYearlyOption(true)
          setYearRadioSelection('specificDayYear')
          setByMonthDay(eventRule.bymonthday)
          setBySetPos(null)
          setByWeekDays([])
        } else {
          setYearlyOption(false)
          setYearRadioSelection('fixedInstanceMonth')
          setBySetPos(eventRule.bysetpos)
          setByWeekDays(eventRule.byweekday)
          setByMonthDay(null)
        }
        break

      default:
        break
    }
  }
  useEffect(() => {
    const rruleData = {
      freq: frequency,
      interval: interval as number,
      byweekday: byWeekDays,
      bysetpos: bySetPos as number,
      bymonthday: byMonthDay as number,
      bymonth: byMonth as number,
      count: count as number,
      dtstart: startDate + props.rrule.dtstartTime,
      until: (endDate && props.rrule.untilTime) ? endDate + props.rrule.untilTime : null
    }
    if (endRadioSelection === 'noEndDate') {
      rruleData.until = null
    }
    else if (endRadioSelection === 'noEndDate' || endRadioSelection === 'endAfterCount') {
      const today = new Date()
      today.setFullYear(today.getFullYear() + 10)
      rruleData.until = today.toISOString().split('T')[0] + props.rrule.untilTime
    } else if (endRadioSelection === 'endBy') {
      rruleData.until = endDate + props.rrule.untilTime
    }
    setRRule(rruleData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byMonth,
    byMonthDay,
    bySetPos,
    byWeekDays,
    count,
    endDate,
    frequency,
    interval,
    props.rrule,
    startDate])
  useEffect(() => {
    if (!props.isEdit) {
      setFrequency('daily')
      setInterval(null)
    }
  }, [props.isEdit])

  const sendDataToParent = () => {
    props.getRRule(rrule, dateRange)
  }

  useEffect(() => {
    sendDataToParent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rrule, props.rrule])

  const frequencySelectHandler = (input: string) => {
    setFrequency(input)
    setInterval(null)
    setByWeekDays([])
    setBySetPos(null)
    setByMonthDay(null)
    setByMonth(null)
    setMonthRadioSelection(null)
    setYearRadioSelection(null)
  }

  const frequencyDropdown = [
    { value: 1, label: 'First', ID: 0 },
    { value: 2, label: 'Second', ID: 1 },
    { value: 3, label: 'Third', ID: 2 },
    { value: 4, label: 'Fourth', ID: 3 },
    { value: -1, label: 'Last', ID: 4 }
  ]
  const weekdayDropdown = [
    { value: 'su', label: 'Sunday', ID: 0 },
    { value: 'mo', label: 'Monday', ID: 1 },
    { value: 'tu', label: 'Tuesday', ID: 2 },
    { value: 'we', label: 'Wednesday', ID: 3 },
    { value: 'th', label: 'Thursday', ID: 4 },
    { value: 'fr', label: 'Friday', ID: 5 },
    { value: 'sa', label: 'Saturday', ID: 6 }
  ]
  const monthlyDropdown = [
    { value: 1, label: 'January', ID: 0 },
    { value: 2, label: 'February', ID: 0 },
    { value: 3, label: 'March', ID: 0 },
    { value: 4, label: 'April', ID: 0 },
    { value: 5, label: 'May', ID: 0 },
    { value: 6, label: 'June', ID: 0 },
    { value: 7, label: 'July', ID: 0 },
    { value: 8, label: 'August', ID: 0 },
    { value: 9, label: 'September', ID: 0 },
    { value: 10, label: 'October', ID: 0 },
    { value: 11, label: 'November', ID: 0 },
    { value: 12, label: 'December', ID: 0 }
  ]

  const setBySetPosHandler = (event: React.ChangeEvent<HTMLSelectElement>) => setBySetPos(parseInt(event.target.value))
  const setByWeekDayHandler = (event: React.ChangeEvent<HTMLSelectElement>) => setByWeekDays([event.target.value])
  const setByMonthHandler = (event: React.ChangeEvent<HTMLSelectElement>) => setByMonth(parseInt(event.target.value))

  const intervalChoice = frequencyDropdown?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })
  const singleDayChoice = weekdayDropdown?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })
  const monthChoice = monthlyDropdown?.map((e) => {
    return <option key={e.ID} value={e.value}>{e.label}</option>
  })

  const frequencyChoiceHandler = (event:any) => {
    setInterval(parseInt(event.target.value))
  }
  const byMonthDaySelect = (event:any) => {
    setByMonthDay(parseInt(event.target.value))
  }

  const radioSelectHandler = (input: number) => {
    const getElementValue = (id: string) => {
      const element = document.getElementById(id) as HTMLInputElement | null
      return element ? element.value : ''
    }

    switch (input) {
      case 0: // daily 1
        setDayRadioSelection('everyXDays') // "everyXDays"
        getElementValue('everyXDays')
        setInterval(null)
        setByWeekDays([])
        setDailyOption(false)
        break
      case 1: // daily 2
        getElementValue('everyXDays')
        setDayRadioSelection('everyWeekday')
        setByWeekDays(['mo', 'tu', 'we', 'th', 'fr'])
        setInterval(null)
        setDailyOption(true)
        break
      case 2: // monthly 1
        getElementValue('daySelect')
        getElementValue('monthSelect')
        getElementValue('monthlyInterval')
        setMonthRadioSelection('dayOfMonth') // "dayOfMonth"
        setBySetPos(null)
        setByWeekDays([])
        setInterval(1)
        setByMonthDay(1)
        setMonthlyOption(true)
        break
      case 3: // monthly 2
        setMonthRadioSelection('positionOfMonth')
        getElementValue('daySelect')
        getElementValue('monthlyInterval')
        setByWeekDays(['su'])
        setInterval(1)
        setBySetPos(1)
        setByMonth(null)
        setByMonthDay(null)
        setMonthlyOption(false)
        break
      case 4: // yearly 1
        setYearRadioSelection('specificDayYear')
        getElementValue('selectMonth2')
        getElementValue('bySetPos')
        getElementValue('dayChoice')
        setByMonth(1)
        setByMonthDay(1)
        setBySetPos(null)
        setYearlyOption(true)
        break
      case 5: // yearly 2
        setYearRadioSelection('fixedInstanceMonth')
        getElementValue('selectMonth1')
        getElementValue('daySelectForMonth')
        setByMonth(1)
        setBySetPos(1)
        setByMonthDay(null)
        setInterval(1)
        setByWeekDays(['su'])
        setYearlyOption(false)
        break
      default:
        break
    }
  }

  const daysOfTheWeekSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDay = event.target.value
    const updatedDaysSet = new Set(byWeekDays)

    if (updatedDaysSet.has(selectedDay)) {
      updatedDaysSet.delete(selectedDay)
    } else {
      updatedDaysSet.add(selectedDay)
    }

    // Convert the updated set back to an array
    const updatedDaysArray = Array.from(updatedDaysSet)
    setByWeekDays(updatedDaysArray)
  }

  let patternForm
  if (frequency === 'daily') {
    patternForm = (
            <>
                <div className="radioPattern">

                    <input type="radio" checked={dayRadioSelection === 'everyXDays'} disabled ={props.disabled} onChange={() => radioSelectHandler(0)} name="radioGroup" id="everyFewDays" aria-label="Custom Days" className="frequencyRadio mb-2" />
                    <span> Every
                        <input type="number" id="everyXDays" min="1" aria-label="days"
                            className="daysInput" disabled ={props.disabled} onChange={frequencyChoiceHandler} value={ dayRadioSelection === 'everyXDays' ? interval : NaN} /> day(s)

                    </span>
                </div>
                <div className="radioPattern">
                    <input type="radio" disabled ={props.disabled} onChange={() => radioSelectHandler(1)} name="radioGroup" id="weekdays" aria-label="Weekdays" checked={dayRadioSelection === 'everyWeekday'} className="frequencyRadio mb-2" />
                    <span> Every Weekday</span>
                </div>
            </>)
  } else if (frequency === 'weekly') {
    patternForm = (
                <div>
                    <span>Recur every
                        <input type="number" disabled ={props.disabled} min="1" className="daysInput" onChange={frequencyChoiceHandler} value={interval} aria-label="weeks" /> week(s) on:
                    </span>

                    <div className="daysCheckboxes">
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Sunday" aria-label="Sunday" value="su" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('su')} />
                            <label htmlFor="Sunday">Sunday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Monday" aria-label="Monday" value="mo" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('mo')} />
                            <label htmlFor="Monday">Monday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Tuesday" aria-label="Tuesday" value="tu" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('tu')} />
                            <label htmlFor="Tuesday">Tuesday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Wednesday" aria-label="Wednesday" value="we" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('we')} />
                            <label htmlFor="Wednesday">Wednesday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Thursday" aria-label="Thursday" value="th" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('th')} />
                            <label htmlFor="Thursday">Thursday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Friday" aria-label="Friday" value="fr" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('fr')} />
                            <label htmlFor="Friday">Friday</label>
                        </div>
                        <div>
                            <input disabled ={props.disabled} type="checkbox" id="Saturday" aria-label="Saturday" value="sa" onChange={daysOfTheWeekSelectHandler} checked={byWeekDays.includes('sa')} />
                            <label htmlFor="Saturday">Saturday</label>
                        </div>
                    </div>

                </div>
    )
  } else if (frequency === 'monthly') {
    patternForm = (
            <>
                <div className="radioPattern">

                    <input type="radio" checked={monthRadioSelection === 'dayOfMonth'} disabled ={props.disabled} onChange={() => radioSelectHandler(2)} name="radioGroup" id="fixedDayOfEachMonth" aria-label="Custom Days" className="frequencyRadio mb-2" />

                    <span> Day </span>
                    <input type="number" disabled ={props.disabled} id="daySelect" min="1" max="31" className="daysInput" onChange={byMonthDaySelect} value={monthRadioSelection === 'dayOfMonth' ? byMonthDay : ''} aria-label="Day" />
                    <span> of every </span>
                    <input type="number" disabled ={props.disabled} id="monthSelect" min="1" className="daysInput" onChange={frequencyChoiceHandler} value={monthRadioSelection === 'dayOfMonth' ? interval : ''} aria-label="Months" />

                    <span> month(s) </span>
                </div>

                <div className="radioPattern">
                    <input type="radio" checked={monthRadioSelection === 'positionOfMonth'} disabled ={props.disabled} onChange={() => radioSelectHandler(3)} name="radioGroup" id="customDays" aria-label="Custom Days" className="frequencyRadio mb-2" />

                    <span> The </span>
                    <select id="bySetPosMonth" disabled ={props.disabled} onChange={setBySetPosHandler} value={bySetPos} className="monthlydaysInput" aria-label="Month">

                        {intervalChoice}
                    </select>

                    <select id="selectMinutesStart" disabled ={props.disabled} onChange={setByWeekDayHandler} value={byWeekDays} className="monthlydaysInput" aria-label="Start">

                        {singleDayChoice}
                    </select>

                    <span> of every</span>
                    <input id="monthlyInterval" disabled ={props.disabled} type="number" min="1" className="daysInput" onChange={frequencyChoiceHandler} value={monthRadioSelection === 'positionOfMonth' ? interval : ''} aria-label="Monthly" />

                    <span>month(s)</span>
                </div>
            </>
    )
  } else if (frequency === 'yearly') {
    patternForm = (
            <>
                <span>Recur every
                    <input type="number" min="1" aria-label=" years" className="daysInput" disabled ={props.disabled} onChange={frequencyChoiceHandler} value={interval} /> year(s)
                </span>
                <div className="radioPattern">
                    <input type="radio" checked={yearRadioSelection === 'specificDayYear'} disabled ={props.disabled} onChange={() => radioSelectHandler(4)} name="radioGroup" id="fixedDayOfEachMonth" aria-label="Custom Days" className="frequencyRadio mb-2" />

                    <span> On:
                        <select id="selectMonth1" disabled ={props.disabled} onChange={setByMonthHandler} value={byMonth} className="monthlydaysInput" aria-label="Month">

                            {monthChoice}
                        </select>
                        <input type="number" disabled ={props.disabled} id="daySelectForMonth" min="1" max="31" className="daysInput" onChange={byMonthDaySelect} value={yearRadioSelection === 'specificDayYear' ? byMonthDay : ''} aria-label="Month" />
                    </span>
                  </div>

                  <div className="radioPattern">
                      <input
                          type="radio"
                          checked={yearRadioSelection === 'fixedInstanceMonth'}
                          onChange={() => radioSelectHandler(5)}
                          name="radioGroup"
                          id="fixedDayOfEachMonth"
                          className="frequencyRadio"
                          disabled ={props.disabled}
                      />
                      <label htmlFor="fixedDayOfEachMonth">Custom Days</label>
                      <span>
                          On the:
                          <select
                              id="bySetPos"
                              onChange={setBySetPosHandler}
                              value={bySetPos}
                              className="monthlydaysInput"
                              aria-label="Month"
                              disabled ={props.disabled}
                          >
                              {intervalChoice}
                          </select>
                          <select
                              id="dayChoice"
                              onChange={setByWeekDayHandler}
                              value={byWeekDays}
                              className="monthlydaysInput"
                              aria-label="Day"
                              disabled ={props.disabled}
                          >
                              {singleDayChoice}
                          </select>
                          <span> of </span>
                          <select
                              id="selectMonth2"
                              disabled ={props.disabled}
                              onChange={setByMonthHandler}
                              value={byMonth}
                              className="monthlydaysInput"
                              aria-label="Month"
                          >
                              {monthChoice}
                          </select>
                      </span>
                  </div>

              </>
    )
  }
  const endDateRadioSelect = (input: any) => {
    const getElementValue = (id: string) => {
      const element = document.getElementById(id) as HTMLInputElement | null
      return element ? element.value : ''
    }
    switch (input) {
      case 0:
        setEndRadioSelection('noEndDate')
        setCount(null)
        setEndDate(null)
        getElementValue('endAfterCount')
        getElementValue('endBySelect')
        setDateRange(0)
        break
      case 1:
        setEndRadioSelection('endAfterCount')
        setEndDate(null)
        getElementValue('endBySelect')
        getElementValue('endAfterCount')
        setCount(1)
        setDateRange(1)
        break
      case 2:
        setEndRadioSelection('endBy')
        setCount(null)
        getElementValue('endAfterCount')
        setDateRange(2)
        break
      default:
        break
    }
  }

  const startDateSelectHandler = (event: any) => {
    setStartDate(event.target.value)
  }
  const endDateSelectHandler = (event: any) => {
    setEndDate(event.target.value)
  }
  const countChangeHanlder = (event: any) => {
    setCount(parseInt(event.target.value))
  }

  return (
        <>
            <fieldset className="recurrenceEvent">
                <legend className="recurrenceEventLegend">
                    <div tabIndex={0} aria-label="Recurrence Pattern">Recurrence Pattern</div>
                    <span className="required">*</span>
                </legend>
                <div className="patternAndFrequency">
                    <div className="frequency">
                        <div className='d-flex'>
                            <input type="radio" disabled ={props.disabled} onChange={() => frequencySelectHandler('daily')} name="frequencyGroup"
                                id="recurrenceFrequencyDaily" aria-label="Daily" className="frequencyRadio"
                                checked={frequency === 'daily'} />
                            <span> Daily</span>
                        </div>
                        <div className='d-flex'>
                            <input type="radio" disabled ={props.disabled} onChange={() => frequencySelectHandler('weekly')} name="frequencyGroup"
                                id="recurrenceFrequencyWeekly" aria-label="Weekly" className="frequencyRadio"
                                checked={frequency === 'weekly'} />
                            <span> Weekly</span>
                        </div>
                        <div className='d-flex'>
                            <input type="radio" disabled ={props.disabled} onChange={() => frequencySelectHandler('monthly')} name="frequencyGroup"
                                id="recurrenceFrequencyMonthly" aria-label="Monthly" className="frequencyRadio"
                                checked={frequency === 'monthly'} />
                            <span> Monthly</span>
                        </div>
                        <div className='d-flex'>
                            <input type="radio" disabled ={props.disabled} onChange={() => frequencySelectHandler('yearly')} name="frequencyGroup"
                                id="recurrenceFrequencyYearly" aria-label="Yearly" className="frequencyRadio"
                                checked={frequency === 'yearly'} />
                            <span> Yearly</span>
                        </div>
                    </div>

                    <div className="pattern">
                        {patternForm}
                    </div>
                </div>

            </fieldset>

            <p className="required">{props.patternError}</p>

            <fieldset className="recurrenceEvent">
                <legend className="recurrenceEventLegend">
                    <div tabIndex={0} aria-label="Range of recurrence">Range of recurrence</div>
                    <span className="required">*</span>
                </legend>

                <div className="rangeRecurrence">

                    <div className='row'>

                        <div className='col-lg-6 col-sm-12'>
                            <div>
                                <span>Start: </span><input type="date" min={todayDate} disabled ={props.disabled} onChange={startDateSelectHandler} value={startDate} aria-label="Start" className="rangedaysInput" />
                            </div>
                        </div>

                        <div className='col-lg-6 col-sm-12'>

                            <div className="endSelection">
                                <div>
                                    <input type="radio" name="endRadio" id="noEndDate"
                                    disabled ={props.disabled}
                                        onChange={() => endDateRadioSelect(0)}
                                        aria-label="No End Date" className="frequencyRadio" checked={dateRange === 0} />
                                    <span>No End Date</span>
                                </div>

                                <div>
                                    <input type="radio" name="endRadio" id="endAfterOcurrences"
                                    disabled ={props.disabled}
                                        onChange={() => endDateRadioSelect(1)}
                                        aria-label="End After Ocurrences" className="frequencyRadio" checked={dateRange === 1} />
                                    <span>End after: </span>
                                    <input type="number"
                                    disabled ={props.disabled}
                                        min="1" onChange={countChangeHanlder} value={count ? count : ''} id="endAfterCount" aria-label="ocurrences" className="daysInput" />
                                    <span> occurrence(s)</span>
                                </div>

                                <div>
                                    <input type="radio" name="endRadio" id="endBy"
                                    disabled ={props.disabled}
                                        onChange={() => endDateRadioSelect(2)}
                                        aria-label="End By" className="frequencyRadio" checked={dateRange === 2} />
                                    <span>End by: </span>

                                    <input type="date" id="endBySelect" aria-label="Date"
                                    disabled ={props.disabled}
                                        onChange={endDateSelectHandler} min={startDate} value={endDate ? endDate : ''} className="rangedaysInput" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </fieldset>

            <p className="required">{props.rangeError}</p>
        </>
  )
}
export default RecurrencePattern
