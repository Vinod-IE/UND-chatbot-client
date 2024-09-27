import React, { useEffect } from 'react'
import SpPeoplePicker from 'react-sp-people-picker'
import InputLabel from './input-label'
import Buttons from '../../components/buttons/buttons'
export const Rbpeoplepicker = (inputProps:any) => {
    useEffect(() => {
        const inputElement = document.querySelector('input[type="text"][placeholder="Start typing name or email address..."]')
        if (inputElement) {
          inputElement.setAttribute('class', `input border-focus-primary ${inputProps?.className} ${inputProps?.iconSearch && 'border-radius0'}`)
          inputElement.setAttribute('placeholder', inputProps?.placeholder)
          inputElement.setAttribute('id', inputProps?.inputProps?.id)
        }
      }, [])
  return (
    <>
     <div className={`sppeoplepicker ${inputProps?.icon && 'p-relative peoplepicker-main'} ${inputProps?.fromclassName} ${inputProps?.iconSearch && 'd-flex'}`}>
       {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} label={inputProps?.label} className={inputProps?.inputProps?.className} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} currency={inputProps?.isCurrency} mandatory={inputProps?.isMandatory}/>}
       <SpPeoplePicker onSelect={inputProps?.onSelect} onChange={inputProps?.onChange} onClick={inputProps?.onClick}/>
        {inputProps?.icon && <span className={`peoplepickerusericon color-primary ${inputProps?.icon}`}></span>}
        {inputProps?.iconSearch && <div className='bordered1'><Buttons label="Search" types="button" icon="icon--rb-magnifying-glass font-12 me-md-1 bold" className="btn-border-radius0 segoeui-regular font-0" onClick = {inputProps?.inputprops?.onClick}/></div>}
        {inputProps?.isButton && <div>{inputProps?.isButton}</div>}
     </div>
    </>
  )
}
