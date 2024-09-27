
import React, { useContext, useEffect, useState } from 'react'
import Buttons from '../../../components/buttons/buttons'
import Switch from '../../../utils/controls/input-switch'
import { ConfigurationFormat } from './formatcontent'
import { pnpUpdate } from '../../../Global'
import CustomSelect from '../../../utils/controls/custom-select'
import { ListNames } from '../../../configuration'
import { PopupCloseContext } from '../../../shared/contexts/popupclose-context'

interface EditableTextParameters {
    id: number;
    text?: string;
    text1?: string;
    useState?: any;
    DataObj?: any;
    Enable?: any
    mainId?: any
    ParamMode?:any
}
const EditableText = (props: any) => {
  const SELECT_VALUE = ['Low', 'Medium', 'High']
  const [clicked, setClicked] = useState<any>('')
  const [editCategoryName, setEditCategoryName] = useState<any>('')
  const [editCategorySeverity, setEditCategorySeverity] = useState<any>('')
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [catError, setCatError] = useState(false)
  const toggle = (index : number, value : any) => {
    if (clicked === index && value === 'expanded') {
      return setClicked(null)
    } else if (value !== 'expanded') {
      return setClicked(index)
    }
    // return setClicked(index)
  }
  const [texts, setTexts] = useState<EditableTextParameters[]>([])
  useEffect(() =>{
    if(clicked)
      setMultiplePopup()
  },[clicked])
  useEffect(() => {
    const objectPreparation : any = []
    if (props?.Items) {
      props?.Items.forEach((element : any, index : any) => {
        objectPreparation.push({
          id: element?.CID, text: element?.CategoryParamName, text1: element?.Severity, Enable: element?.IsEnable, mainId: element?.ID, ParamMode: element?.ParamMode
        })
      })
    }
    setTexts(objectPreparation)
  }, [props?.Items])
  const [editingId, setEditingId] = useState<number | null>(null)
  const handleEdit = (id: number) => {
    setEditingId(id)
    setMultiplePopup()
    
  }
  const handleSave = (value: any, eKey: any, IsEnableUpdate: any, mainId: any) => {
    const ObjectArray : any = {}
    if (IsEnableUpdate) {
      ObjectArray.ID = mainId
      ObjectArray.IsEnable = String(value)
      ObjectArray.ItemModifiedById = _spPageContextInfo.userId
      ObjectArray.ItemModified = new Date()
      pnpUpdate(ListNames?.PIICATEGORY, ObjectArray).then(async (data: any) => {
        props?.getCategories()
        props?.getData()
        setEditingId(null)
      })
    } else if (editCategoryName?.trim() !== '') {
      ObjectArray.ID = mainId
      ObjectArray.CategoryParamName = editCategoryName
      ObjectArray.Severity = editCategorySeverity
      ObjectArray.ItemModified = new Date()
      ObjectArray.ItemModifiedById = _spPageContextInfo.userId
      pnpUpdate(ListNames?.PIICATEGORY, ObjectArray).then(async (data: any) => {
        props?.getCategories()
        props?.getData()
        setEditingId(null)
      })
    } else {
      setCatError(true)
    }
  }
  const handleCancel = () => {
    setEditingId(null)
  }
  return (
        <>
            {texts.map((text, index) => (
                <div className='piiaccordionlist' key={text.id}>
                    {editingId === text.id
                      ? (
                            <div className='d-flex align-items-center px-2  py-1 piiaccordionlistheader'>
                            <div className={clicked === text.id ? 'icon-arrow-down rotate180 font-14' : 'icon-arrow-down font-14 '} onKeyDown={(text) => {text.key ==='Enter' &&  toggle}}></div>
                                <div className='d-flex form-xs'>
                                    <input
                                        type="text"
                                        value={editCategoryName}
                                         onChange={(e) => setEditCategoryName(e.target.value)}
                                    />
                                    <div className='dividerdashed vertical mx-2'></div>
                                    {/* <input
                                        type="text1"
                                        value={editCategorySeverity}
                                        onChange={(e) => setEditCategorySeverity(e.target.value)}
                                    /> */}
                        <CustomSelect
                          id='Severity'
                          value={[editCategorySeverity]}
                          formClassName="form-vertical text-nowrap segoeui-regular"
                          className='form-sm w-100 customselect'
                          isMandatory
                          options={SELECT_VALUE}
                          onChange={(e: any) => { setEditCategorySeverity(e.value) }}
                          menuPosition="fixed"
                        />
                                </div>
                                <div className='ms-auto d-flex gap-1'>
                                    <Buttons
                                    onClick={() => {
                                      handleSave('', text.id, false, text.mainId)
                                    }}
                                        label="Save"
                                        aria-label="Save"
                                        icon="icon-checked font11"
                      className='btn-xs font-0 btn-border text-white  bgcolor-primary border-radius text-uppercase'  />

                                    <Buttons onClick={handleCancel}
                                        label="Cancel"
                                        aria-label="Cancel"
                                        icon="icon-close font11  "
                      className='btn-xs font-0 btn-border2 bgcolor-5 darktext  border-radius text-uppercase' />
                                </div>
                                </div>
                        )
                      : (
                            <>
                            <div className={clicked === text.id ? 'd-flex px-2 py-1 piiaccordionlistheader active' : 'd-flex piiaccordionlistheader px-2 py-1'}>
                            <div tabIndex={0} className='d-flex w-100 align-items-center' onClick={() => toggle(text.id, clicked === text.id ? 'expanded' : 'collapsed')}>
                               <div className={clicked === text.id ? 'icon-arrow-down font-14 me-2  rotate180' : 'icon-arrow-down font-14 me-2'} tabIndex={0} onKeyDown={(text) => {text.key ==='Enter' &&  toggle}}></div>
                                <div tabIndex={0} aria-label={text.text} className='text-uppercase'>{text.text}</div>
                                <div className='dividerdashed vertical mx-2'></div>
                                <div tabIndex={0} aria-label={text.text1} className={`severity ${text?.text1}`}>Severity: {text.text1}</div>
                               </div>
                               {!props?.isPredefinedCategories &&
                                <Buttons onClick={() => {
                                  handleEdit(text.id)
                                  setCatError(false)
                                  setEditCategoryName(text.text)
                                  setEditCategorySeverity(text.text1)
                                }}
                                    label="Edit"
                                    aria-label="Edit"
                                    icon="icon-pencil font-11"
                      className='btn-xs font-0 color-primary editbtn ms-auto me-2' />
                                  }
                                    <input tabIndex={0} type='checkbox' key = {text.id} className="react-switch-checkbox" id={props.id} name={props.id}/>
                                    <Switch key = {text.id} id={text.id} Enable = {text.Enable} getCategories= {props} onChange = {handleSave} mainId = {text.mainId}/>

                            </div>
                                {clicked === text.id
                                  ? <div className={clicked === text.id ? 'configurationlists border-top2 border-bottom2 pb-2 active' : 'configurationlists pb-2'}>
                                    <ConfigurationFormat Item={clicked} ParamMode={text.ParamMode} formats={props?.formats} getData={props}/>
                                </div>
                                  : ''}
                            </>
                        )}
                </div>
            ))}

        </>
  )
}

export default EditableText
