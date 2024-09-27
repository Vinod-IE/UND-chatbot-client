import React from 'react'
import { instructions } from './instructions-data'
import './instructions.css'
export default function Instructions (props: any, ref:any) {
  return (
        <div ref={props?.current} className="col-md-12 no-gutters instructionslist mb-3 py-2 ps-2 whitebg shadow font-12 sourcesanspro text-color5 bordered7 border-radius ">
                  <ul tabIndex={0} aria-live="polite">
                    {instructions.map(items =>
                      <li className="mb-2" key={items.link}>
                      {items.title}
                   </li>
                    )}
                </ul>
            </div>
  )
}
