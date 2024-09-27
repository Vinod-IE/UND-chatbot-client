import React, { useEffect } from 'react'
import { PageHeader } from '../../layouts/header/page-header'
import Feedback from '../../components/feedback/feedback'
export default function Sitefeedback () {
useEffect(()=>{
  document.title='Site Feedback'
})
  return (
    <>
    <PageHeader icon="icon-feedback" name='Site Feedback' />
      <div className="container containerheight d-flex justify-content-center align-items-center">
      <Feedback />
      </div>
    </>
  )
}
