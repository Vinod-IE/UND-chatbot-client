import React from 'react'
import InputLabel from './input-label'
const InputSearch = (inputProps:any) => {
  return (
    <div className={inputProps?.formClassName}>
      {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.inputProps?.id }} label={inputProps?.label} className={inputProps?.inputProps?.className} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} mandatory={inputProps?.isMandatory}/>}
      <div className={inputProps?.searchgroup}>
      {inputProps?.licon && <a onClick={inputProps?.onClick} title={inputProps?.inputProps?.placeholder || inputProps?.label || 'Search'}><span className={inputProps?.licon}></span></a>}
      <input
        name={inputProps?.inputProps?.name}
        id={inputProps?.inputProps?.id}
        value={inputProps?.inputProps?.value}
        maxLength={inputProps?.inputProps?.maxLength}
        onChange={inputProps?.onChange}
        onClick={inputProps?.onClick}
        disabled={inputProps?.disabled}
        readOnly={inputProps?.readonly}
        className={inputProps?.className}
        style={inputProps?.style}
        aria-label={inputProps['aria-label'] || inputProps?.inputProps?.arialabel || inputProps?.label}
        aria-required={inputProps?.isMandatory}
        size={inputProps?.inputProps?.size || 'sm'}
        type={inputProps?.type || 'search'}
        placeholder={inputProps?.inputProps?.placeholder}
      />
      {inputProps?.icon && <a onClick={inputProps?.onClick} title={inputProps?.inputProps?.placeholder || inputProps?.label || 'Search'}><span className={inputProps?.icon}></span></a>}
      </div>
      </div>
  )
}
export default InputSearch
