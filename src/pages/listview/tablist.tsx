/* eslint-disable react/no-unknown-property */
import React, { useContext, useEffect, useRef, useState } from 'react'
import './listview.css'
import $ from 'jquery'
import { AllRequests } from '../../components/table/table'

const Listone = (props: any) => {
  return (
      <AllRequests page={props.page}/>
  )
}
export default Listone
