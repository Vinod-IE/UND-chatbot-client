/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React from 'react'
import InputLabel from './input-label'
import { data } from 'jquery'
import { an } from '@fullcalendar/core/internal-common'

interface Props {
  props?:any,
  changeRadio?:any,
  formClassName?:any,
  inputProps?:any,
   label?: any,
   className?: any,
   type? : any,
   id?: any,
   badge? : any,
   icon?: any,
   name? : any,
   badgecount?: any,
   inline?:any,
   style?:any,
   isInfo?:any,
   info?:any,
   tooltip?:any,
   infoIcon?:any,
   isMandatory?:any,
   'tip-data'?:any,
   'aria-label'?: any,
   onClick?:any
   checked?: any
   onChange?: any
   infoClassName?:any,
   disabled?:any
}

const InputCheck = (inputProps:Props) => {
  const changefun = (e:any) => {
    if (inputProps?.type === 'Radio') { inputProps?.changeRadio(e, inputProps?.inputProps.changeID) }
  }
  return (

      <div className={inputProps?.formClassName}>
        {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.id }} label={inputProps?.label} className={inputProps?.className} isbadge={inputProps?.badgecount === 0 ? 0 : inputProps?.badgecount} badge={inputProps?.badge} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoClassName={inputProps?.infoClassName} isinfoIcon={inputProps?.infoIcon} mandatory={inputProps?.isMandatory} />}
        <input
          name={inputProps?.inputProps.name}
          id={inputProps?.inputProps.id}
          value={inputProps?.inputProps.value}
          onChange={inputProps?.onChange}
          disabled={inputProps?.inputProps.disabled}
          readOnly={inputProps?.inputProps.readonly}
          checked={inputProps?.checked}
          className={inputProps?.className}
          style={inputProps.style}
          aria-label={inputProps?.inputProps['aria-label'] || inputProps?.inputProps.label}
          aria-required={inputProps?.inputProps.isMandatory}
          size={inputProps?.inputProps.size || 'sm'}
          type={inputProps?.inputProps.type || 'check'}
          placeholder={inputProps?.inputProps.placeholder}
          onClick={inputProps?.onClick}
        />
        {inputProps?.inputProps.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps.id }} label={inputProps?.inputProps.label} className={inputProps?.inputProps.className} isbadge={inputProps?.inputProps?.badgecount} badge={inputProps?.inputProps?.badge} infoLabel={inputProps?.inputProps.info} isinfoLabel={inputProps?.inputProps.isInfo} isinfoIcon={inputProps?.inputProps.infoIcon} isinfoClassName={inputProps?.inputProps.tooltip} mandatory={inputProps?.inputProps.isMandatory} />}
        {inputProps?.inputProps?.mandatory && <span className="mandatory">*</span>}  {inputProps?.inputProps?.isInfo && <span tip-data={inputProps?.inputProps?.info} >
          {inputProps?.icon && <span className={inputProps?.icon}></span>}
        </span>}
      </div>

  )
}
export default InputCheck
