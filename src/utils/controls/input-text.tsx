import React from 'react'
import InputLabel from './input-label'
import { ENTER_MSG } from '../../configuration'
import Buttons from '../../components/buttons/buttons'
const InputText = (inputProps:any) => {
  return (
    <div className={inputProps?.formClassName}>
      {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} label={inputProps?.label} className={inputProps?.inputProps?.className} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} currency={inputProps?.isCurrency} mandatory={inputProps?.isMandatory}/>}
      <input
        name={inputProps?.inputProps?.name}
        id={inputProps?.inputProps?.id}
        value={inputProps?.value}
        maxLength={inputProps?.inputProps?.maxLength}
        onChange={inputProps?.onChange}
        disabled={inputProps?.disabled}
        readOnly={inputProps?.readonly}
        className={`input ${inputProps?.className}`}
        style={inputProps?.style}
        aria-label={inputProps['aria-label'] || inputProps?.label}
        aria-required={inputProps?.isMandatory}
        size={inputProps?.inputProps?.size || 'sm'}
        type={inputProps?.type || 'text'}
        placeholder={inputProps?.inputProps?.placeholder}
        min={inputProps?.min}
        max={inputProps?.max}
      />
      {(inputProps.error && inputProps?.errorMsg)
        ? <p className='errormsg'>{inputProps.errorMsg}</p>
        : inputProps.error
          ? <p className='errormsg'>{ENTER_MSG} {inputProps?.label || inputProps['aria-label']}</p>
          : ''}
         
      </div>
  )
}
export default InputText
