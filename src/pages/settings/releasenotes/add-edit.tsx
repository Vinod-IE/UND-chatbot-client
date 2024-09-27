import React, { useContext, useEffect, useState } from 'react'
import Buttons from '../../../components/buttons/buttons'
import InputText from '../../../utils/controls/input-text'
import RichtextV1 from '../../../utils/controls/richtextV1'
import { addtoPIIAuditTrail, loadPII, shouldAddToPIIAuditTrail, validatePII } from '../../pii/commonFunctions/piiFunctions'
import { areContentsEqual, encodeHTML, pnpAdd, pnpUpdate, removehtmltags } from '../../../Global'
import { ListNames, NO_CHANGE_MSG, VALIDATE_PII_CONTENT } from '../../../configuration'
import { sp } from '@pnp/sp'
import { getAllSettings } from '../../../store/settings/reducer'
import { AppDispatch } from '../../../store'
import { useDispatch } from 'react-redux'
import PageOverlay from '../../../pageoverLay/pageoverLay'
import CustomSelect from '../../../utils/controls/custom-select'
import RenderPIIPopup from '../../pii/piiPopup/PiiPopup'
import Alert from '../../../components/alert/alert'
import { PopupCloseContext } from '../../../shared/contexts/popupclose-context'

const AddeditView = (props: any) => {
  const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [releaseNoteValidations, setReleaseNoteValidations] = useState({
    VersionName: false,
  })
  const [inputValues, setInputValues] = useState({
    VersionName: props?.details?.['Version and Date'] ? props?.details?.['Version and Date'] : '',
    NewFeatures: props?.details?.NewFeatures ? props?.details?.NewFeatures : '',
    ResolvedIssues: props?.details?.ResolvedIssues ? props?.details?.ResolvedIssues : '',
    KnownIssues: props?.details?.KnownIssues ? props?.details?.KnownIssues : '',
    Archived: props?.details?.['Is Archived'] ? 'Yes' : 'No',
  })
  const [displayPII, setDisplayPII] = useState(false)
  const [piiScan, setPIIScan] = useState<any>({})
  useEffect(() => {
    if (props?.showAddPopup || props?.showedit) {
      setMultiplePopup()
    }
  }, [])
  useEffect(() => {
    loadPII()
  }, [])
  useEffect(() => {
    setDisplayPII(false)
    if (Object.keys(piiScan).length > 0) {
      Object.keys(piiScan).forEach((key) => {
        if (key === 'FileArray') {
          for (const file of piiScan[key].value) {
            if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
              setDisplayPII(true)
            }
          }
        } else {
          if (
            piiScan[key].resultsArray.length > 0 &&
            !piiScan[key].userAnswer
          ) {
            setDisplayPII(true)
          }
        }
      })
    }
  }, [piiScan])
  function changeVersion(e: { target: { value: any } }) {
    setInputValues({ ...inputValues, VersionName: e.target.value })
  }
  function handleRichTextChangeNewFeatures(e: any) {
    setInputValues({ ...inputValues, NewFeatures: e })
  }
  function handleRichTextChangeResolvedIssues(e: any) {
    setInputValues({ ...inputValues, ResolvedIssues: e })
  }
  function handleRichTextChangeKnownIssues(e: any) {
    setInputValues({ ...inputValues, KnownIssues: e })
  }
  function changeArchived(e: any) {
    setInputValues({ ...inputValues, Archived: e })
  }
  const onClickAlert = () => {
    setShowAlert(false)
  }
  const releaseNotesSubmit = async (value: any) => {
    const saveButton = document.getElementById('releaseNoteSave')
    let isValid = true
    let isNoChangesDetected = true
    let checkVersion = true
    setReleaseNoteValidations({ ...releaseNoteValidations, VersionName: false })
    if (value !== 'submit') {
      const archived = props?.details?.['Is Archived'] ? 'Yes' : 'No'
      if (props?.details?.['Version and Date']?.trim() === inputValues?.VersionName?.trim() && areContentsEqual(props?.details?.NewFeatures, inputValues?.NewFeatures) && areContentsEqual(props?.details?.ResolvedIssues, inputValues?.ResolvedIssues) && areContentsEqual(props?.details?.KnownIssues, inputValues?.KnownIssues) && archived === inputValues?.Archived) {
        isValid = false
        isNoChangesDetected = false
      }
    }
    if (isValid) {
      if (!inputValues?.VersionName || !inputValues?.VersionName?.trim()) {
        isValid = false
        checkVersion = false
      }
    }
    if (!isNoChangesDetected) {
      setShowAlert(true)
    }
    setReleaseNoteValidations({ ...releaseNoteValidations, VersionName: !checkVersion })
    let canSubmit = true
    if (isValid && VALIDATE_PII_CONTENT) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = true
      }
      const itemPII: any = {}
      itemPII.VersionName = inputValues?.VersionName
      itemPII.NewFeatures = removehtmltags(inputValues?.NewFeatures)
      itemPII.ResolvedIssues = removehtmltags(inputValues?.ResolvedIssues)
      itemPII.KnownIssues = removehtmltags(inputValues?.KnownIssues)
      const piiScanResult: any = await validatePII(itemPII, piiScan)
      setPIIScan({ ...piiScanResult })
      if (Object.keys(piiScanResult).length > 0) {
        Object.keys(piiScanResult).forEach((key) => {
          if (key === 'FileArray') {
            for (const file of piiScanResult[key].value) {
              if (file?.resultsArray?.length > 0 && !file?.userAnswer) {
                setDisplayPII(true)
                canSubmit = false
              }
            }
          } else {
            if (
              piiScanResult[key].resultsArray.length > 0 &&
              !piiScanResult[key].userAnswer
            ) {
              setDisplayPII(true)
              canSubmit = false
            }
          }
        })
      }
    }
    if (!canSubmit) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = false
      }
    }
    if (isValid && canSubmit) {
      if (saveButton && saveButton instanceof HTMLButtonElement) {
        saveButton.disabled = true
      }
      setLoading(true)
      const ObjectArray: any = {
        VersionName: inputValues?.VersionName,
        NewFeatures: encodeHTML(inputValues?.NewFeatures),
        ResolvedIssues: encodeHTML(inputValues?.ResolvedIssues),
        KnownIssues: encodeHTML(inputValues?.KnownIssues),
        ItemModifiedById: _spPageContextInfo.userId,
        ItemModified: new Date()
      }
      if (value !== 'submit') {
        let archived = false
        if (inputValues.Archived === 'Yes') {
          archived = true
        }
        ObjectArray.IsArchived = archived
        ObjectArray.ID = value.Id
        pnpUpdate(ListNames?.RELEASE_NOTES, ObjectArray).then(async (data: any) => {
          const item = sp.web.lists.getByTitle(ListNames?.RELEASE_NOTES).items.getById(value.Id)
          const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
          if (await shouldAddPIIAuditTrail) {
            await addtoPIIAuditTrail('Release Notes', '', piiScan, '')
          }
          await dispatch(getAllSettings({ name: '' }))
          props?.cancel()
          setLoading(false)
        })
      } else {
        ObjectArray.ItemCreated = new Date()
        ObjectArray.ItemCreatedById = _spPageContextInfo.userId
        pnpAdd(ListNames?.RELEASE_NOTES, ObjectArray).then(async (data: any) => {
          const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
          if (await shouldAddPIIAuditTrail) {
            await addtoPIIAuditTrail('Release Notes', '', piiScan, '')
          }
          await dispatch(getAllSettings({ name: '' }))
          props?.filtersvalue(!props?.showAddPopup)
          setLoading(false)
        })
      }
    }
  }
  const SELECT_VALUE = ['Yes', 'No']
  return (
    <div className={props?.showAddPopup ? 'mx-2 border-radius whitebg border-primary p-2' : 'settingseditpopup w-100 position-relative border-top1 p-2'}>
      {props?.showAddPopup && <div className="py-2 border-bottom1 ">
        <h4 tabIndex={0} aria-label="ADD RELEASE NOTES" className="m-0 p-0 d-inline-block font-15 segoeui-semibold color-primary text-uppercase">
          ADD RELEASE NOTES
        </h4>
      </div>}
      <div className="row" ref={props?.popupBodyRef}>
        <div className="col-sm-12 col-lg-12 mb-2">
          <InputText
            inputProps={{
              id: 'VersionDate',
              name: ' Version and Date',
              placeholder: 'Enter Version and Date',
              className: 'lato-medium font-13 title-color mb-2',
              maxLength: 255
            }}
            label=" Version and Date "
            isMandatory
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            info="Version and Date "
            infoIcon="icon-info"
            isInfo
            formClassName="d-flex flex-column"
            onChange={changeVersion}
            error={releaseNoteValidations.VersionName}
            value={inputValues?.VersionName}
          />
        </div>
        <div className="col-sm-12 col-lg-12 mb-2">
          <RichtextV1
            inputProps={{
              id: 'New Features ',
              name: ' New Features',
              className: 'lato-medium font-13 title-color mb-2',
            }}
            label="New Features"
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            info="New Features"
            infoIcon="icon-info"
            isInfo
            formClassName="d-flex flex-column"
            placeholder='Enter New Features'
            onChange={handleRichTextChangeNewFeatures}
            value={inputValues?.NewFeatures}
          />
        </div>
        <div className="col-sm-12 col-lg-12 mb-2">
          <RichtextV1
            inputProps={{
              id: 'Resolved Issues ',
              name: ' Resolved Issues',
              className: 'lato-medium font-13 title-color mb-2',
            }}
            label="Resolved Issues"
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            info="Resolved Issues"
            infoIcon="icon-info"
            isInfo
            formClassName="d-flex flex-column"
            placeholder='Enter Resolved Issues'
            onChange={handleRichTextChangeResolvedIssues}
            value={inputValues?.ResolvedIssues}
          />
        </div>
        <div className="col-sm-12 col-lg-12 mb-2">
          <RichtextV1
            inputProps={{
              id: 'Known Issues',
              name: 'Known Issues',
              className: 'lato-medium font-13 title-color mb-2',
            }}
            label="Known Issues"
            infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
            info="Known Issues"
            infoIcon="icon-info"
            isInfo
            formClassName="d-flex flex-column"
            placeholder='Enter Known Issues'
            onChange={handleRichTextChangeKnownIssues}
            value={inputValues?.KnownIssues}
          />
        </div>
        {!props?.showAddPopup &&
          <div className="col-sm-12 col-lg-4 mb-2">
            <CustomSelect
              inputProps={{ id: 'IsArchived' }}
              value={[inputValues?.Archived]}
              label="Is Archived "
              formClassName="form-vertical text-nowrap segoeui-regular"
              className='form-lg w-100 customselect'
              isInfo infoClassName="tool-tip tooltip-top" info='IsArchived ' infoIcon="icon-info"
              isMandatory
              options={SELECT_VALUE}
              onChange={(e: any) => { changeArchived(e.value) }}
              menuPosition="fixed"
            />
          </div>
        }
        {displayPII && (
          <div className='pt-2'>
            <div className="pii-compliance-validation p-10">
              {displayPII && <RenderPIIPopup piiScan={piiScan} setPIIScan={setPIIScan} />}
            </div>
          </div>
        )}

      </div>
      <div className="d-flex py-1 flex-wrap">
        <div className="ms-auto settingsbtns d-flex">
          {props?.showAddPopup &&
            <>
              <Buttons
                id="releaseNoteSave"
                label="Save"
                className="border-radius py-1 px-2 btn-bgcolor9  ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                icon="icon-save font-11 pe-1"
                type="button"
                onClick={() => { releaseNotesSubmit('submit')}}
              />
              <Buttons
                label="Cancel"
                className="py-1 px-2 border-radius btn-border1 ms-2 montserratbold font-12 text-uppercase btn-xs"
                icon="icon-close color-primary font-9 pe-1"
                type="button"
                onClick={() => {
                  props?.filtersvalue(!props?.showAddPopup)
                }}

              /> </>}
          {!props?.showAddPopup &&
            <>
              <Buttons
                label="Update"
                className="border-radius py-1 px-2 btn-primary ms-2 whitetext montserratbold font-12 text-uppercase btn-xs"
                icon="icon-update font-11 pe-1"
                type="button"
                onClick={() => { releaseNotesSubmit(props?.details) }}
              />
              <Buttons
                label="Cancel"
                className="py-1 px-2 border-radius btn-border1  ms-2 montserratbold font-12 text-uppercase btn-xs"
                icon="icon-close color-primary font-9 pe-1"
                type="button"
                onClick={() => {
                  props?.cancel()
                }}
              /></>}
          {showAlert && (
            <Alert message={NO_CHANGE_MSG} yes='OK' cancel='Cancel' className="alert-info"
              onClick={onClickAlert}
              btn1iconclassNmae='icon-checked  font-11 pe-1'
              btn2iconclassNmae='icon-close  font-11 pe-1'
              btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
              btn2classNmae="btn-border1 btn-border-radius3 px-2  title-color5 segoeui-regular font-12 text-uppercase btn-xs"
            />
          )}
          {loading && <PageOverlay />}
        </div>
      </div>
    </div>
  )
}

export default AddeditView