import React, { useState } from 'react'

import Autocomplete from 'react-autocomplete'
const PeoplePicker = () => {
  const [val, setVal] = useState('')
  const NO_MATCHES_FOUND = 'No Results'
  const users = [{
    id: 0,
    title: 'Filing guidelines',
    link: '/'
  }, {
    id: 1,
    title: 'Documents Needed',
    link: '/'
  }, {
    id: 2,
    title: 'VMS',
    link: '/'
  }, {
    id: 3,
    title: 'Air University',
    link: '/'
  }, {
    id: 4,
    title: 'AF Reserve',
    link: '/'
  }, {
    id: 5,
    title: 'AF Civilian Careers',
    link: '/'
  }, {
    id: 6,
    title: 'Leadership',
    link: '/'
  }, {
    id: 7,
    title: 'Maxwell Driving Tour (No Maps)',
    link: '/'
  }, {
    id: 8,
    title: 'DTMO',
    link: '/'
  }]

  return (
    <>
      <div className="peoplepicker p-relative">
        <Autocomplete data-class='test'
          items={users}
          shouldItemRender={
            (item:any, value:any) => (item.title?.toLowerCase().indexOf(value?.toLowerCase()) > -1)}
          getItemValue={(item:any) => item.title}
          renderItem={(item:any, isHighlighted:any) =>
            <div style={{
              background: isHighlighted
                ? '#1E90FF'
                : 'white',
              color: isHighlighted
                ? '#FFF'
                : ''
            }}
              key={item.id}>
              {item.title}
            </div>
          }
          renderMenu={(items:any, value:any) => (
            <div className='peoplepicker-lists'>{items?.length === 0 ? `${NO_MATCHES_FOUND}` : items}</div>
          )}
          value={val}
          onChange={(e:any) => setVal(e.target.value)}
          onSelect={(e:any) => setVal(e)}
          inputProps={{
            placeholder: 'Enter a name or email address...',
            'aria-label': 'Customer Duty Email',
            maxLength: 40,
            className: 'form-sm'
          }}
        />
      </div>
    </>
  )
}
export default PeoplePicker
