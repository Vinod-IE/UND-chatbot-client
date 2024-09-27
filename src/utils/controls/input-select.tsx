/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import InputLabel from './input-label'
import { SELECT_MESSAGE } from '../../configuration'
interface Props {
  props?:any,
  readonly?:any,
  formClassName?:any,
  value?:any,
  inputProps?:any,
   label: any,
   className?: any,
   type? : any,
   id?: any,
   badge? : any,
   icon?: any,
   name? : any,
   badgecount?: any,
   inline?:any,
   style?:any,
   'aria-label'?: any,
   onChange?:any,
   disabled?:any,
   isMandatory?:any,
   infoClassName?:any,
   info?:any,
   infoIcon?:any,
   isInfo?:any,
   options?:any,
   defaultSelect?: boolean,
   defaultAll?: boolean,
   error?: any
}
const InputSelect = (inputProps:Props) => {
  return (
    <div className={inputProps?.formClassName}>
      {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} label={inputProps?.label} className={inputProps?.inputProps?.className} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} mandatory={inputProps?.isMandatory}/>}
      <select
        name={inputProps?.inputProps?.name}
        id={inputProps?.inputProps?.id}
        value={inputProps?.value}
        placeholder={inputProps?.inputProps?.placeholder}
        onChange={inputProps?.onChange}
        disabled={inputProps?.disabled}
        aria-readonly={inputProps?.readonly}
        className={inputProps?.className}
        data-limit='37'
        style={inputProps?.style}
        aria-label={inputProps['aria-label'] || inputProps?.label}
        aria-required={inputProps?.isMandatory}
        size={inputProps?.inputProps?.size || 'sm'}
      >
        {inputProps?.defaultSelect && <option value=''>Select</option>}
        {inputProps?.defaultAll && <option value=''>All</option>}
        {inputProps?.options && inputProps?.options.length > 0
          ? inputProps?.options.map(
            (item: any) => (
              (<option value={item} key={item}>{item}</option>)
            )
          )
          : null
        }
        </select>
        {inputProps.error ? <p className='errormsg'>{SELECT_MESSAGE} {inputProps?.label || inputProps['aria-label']}</p> : ''}
      </div>
  )
}
export default InputSelect
