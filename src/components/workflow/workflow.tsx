/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useContext, useEffect } from 'react'
import ActionButtons from '../buttons/actionbutton'
import { workflow } from './workflow-data'
import './workflow.css'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
import Buttons from '../buttons/buttons'
export default function Workflow () {
  const [stepsOpen,setStepsOpen] = useState(false)
  const workflowItems = workflow.map((items,index) =>{
    const flowitems = items.title.split(' ')
    return(
      <li className="d-flex flex-column align-items-center px-1" key={index}>
          <div className="workflow-dots"></div>
          <div tabIndex={0} className="workflow-title1 font-11">
              {items.title}
          </div>
      </li>
      )
    }
  )
  return (
    <div className="ms-auto">
         <ul onMouseOver={() => {!stepsOpen && setStepsOpen(true)}} onMouseOut={() => {stepsOpen && setStepsOpen(false)}} className={stepsOpen ? 'list-type-none d-flex workflow' : 'list-type-none d-flex workflow  workflow-collapsed'}>
          {workflowItems}
        </ul>
          <Buttons
            label=""
            aria-label="Workflow"
            icon="icon-sitemap font-16 whitebg p-2 border-radius4"
            className='btn btn-sm font-0 p-0 m-2 btn-WorkFlow'
            onClick={() => {setStepsOpen(!stepsOpen)}}
            onMouseOver={() => {!stepsOpen && setStepsOpen(true)}}
            onMouseOut={() => {stepsOpen && setStepsOpen(false)}}
        />
      </div>
  )
}
