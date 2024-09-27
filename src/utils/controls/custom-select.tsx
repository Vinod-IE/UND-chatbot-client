import React, { useState, forwardRef, useContext } from 'react'
import Select, { AriaOnFocus, components } from 'react-select'
import InputLabel from './input-label'
import { SELECT_MESSAGE } from '../../configuration'
import { optionsTypes, select1Options } from './select-options-data'
import { PopupCloseContext } from '../../shared/contexts/popupclose-context'
interface Props {
  options?:any
  placeholder?:any
  error?: any
  props?: any,
  readonly?: any,
  formClassName?: any,
  inputProps?: any,
  label?: any,
  className?: any,
  type?: any,
  id?: any,
  badge?: any,
  icon?: any,
  name?: any,
  menuPosition?:any,
  menuPlacement?:any,
  badgecount?: any,
  inline?: any,
  style?: any,
  'aria-label'?: any,
  onChange?: any,
  disabled?: any,
  isMandatory?: any,
  infoClassName?: any,
  info?: any,
  infoIcon?: any,
  isInfo?: any,
  extras?:any,
  extrasClassName?:any;
  onClick?:any;
  labelclassName?:any;
  value?: any
  defaultAll?: boolean,
  defaultSelect?: boolean,
  useFormattedOptions?: boolean;
}
const CustomOption = (props:any) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: props.data.value, // Use the hex code for the background color
            marginRight: '8px',
          }}
        ></span>
        {props.data.label}
      </div>
    </components.Option>
  )
}
const CustomSelect = forwardRef((inputProps: Props, ref: any) => {
  const [ariaFocusMessage, setAriaFocusMessage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuOpen1, setIsMenuOpen1] = useState(false)
  const formattedOptions = inputProps?.useFormattedOptions
    ? inputProps?.options?.map((option: any) => ({ value: option.value, label: option.label }))
    : inputProps?.options?.map((option: any) => ({ value: option, label: option }))
 
  const formattedValues = inputProps?.useFormattedOptions
    ? inputProps?.value?.map((existedValue: any) => ({ value: existedValue.value, label: existedValue.label }))
    : inputProps?.value?.map((existedValue: any) => ({ value: existedValue, label: existedValue }))
  if (inputProps?.defaultSelect) {
    formattedOptions?.unshift({ value: 'Select', label: 'Select' })
  }
  if (inputProps?.defaultAll) {
    formattedOptions?.unshift({ value: 'All', label: 'All' })
  }
  const onFocus: AriaOnFocus<optionsTypes> = ({ focused, isDisabled }) => {
    const msg = `You are currently focused on option ${focused.label}${
        isDisabled ? ', disabled' : ''
      }`
    setAriaFocusMessage(msg)
    return msg
  }
  const onkeyopenMenu = (event: { key: any }) => {
    if (event.key === 'Enter') {
      setIsMenuOpen1(!isMenuOpen1)
      setIsMenuOpen(!isMenuOpen)
    }
  }
  const onMenuOpen = () => {
    setIsMenuOpen(true)
    setIsMenuOpen1(true)
  }
  const onMenuClose = () => {
    setIsMenuOpen(false)
    setIsMenuOpen1(false)
  }
  const CustomSingleValue = (props:any) => {
    return (
      <components.SingleValue {...props}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: props.data.value, // Use the hex code for the background color
              marginRight: '8px',
            }}
          ></span>
          {props.data.label}
        </div>
      </components.SingleValue>
    )
  }
 
  return (
    <div className={inputProps?.formClassName}>
      {inputProps?.label && <InputLabel labelProps={{ htmlFor: inputProps?.id }} label={inputProps?.label} labelclassName={inputProps?.labelclassName} infoLabel={inputProps?.info} isinfoLabel={inputProps?.isInfo} isinfoIcon={inputProps?.infoIcon} isinfoClassName={inputProps?.infoClassName} mandatory={inputProps?.isMandatory} extras={inputProps?.extras} extrasClassName={inputProps.extrasClassName} onClick={inputProps?.onClick}/>
      }
      <Select
        aria-labelledby={inputProps?.id}
        inputId={inputProps?.id}
        classNamePrefix="react-select"
        name={inputProps?.id}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        isDisabled={inputProps?.disabled}
        id={inputProps?.inputProps?.id}
        value={formattedValues}
        placeholder={inputProps?.placeholder}
        aria-readonly={inputProps?.readonly}
        className={inputProps?.className}
        onChange={inputProps?.onChange}
        options={formattedOptions}
        menuPosition={inputProps?.menuPosition}
        menuIsOpen={isMenuOpen1 || isMenuOpen}
        aria-label={inputProps['aria-label'] || inputProps?.label}
        onKeyDown={onkeyopenMenu}
        aria-required={inputProps?.isMandatory}
        ref={ref}
        components={inputProps?.useFormattedOptions ? { Option: CustomOption, SingleValue: CustomSingleValue } : {}}
        // styles={customStyles}
      />
      {inputProps?.error && <p className='errormsg'>{SELECT_MESSAGE} {inputProps?.label || inputProps['aria-label']}</p>}
    </div>
  )
})
CustomSelect.displayName = 'CustomeSelect'
export default CustomSelect
