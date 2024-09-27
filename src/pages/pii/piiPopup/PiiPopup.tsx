import React from 'react'
import { FILEARRAY, LABELSTOSCAN, PIIProps } from '../commonFunctions/pii.types'
/**
 * @param props?.piiScan is the object with all of the pii information from the scan
 */

const RenderPIIPopup = (props: PIIProps) => {
  const handleClick = (answer: string, key: string) => {
    const updatedPIIScan = { ...props?.piiScan }
    if (LABELSTOSCAN.includes(key)) {
      updatedPIIScan[key] = {
        ...updatedPIIScan[key],
        userAnswer: answer
      }
    } else {
      updatedPIIScan.FileArray.value[key] = {
        ...updatedPIIScan.FileArray.value[key],
        userAnswer: answer
      }
    }
    props?.setPIIScan(() => ({
      ...updatedPIIScan
    }))
  }

  return (
    <section className="pii-compliance-validation">
      <p tabIndex={0} aria-label='FOUND PII RELATED DATA IN BELOW FIELDS'>FOUND PII RELATED DATA IN BELOW FIELDS</p>
      <ul>
        {props?.piiScan && Object.keys(props?.piiScan).map((key) => {
          if (key === FILEARRAY && props?.piiScan.FileArray) {
            return props?.piiScan.FileArray.value.map((file: any, index: any) => {
              if (file.resultsArray?.length > 0 && !file.userAnswer) {
                return (
                  <li key={file.value.name}>
                    {file.value.name}: <span dangerouslySetInnerHTML={{ __html: file.displayText }}></span>
                    <div className='pii-compliance-btns'>
                      {/* eslint-disable-next-line no-script-url */}
                      <a href="javascript:void(0)" className="pii-accept" onClick={() => handleClick('Accept', index)} title='Accept'>Accept</a>
                      {/* eslint-disable-next-line no-script-url */}
                      <a href="javascript:void(0)" className="pii-ignore" onClick={() => handleClick('Ignore', index)} title='Ignore'>Ignore</a>
                    </div>
                  </li>
                )
              }
            })
          } else if (props?.piiScan[key].resultsArray?.length > 0 && !props?.piiScan[key].userAnswer) {
            return (
              <li key={key}>
                {key}: <span dangerouslySetInnerHTML={{ __html: props?.piiScan[key].displayText }}></span>
                <div className='pii-compliance-btns'>
                  {/* eslint-disable-next-line no-script-url */}
                  <a href="javascript:void(0)" className="pii-accept" onClick={() => handleClick('Accept', key)} title='Accept'>Accept</a>
                  {/* eslint-disable-next-line no-script-url */}
                  <a href="javascript:void(0)" className="pii-ignore" onClick={() => handleClick('Ignore', key)} title='Ignore'>Ignore</a>
                </div>
              </li>
            )
          }
        })
        }
      </ul>
    </section>
  )
}
export default RenderPIIPopup
RenderPIIPopup.displayName = 'RenderPIIPopup'
