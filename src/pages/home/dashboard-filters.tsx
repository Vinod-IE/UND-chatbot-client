import React, { useEffect, useState } from 'react'
import Buttons from '../../components/buttons/buttons'
import CustomSelect from '../../utils/controls/custom-select'
export default function Dashboardfilters(props: any) {
  const defaultValue = 'All'
  const [filter1, setFilter1] = useState<any>([])
  const [filter2, setFilter2] = useState<any>([])
  const [filter3, setFilter3] = useState<any>([])
  const [filter4, setFilter4] = useState<any>([])
  const [filter5, setFilter5] = useState<any>([])
  const { masterData, searchQuery, change, table } = props
  function removeDuplicates(arr: any[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index)
  }
  function toRemovenullorEmptyValues(array: any[]) {
    let filtered = array.filter(function (el: string | null) {
      return el != null && el != ''
    })
    filtered = removeDuplicates(filtered)
    return filtered
  }
  useEffect(() => {
    const filter1Values: string[] = []
    const filter2Values: string[] = []
    const filter3Values: string[] = []
    const filter4Values: string[] = []
    const filter5Values: string[] = []
    masterData?.forEach((item: { filter1: string; filter2: string; filter3: string; filter4: string; filter5: string }) => {
      filter1Values.push(item.filter1)
      filter2Values.push(item.filter2)
      filter3Values.push(item.filter3)
      filter4Values.push(item.filter4)
      filter5Values.push(item.filter5)
    })
    setFilter1(toRemovenullorEmptyValues(filter1Values))
    setFilter2(toRemovenullorEmptyValues(filter2Values))
    setFilter3(toRemovenullorEmptyValues(filter3Values))
    setFilter4(toRemovenullorEmptyValues(filter4Values))
    setFilter5(toRemovenullorEmptyValues(filter5Values))
  }, [masterData])
  function hasValues(obj: any) {
    if (obj) {
      return Object.keys(obj).length > 0
    }
  }
  const [filters, setFilters] = useState({
    filter1: { order: 1, value: change && hasValues(change) ? change?.filter1?.value : defaultValue },
    filter2: { order: 2, value: change && hasValues(change) ? change?.filter2?.value : defaultValue },
    filter3: { order: 3, value: change && hasValues(change) ? change?.filter3?.value : defaultValue },
    filter4: { order: 4, value: change && hasValues(change) ? change?.filter4?.value : defaultValue },
    filter5: { order: 5, value: change && hasValues(change) ? change?.filter5?.value : defaultValue }
  })

  const onChangeInputSelect = (event: any, name: any) => {
    const newFilter = { ...filters, [name]: { order: 0, value: event } }
    setFilters({ ...newFilter })
    props.selectedFilters({ ...newFilter })
  }

  useEffect(() => {
    const data = masterData
    if (data?.length > 0) {
      const dataFilter = data.filter((item: any) => {
        return (filterBy(item.filter1, filters.filter1.value === 'Empty' ? null : filters.filter1.value) &&
          filterBy(item.filter2, filters.filter2.value === 'Empty' ? null : filters.filter2.value) &&
          filterBy(item.filter3, filters.filter3.value === 'Empty' ? null : filters.filter3.value) &&
          filterBy(item.filter4, filters.filter4.value === 'Empty' ? null : filters.filter4.value) &&
          filterBy(item.filter5, filters.filter5.value === 'Empty' ? null : filters.filter5.value)
        )
      })
      props.filteredData(dataFilter)
    }
  }, [filters, masterData])
  function filterBy(value: any, filter: any) {
    if (filter === undefined || filter === '') {
      filter = defaultValue
    } else if (typeof filter == 'string') {
      if (filter.toUpperCase() === 'All') {
        filter = defaultValue
      } else {
        filter = filter.toUpperCase()
      }
    }
    value = (typeof value == 'string' ? value.toUpperCase() : value)
    return (filter === defaultValue.toUpperCase() || value === filter)
  }
  const ClickClearAll = async () => {
    setFilters({
      filter1: { order: 1, value: defaultValue },
      filter2: { order: 2, value: defaultValue },
      filter3: { order: 3, value: defaultValue },
      filter4: { order: 4, value: defaultValue },
      filter5: { order: 5, value: defaultValue },
    })

    props.selectedFilters({
      filter1: { order: 2, value: defaultValue },
      filter2: { order: 3, value: defaultValue },
      filter3: { order: 4, value: defaultValue },
      filter4: { order: 5, value: defaultValue },
      filter5: { order: 6, value: defaultValue },
    })
  }
  return (
    <>
      <div className="py-2 ps-3 d-flex flex-column flex-sm-row align-items-md-center w-100 maxfitcontent-sm ms-auto">
        <div className='d-flex flex-wrap flex-column flex-sm-row justify-content-sm-end gap-2'>

          <CustomSelect
            id='filter'
            value={[filters?.filter1?.value]}
            options={filter1}
            onChange={(e: any) => onChangeInputSelect(e.value, 'filter1')}
            label='Filter 1'
            formClassName="form-horizontal text-nowrap"
            className='form-sm w-100 customselect max-w-80 min-w-80 '
          />
          <CustomSelect
            id='filter2'
            value={[filters?.filter2?.value]}
            options={filter2}
            onChange={(e: any) => onChangeInputSelect(e.value, 'filter2')}
            label='Filter 2'
            formClassName="form-horizontal text-nowrap"
            className='form-sm w-100 customselect max-w-80 min-w-80 '
          />
          <CustomSelect
            id='filter3'
            value={[filters?.filter3?.value]}
            options={filter3}
            onChange={(e: any) => onChangeInputSelect(e.value, 'filter3')}
            label='Filter 3'
            formClassName="form-horizontal text-nowrap"
            className='form-sm w-100 customselect max-w-80 min-w-80 '
          />
          <CustomSelect
            id='filter4'
            value={[filters?.filter4?.value]}
            options={filter4}
            onChange={(e: any) => onChangeInputSelect(e.value, 'filter4')}
            label='Filter 4'
            formClassName="form-horizontal text-nowrap"
            className='form-sm w-100 customselect max-w-80 min-w-80 '
          />
          <CustomSelect
            id='filter5'
            value={[filters?.filter5?.value]}
            options={filter5}
            onChange={(e: any) => onChangeInputSelect(e.value, 'filter5')}
            label='Filter 5'
            formClassName="form-horizontal text-nowrap"
            className='form-sm w-100 customselect  max-w-80 min-w-80 '
          />
        </div>
        <Buttons
          onClick={ClickClearAll}
          label="Clear All"
          aria-label="Clear All"
          className='btn btn-sm links ms-auto ms-md-0 text-nowrap links-over-underline'
        />
      </div>
    </>
  )
}
