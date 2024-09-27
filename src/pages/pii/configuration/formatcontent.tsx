/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useContext, useEffect, useState } from 'react'
import '../../../components/table/table.css'
import InputCheck from '../../../utils/controls/input-checkbox'
import Buttons from '../../../components/buttons/buttons'
import InputText from '../../../utils/controls/input-text'
import { ListNames } from '../../../configuration'
import { pnpAdd, pnpUpdate } from '../../../Global'
import { PopupCloseContext } from '../../../shared/contexts/popupclose-context'
interface FormatText {
    id: number;
    text?: string;
    text1?: string;
    text2?: string;
    useState?: any;
    mainId?: any
    ID?:any
    IsEnable?:any
    width?:any
}
interface Props {
    Item?:any
    formats?:any
    getData?: any
    ParamMode?:any
  }
export function getCurrentUTCDate () {
  return new Date().toISOString()
}
export const ConfigurationFormat = (Props: Props) => {
  const [showDiv, setShowDiv] = useState(false)
  const [texts, setTexts] = useState<FormatText[]>([])
  const [isEnableFormat, setIsEnableFormat] = useState(true)
  const [formatName, setFormatName] = useState('')
  const [formatExample, setFormatExample] = useState('')
  const [formatRegex, setFormatRegex] = useState('')
  const [showInvalidErr, setShowInvalidErr] = useState(false)
  const [showLoaderadd, setShowLoaderadd] = useState(false)
  const [showErrorFormat, setShowErrorFormat] = useState(false)
  const [showErrorRegex, setShowErrorRegex] = useState(false)
  const [catError, setCatError] = useState(false)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)

  useEffect(() => {
    const objectPreparation : any = []
    if (Props?.formats) {
      Props?.formats.forEach((element : any, index : any) => {
        if (element?.PID === Props?.Item) {
          objectPreparation.push({
            id: element?.PID, text: element?.Format, text1: element?.FormatExample, text2: element?.FormatRegExp, mainId: element?.ID, ID: element?.ID, IsEnable: element?.IsEnable
          })
        }
      })
    }
    setTexts(objectPreparation)
  }, [Props])
  const [editingId, setEditingId] = useState<number | null>(null)
  const handleTextChange = (id: number, value: string, newText: string) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.mainId === id ? { ...text, [value]: newText } : text))
    )
  }
  const handleEdit = (id: number) => {
    setEditingId(id)
    setMultiplePopup()
  }
  useEffect(() => {
    if(showDiv){
      setMultiplePopup()
    }
  }, [showDiv])
  const updateFormat = async (value: any, eKey: any, mainId: any, IsEnableUpdate: any) => {
    const updatedArray : any = []
    texts.forEach((item: any) => {
      if (item.mainId === mainId) {
        updatedArray.push(item)
      }
    })
    const ObjectArray : any = {}
    setShowInvalidErr(false)
    let validRegex = true
    try {
      new RegExp('(' + updatedArray[0]?.text2 + ')')
    } catch (e) {
      validRegex = false
    }
    if (validRegex && updatedArray[0]?.text?.trim() !== '' && updatedArray[0]?.text2?.trim() !== '') {
      if (IsEnableUpdate) {
        ObjectArray.ID = mainId
        ObjectArray.IsEnable = value
        ObjectArray.ItemModified = getCurrentUTCDate()
        ObjectArray.ItemModifiedById = _spPageContextInfo.userId
       await pnpUpdate(ListNames?.PII_FORMATS, ObjectArray).then(async (data: any) => {
          await Props?.getData?.getData()
        })
      } else {
        ObjectArray.ID = mainId
        ObjectArray.Format = updatedArray[0]?.text
        ObjectArray.FormatExample = updatedArray[0]?.text1
        ObjectArray.FormatRegExp = updatedArray[0]?.text2
        ObjectArray.ItemModified = getCurrentUTCDate()
        ObjectArray.ItemModifiedById = _spPageContextInfo.userId
        await pnpUpdate(ListNames?.PII_FORMATS, ObjectArray).then(async (data: any) => {
          await Props?.getData?.getData()
          setEditingId(null)
        })
      }
    } else {
      if (!validRegex) {
        setShowInvalidErr(true)
      }
      if (formatName?.trim() === '') {
        setShowErrorFormat(true)
      } else { setShowErrorFormat(false) }
      if (formatRegex?.trim() === '') {
        setShowErrorRegex(true)
      } else { setShowErrorRegex(false) }
    }
  }
  const handleCancel = () => {
    setEditingId(null)
  }
  const AddNewFormate = async (id: number) => {
    setShowInvalidErr(false)
    let validRegex = true
    try {
      new RegExp('(' + formatRegex + ')')
    } catch (e) {
      validRegex = false
    }
    if (formatName?.trim() !== '' && formatRegex?.trim() !== '' && validRegex) {
      setShowLoaderadd(true)
      const ObjectArray : any = {
        Format: formatName,
        FormatExample: formatExample,
        FormatRegExp: formatRegex,
        PID: id,
        IsEnable: isEnableFormat,
        ItemModifiedById: _spPageContextInfo.userId,
        ItemModified: getCurrentUTCDate(),
        ItemCreated: getCurrentUTCDate(),
        ItemCreatedById: _spPageContextInfo.userId
      }
      pnpAdd(ListNames?.PII_FORMATS, ObjectArray).then(async (data: any) => {
        setShowDiv(false)
        Props?.getData?.getData()
      })
    } else {
      if (!validRegex) {
        setShowInvalidErr(true)
      }
      if (formatName?.trim() === '') {
        setShowErrorFormat(true)
      } else { setShowErrorFormat(false) }
      if (formatRegex?.trim() === '') {
        setShowErrorRegex(true)
      } else { setShowErrorRegex(false) }
    }
  }
  return (
        <div className='w-100 overflow-auto'>
            <table className="table-borderless w-100 sticky-top first-column last-column" >
                <thead>
                    <tr>
                        <th style={{ width: 40 }} className='py-1 font-0'>id</th>
                        <th className='py-1' tabIndex={0} aria-label="Format">Format</th>
                        <th className='py-1' tabIndex={0} aria-label="Example">Example</th>
                        <th className='py-1' tabIndex={0} aria-label="Regular Expression">Regular Expression</th>
                        <th className='py-1' tabIndex={0}>
                            <Buttons
                                label="New Format"
                                aria-label="New Format"
                                icon="icon-add me-1 font-11"
                                className='btn-xs font-14 text-white btn-primary uppercase text-nowrap border-radius3 ms-auto'
                                onClick={() => {
                                  setShowDiv(!showDiv)
                                  setFormatName('')
                                  setFormatExample('')
                                  setFormatRegex('')
                                  setShowErrorFormat(false)
                                  setShowErrorRegex(false)
                                }}
                            /></th>
                    </tr>
                </thead>
                <tbody>
                {showDiv &&
                <tr>
                        <th className='v-align-top'>
                            <InputCheck
                                inputProps={{
                                  id: 'inputcheck',
                                  name: 'Input Check',
                                  type: 'checkbox',
                                  label: 'chek'
                                }}
                                checked={isEnableFormat}
                                onChange={() => setIsEnableFormat(!isEnableFormat)}
                                formClassName='form-horizontal font-0 flex-wrap mt-2'
                            />
                        </th>
                        <th className='v-align-top'>
                            <div className='d-flex'>
                            <InputText
                                inputProps={{
                                  id: 'newformat',
                                  name: 'newformat',
                                  className: 'font-12',
                                  placeholder: 'Enter Format',
                                  maxLength: 256
                                }}
                                aria-label='Format'
                                className='form-sm'
                                isMandatory
                                formClassName="form-horizontal w-100 flex-wrap"
                                value={formatName}
                                error ={showErrorFormat}
                                onChange={(e: any) => setFormatName(e.target.value)}
                            />
                            <span className='mandatory ms-1'>*</span>
                            </div>
                        </th>
                        <td className='v-align-top'>
                            <InputText
                                inputProps={{
                                  id: 'newformat',
                                  name: 'newformat',
                                  className: 'font-12',
                                  placeholder: 'Enter Example',
                                  maxLength: 256
                                }}
                                aria-label='Example'
                                className='form-sm'
                                isMandatory
                                formClassName="form-horizontal flex-wrap"
                                value={formatExample}
                                onChange={(e: any) => setFormatExample(e.target.value)}
                            />
                        </td>
                        <td className='v-align-top'><div className='d-flex'>
                            <InputText
                            inputProps={{
                              id: 'newregularexpression',
                              name: 'newregularexpression',
                              className: 'font-12',
                              placeholder: 'Enter Regular Expression',
                              maxLength: 256
                            }}
                            aria-label='Regular Expression'
                            className='form-sm'
                            isMandatory
                            formClassName="form-horizontal w-100 flex-wrap"
                            value={formatRegex}
                            error ={showErrorRegex}
                            onChange={(e: any) => setFormatRegex(e.target.value)}
                        /> <span className='mandatory ms-1'>*</span>
                        </div>
                        </td>
                        <th className='v-align-top'>
                        <div className='d-flex gap-1'>
                            <Buttons
                                label="Save"
                                aria-label="Save"
                                icon="icon-checked font-11"
                                className='btn-xs font-0 btn-border text-white bgcolor-primary text-uppercase border-radius ms-auto' onClick={() => AddNewFormate(Props?.Item)}/>

                            <Buttons
                                label="Cancel"
                                aria-label="Cancel"
                                icon="icon-close font-11 "
                                className='btn-xs font-0 btn-border2 bgcolor-5 darktext text-uppercase border-radius'
                                onClick={() => setShowDiv(false)} />
                                </div>
                        </th>
                    </tr>}
                    {texts.map((text, index) => (
                        <tr key={text.id}>
                            {editingId === text.mainId
                              ? (
                                    <>
                                        <th className='checkbox'>
                                            <InputCheck
                                                inputProps={{
                                                  id: text.id,
                                                  name: 'Input Check',
                                                  type: 'checkbox',
                                                  label: text.text
                                                }}
                                                formClassName='form-horizontal font-0'
                                                checked={text?.IsEnable === true ? 'checked' : ''}
                                                onChange={(e: any) => updateFormat(e.target.checked, text.ID, text?.mainId, true)}
                                            />
                                        </th>
                                        <th className="col-sm-3">
                                            <input className='form-xs'
                                                type="text"
                                                value={text.text}
                                                onChange={(e) => handleTextChange(text.mainId, 'text', e.target.value)}
                                            />
                                            {catError && <span className="pii-errormsg">
                                                            Please enter Category Name
                                                        </span>}
                                        </th>
                                        <td className="col-sm-3">
                                            <input className='form-xs'
                                                type="text1"
                                                value={text.text1}
                                                onChange={(e) => handleTextChange(text.mainId, 'text1', e.target.value)}
                                            />
                                        </td>
                                        <td className="col-sm">
                                            <input className='form-xs'
                                                type="text2"
                                                value={text.text2}
                                                onChange={(e) => handleTextChange(text.mainId, 'text2', e.target.value)}
                                            />
                                        </td>
                                        <th className="col-sm-2 col-md-3">
                                            <div className='d-flex gap-1'>
                                                <Buttons onClick={() => updateFormat('', text.id, text.mainId, false)}
                                                    label="Save"
                                                    aria-label="Save"
                                                    icon="icon-checked font-11"
                                                    className='btn-xs font-0 btn-border text-white bgcolor-primary text-uppercase border-radius ms-auto' />

                                                <Buttons onClick={handleCancel}
                                                    label="Cancel"
                                                    aria-label="Cancel"
                                                    icon="icon-close font-11 "
                                                    className='btn-xs font-0 btn-border2 bgcolor-5 darktext text-uppercase border-radius' />
                                            </div>
                                        </th>
                                    </>
                                )
                              : (
                                    <>
                                        <th className='checkbox'>
                                            <InputCheck
                                                inputProps={{
                                                  id: text.id,
                                                  name: 'Input Check',
                                                  type: 'checkbox',
                                                  label: text.id
                                                }}
                                                formClassName='form-horizontal font-0'
                                                checked={text?.IsEnable === true ? 'checked' : ''}
                                                onChange={(e: any) => updateFormat(e.target.checked, text.ID, text?.mainId, true)}
                                            />
                                        </th>
                                        <th tabIndex={0} aria-label={text.text} className="col-sm-3">
                                            {text.text}
                                        </th>
                                        <td tabIndex={0} aria-label={text.text1} className="col-sm-3">
                                            {text.text1}
                                        </td>
                                        <td tabIndex={0} aria-label={text.text2} className="col-sm">
                                            {text.text2}
                                        </td>
                                        <th className="col-sm-2 col-md-3">
                                            <div className={Props?.ParamMode === 'P' ? 'ms-auto d-flex gap-1 d-none' : 'ms-auto d-flex gap-1'}>
                                                <Buttons onClick={() => handleEdit(text.mainId)}
                                                    label="Edit"
                                                    aria-label="Edit"
                                                    icon="icon-pencil font-11"
                                                    className='btn-xs font-0 color-primary editbtn ms-auto me-2' />
                                            </div>
                                        </th>

                                    </>
                                )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
  )
}
