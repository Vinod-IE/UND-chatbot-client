import React from 'react'
import { Tableaccordion } from '../../components/table/table-accordians'
import './listview.css'
import Accordions from '../../components/accordions/accordions'
import InputCheck from '../../utils/controls/input-checkbox'
const Listthree = () => {
  const accordionitems = [
    {
      Id: 1,
      title: 'Guidelines',
      count: '25',
      extras: (
        <InputCheck
          inputProps={{
            id: 'all',
            name: 'Input Check',
            type: 'checkbox',
            label: 'All'
          }}
          formClassName='form-horizontal font-0'
          className='h-auto'
        />
      ),
      content: (
        <ul>
          <Tableaccordion />
        </ul>
      )
    },
    {
      Id: 2,
      title: 'Templates',
      is_active: 'false',
      count: '20',
      extras: (
        <InputCheck
          inputProps={{
            id: 'selectall',
            name: 'Input Check',
            type: 'checkbox',
            label: 'All'
          }}
          formClassName='form-horizontal font-0'
          className='h-auto'
        />
      ),
      content: (
        <ul>
          <Tableaccordion />
        </ul>
      )
    }
  ]
  return (
    <div>
      <Accordions
        items={accordionitems}
        className="accordions colored"
        icon="icon-right-arrow px-1 ms-auto"
        defaultActivekey='1'
        count="ms-1 badge bgcolor-primary border-radius3 px-1 font-10 whitetext"
        isExpandAll={true}
        inputProps={{
          className: 'justify-content-start segoeui-semibold font-13',
          accordionheadClass: 'border-primary border-radius overflow-hidden',
          contentclassName: 'p-0'

        }}
        actions= {
          [{
            label: 'Edit',
            alabel: 'Edit',
            icon: 'icon-pencil me-xl-1',
            className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
            // onClick: onEdit
          },
          {
            label: 'Delete',
            alabel: 'Delete',
            icon: 'icon-delete me-xl-1',
            className: 'btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap d-none'
            // onClick: onDelete
          }]
        }
      />
    </div>
  )
}
export default Listthree
