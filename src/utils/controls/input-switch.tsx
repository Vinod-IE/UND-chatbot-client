/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable react/prop-types */
import { pnpUpdate } from '../../Global'
import { ListNames } from '../../configuration'
import './switch.css'
import React, { useState } from 'react'
interface Props {
  isOn?:any,
  handleToggle?:any,
  id?: any
  Enable?: any
  getCategories?:any,
  onChange? : any,
  mainId?: any
}
const Switch: React.FC<Props> = (props: Props) => {
  const enableValue = props?.Enable !== 'false'
  const [enableNewCat, setEnableNewCat] = useState<any>(enableValue)
  const handleSave = async (value: any, eKey: any, IsEnableUpdate: any, mainId: any) => {
    const ObjectArray : any = {}
    if (IsEnableUpdate) {
      ObjectArray.ID = mainId
      ObjectArray.IsEnable = value.toString()
      ObjectArray.ItemModifiedById = _spPageContextInfo.userId
      ObjectArray.ItemModified = new Date()
      await pnpUpdate(ListNames?.PIICATEGORY, ObjectArray).then(async (data: any) => {
        await props?.getCategories?.getCategories()
        await props?.getCategories?.getData()
      })
    }
  }
  function enableNewCategory (e: any) {
    setEnableNewCat(e.target.checked)
    handleSave(!enableNewCat, props.id, true, props?.mainId)
  }
  return (
    <>
      <input
        checked={enableNewCat}
        className="react-switch-checkbox"
        id={props.id ? props.id : 'react-switch-new'}
        data-id={props.id}
        type="checkbox"
        onChange={(e) => enableNewCategory(e)}
      />
      <label
        className={enableNewCat ? 'react-switch-label bgcolor-primary' : 'react-switch-label bgcolor-5'}
        htmlFor={props.id ? props.id : 'react-switch-new'}
      >
        <span className={'font-0 react-switch-button'}>Switch</span>
      </label>
    </>
  )
}

export default Switch
