import React, { useState } from 'react'
import './table.css'
export const Tablev1 = (props: any, children: any) => {
   return (
      <div id="scrolablepopupcontent" className='w-100 overflow-auto listviewtable'>
         <table className={props.className} >
            {children}
         </table>
      </div>
   )
}
