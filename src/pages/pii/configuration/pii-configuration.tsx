import React, { useContext, useEffect, useState } from 'react'
import EditableText from './editabletext'
import Buttons from '../../../components/buttons/buttons'
import { getList } from '../../../api/helpers'
import { ListNames } from '../../../configuration'
import InputText from '../../../utils/controls/input-text'
import InputTextarea from '../../../utils/controls/input-textarea'
import { getCurrentUTCDate } from './formatcontent'
import { pnpAdd, pnpUpdate } from '../../../Global'
import CustomSelect from '../../../utils/controls/custom-select'
import { PopupCloseContext } from '../../../shared/contexts/popupclose-context'

const PiiConfiguration: React.FC = () => {
  const [userDefinedCat, setUserDefinedCat] = useState([])
  const [preDefinedCat, setPreDefinedCat] = useState<any>([])
  const [piiFormates, setPIIFormates] = useState([])
  const [catName, setCatName] = useState('')
  const [severity, setSeverity] = useState('Low')
  const [catContext, setCatContext] = useState('')
  const [enableNewCat, setEnableNewCat] = useState('false')
  const [catNewError, setCatNewError] = useState(false)
  const [severityNewError, setSeverityNewError] = useState(false)
  const [showDiv, setShowDiv] = useState(false)
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)

  useEffect(() => {
   
    if(showDiv){
      setMultiplePopup()
    }
     
  }, [showDiv])
   useEffect(() => {
    getCategoryTypeData()
    getPIIFormates()
  }, [])
  const getCategoryTypeData = async () => {
    const list = await getList(ListNames.PIICATEGORY)
      .then(result => {
        if (result instanceof Error) {
          console.error(result.message) // Log the error message
        } else {
          return result
        }
      })
      .catch(error => {
        console.error('An error occurred:', error)
        return error
      })
    const data = await list?.items
      .getAll()
    separateUserPredefinedCategories(data)
  }
  const getPIIFormates = async () => {
    const list = await getList(ListNames.PII_FORMATS)
      .then(result => {
        if (result instanceof Error) {
          console.error(result.message) // Log the error message
        } else {
          return result
        }
      })
      .catch(error => {
        console.error('An error occurred:', error)
        return error
      })
    const data = await list?.items
      .getAll()
    setPIIFormates(data)
  }
  function separateUserPredefinedCategories (categories : any) {
    const preDefinedCategory: any = []
    const userDefinedCategory: any = []
    categories.forEach((i: { ParamMode: string }) => {
      if (i?.ParamMode === 'P') { preDefinedCategory.push(i) } else { userDefinedCategory.push(i) }
    })
    setPreDefinedCat(preDefinedCategory)
    setUserDefinedCat(userDefinedCategory)
  }
  const addNewCat = async () => {
    if (catName?.trim() !== '' && severity !== '') {
      setCatNewError(false)
      setSeverityNewError(false)
      const ObjectArray : any = {
        // CID: '0',
        Title: '',
        CategoryParamName: catName,
        CategoryContext: catContext,
        ParamMode: 'U',
        Severity: severity,
        ParamAllowedDataTypes: '1,2,3,9',
        IsEnable: enableNewCat,
        ItemModifiedById: _spPageContextInfo.userId,
        ItemModified: getCurrentUTCDate(),
        ItemCreated: getCurrentUTCDate(),
        ItemCreatedById: _spPageContextInfo.userId
      }
      pnpAdd(ListNames?.PIICATEGORY, ObjectArray).then(async (data: any) => {
        const CID = data?.data?.ID
        const updateCID : any = {
          CID: CID,
          ID: CID
        }
        pnpUpdate(ListNames?.PIICATEGORY, updateCID).then(async (data: any) => {
          setShowDiv(false)
          getCategoryTypeData()
        })
      })
    } else {
      if (catName?.trim() === '') { setCatNewError(true) } else { setCatNewError(false) }
      if (severity === '') { setSeverityNewError(true) } else { setSeverityNewError(false) }
    }
  }
  const SELECT_VALUE = ['Low', 'Medium', 'High']
  return (
    <div className="container">
        <div className="mt-2">
        <h3 tabIndex={0} aria-label='Pre - Defined Categories' className='mb-2'>Pre - Defined Categories</h3>
        <div className='whitebg bordered2 border-radius overflow-hidden predefinedcat'>
        <EditableText Items={preDefinedCat} formats={piiFormates} getData={getPIIFormates} getCategories={getCategoryTypeData} isPredefinedCategories={true}/>
        </div>
        <div className='d-flex pt-3 pb-2 align-items-center'>
          <h3 tabIndex={0} aria-label='User - Defined Categories'>User - Defined Categories</h3>
          <Buttons
            label="New Category"
            aria-label="New Category"
            icon="icon-add me-1 font-11"
            onClick={() => setShowDiv(!showDiv)}
            className='btn-xs font-14 text-white btn-primary uppercase text-nowrap border-radius3 ms-auto'
          />
        </div>
        {showDiv &&
            <div className='card shadow5 mb-2'>
              <div className="d-flex p-2 justify-content-between border-bottom2 align-items-center">
                <h3 tabIndex={0} aria-label='Add New Category'>Add New Category</h3>
                <div className='ms-auto d-flex gap-1'>
                  <Buttons
                    label="Save"
                    aria-label="Save"
                    icon="icon-checked font-11 me-1"
                    className='btn-xs font-14 btn-border text-white bgcolor-primary text-nowrap border-radius text-uppercase'
                    onClick={() => addNewCat()} />

                  <Buttons
                    label="Cancel"
                    aria-label="Cancel "
                    icon="icon-close font-11 me-1 "
                    className='btn-xs font-14 btn-border2 bgcolor-5 darktext text-nowrap border-radius text-uppercase'
                    onClick={() => {
                      setCatNewError(false)
                      setSeverityNewError(false)
                      setShowDiv(!showDiv)
                    }} />
                </div>
              </div>

              <div className="d-flex flex-column pt-0 card-body">
                <div className='row'>
                  <div className='col-sm-12 col-md-5'>
                    <InputText
                      inputProps={{
                        id: 'category',
                        name: 'Category',
                        className: 'font-12',
                        placeholder: 'Category',
                        maxLength: 256
                      }}
                      label='Category'
                      className='form-sm'
                      isMandatory
                      formClassName="form-vertical w-100"
                      value={catName}
                      error={catNewError}
                      onChange={(e: any) => setCatName(e.target.value)}
                    />
                     <CustomSelect
                    id='Severity'
                    value={[severity]}
                    label="Severity"
                    formClassName="form-vertical text-nowrap segoeui-regular"
                    className='form-sm w-100 customselect'
                    isMandatory
                    options={SELECT_VALUE}
                    onChange={(e: any) => { setSeverity(e.value) }}
                  />
                  </div>
                  <div className='col-sm-12 col-md-7'>
                  <InputTextarea
                            inputProps={{
                              id: 'context',
                              name: 'Context',
                              className: 'font-12',
                              placeholder: 'Enter Context'
                            }}
                            label='Context'
                            formClassName="ms-auto form-vertical"
                            className="h-auto"
                            rows="3"
                            value={catContext}
                            onChange={(e: any) => setCatContext(e.target.value)}
                        />
                  </div>
                </div>
              </div>
            </div>
          }
          <div className='piiaccordiongroup whitebg bordered2 border-radius overflow-hidden userdefinedcat'>
        <EditableText Items={userDefinedCat} formats={piiFormates} getData={getPIIFormates} getCategories={getCategoryTypeData} isPredefinedCategories={false}/>
      </div>
    </div>
    </div>
  )
}

export default PiiConfiguration
