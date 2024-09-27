import React from 'react'
import InputLabel from './input-label'
import { ENTER_MSG } from '../../configuration'
const InputTextarea = (inputProps: any) => {
  return (
    <div className={inputProps?.formClassName}>
      {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} label={inputProps?.label} className={inputProps?.inputProps?.className} />}
      <textarea
        name={inputProps?.inputProps?.name}
        id={inputProps?.inputProps?.id}
        value={inputProps?.inputProps?.value}
        maxLength={inputProps?.inputProps?.maxLength}
        onChange={inputProps?.inputProps?.onChange} // Use inputProps.inputProps.onChange
        disabled={inputProps?.disabled}
        readOnly={inputProps?.readonly}
        className={inputProps?.className}
        aria-label={inputProps['aria-label'] || inputProps?.label}
        aria-required={inputProps?.isMandatory}
        placeholder={inputProps?.inputProps?.placeholder}
        rows={inputProps?.rows}
        cols={inputProps?.cols}
        onKeyDown={inputProps?.inputProps?.onKeyDown}
      />
      {inputProps.error && <p className='errormsg'>{ENTER_MSG} {inputProps?.label || inputProps['aria-label']}</p>}
    </div>
  )
}

export default InputTextarea
