import React from 'react'
import './footer.css'
export default function Footer () {
  return (
        <div className="footer-wraper shadow5 whitebg w-100">
            <div className="container justify-content-center d-flex">
            &copy;{new Date().getFullYear()} RhyBus All Rights Reserved
            </div>
        </div>
  )
}
