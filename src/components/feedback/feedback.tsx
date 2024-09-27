/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import InputText from '../../utils/controls/input-text'
import FileUpload from '../upload/upload-file'
import InputTextarea from '../../utils/controls/input-textarea'
import Buttons from '../buttons/buttons'
import { pnpAdd } from '../../Global'
import { ListNames } from '../../configuration'
import { sp } from '@pnp/sp'
// eslint-disable-next-line camelcase
import { I_SiteFeedbackAbout } from '../../shared/interfaces/Settings.interface'
import { addtoPIIAuditTrail, loadPII, shouldAddToPIIAuditTrail, validatePII } from '../../pages/pii/commonFunctions/piiFunctions'
import RenderPIIPopup from '../../pages/pii/piiPopup/PiiPopup'
import { getAllSettings } from '../../store/settings/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { useGetFeedbackAbout } from '../../store/settings/hooks'
import './feedback.css'
import CustomSelect from '../../utils/controls/custom-select'

export default function Feedback() {
  const [displayPII, setDisplayPII] = useState(false)
  const [piiScan, setPIIScan] = useState<any>({})
  const feedbackAboutData: Array<I_SiteFeedbackAbout> = useGetFeedbackAbout()
  const [subject, setSubject] = useState('')
  const [feedbackAbout, setFeedbackAbout] = useState('Select')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<any>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  // eslint-disable-next-line camelcase
  const [feedbackOptions, setFeedbackOptions] = useState<Array<I_SiteFeedbackAbout>>([])
  const [siteFeedbackValidations, setSiteFeedbackValidations] = useState({
    valid: true,
    subject: true,
    message: true,
    about: true
  })
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000) // 5000 milliseconds = 5 seconds
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage])
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
  useEffect(() => {
    const filteredData: any = feedbackAboutData?.filter((item) => !item.IsArchived)
    setFeedbackOptions(filteredData)
  }, [feedbackAboutData])
  const validateSiteFeedback = (subject: string, message: string, feedbackAbout: string) => {
    let valid = true
    let Subject = true
    let Message = true
    let FeedbackAbout = true

    if (!(subject?.trim())) {
      valid = false
      Subject = false
    }
    if (!(message?.trim())) {
      valid = false
      Message = false
    }
    if (!(feedbackAbout?.trim()) || feedbackAbout === 'Select') {
      valid = false
      FeedbackAbout = false
    }
    if (valid) {
      saveOrUpdateQL()
    }
    setSiteFeedbackValidations({
      ...siteFeedbackValidations,
      valid: valid,
      subject: Subject,
      message: Message,
      about: FeedbackAbout
    })
  }
  const saveOrUpdateQL = async () => {
    const submitButton = document.getElementById('submitButton')
    if (submitButton && submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true
    }
    const addObj = {
      Subject: subject,
      FeedBackAbout: feedbackAbout,
      Message: message,
      ItemModified: new Date(),
      ItemModifiedById: _spPageContextInfo.userId,
      ItemCreated: new Date(),
      ItemCreatedById: _spPageContextInfo.userId
    }
    const itemPII: any = {}
    itemPII.Subject = subject
    itemPII.Message = message
    itemPII.Files = Object.values(files)
    let canSubmit = true
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
    if (!canSubmit) {
      if (submitButton && submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false
      }
    }
    if (canSubmit) {
      if (submitButton && submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true
      }
      await pnpAdd(ListNames?.FEEDBACK, addObj).then(async (data: any) => {
        if (files.length > 0) {
          const item = sp.web.lists.getByTitle(ListNames?.FEEDBACK).items.getById(data.data.ID)
          const file = []
          for (const element of files) {
            file.push({
              name: element.name,
              content: element
            })
          }
          await item.attachmentFiles.addMultiple(file)
        }
        const shouldAddPIIAuditTrail = shouldAddToPIIAuditTrail(piiScan)
        if (await shouldAddPIIAuditTrail) {
          await addtoPIIAuditTrail('Site Feedback', '', piiScan, '')
        }
        setShowSuccessMessage(true)
        resetSiteFeedbackForm()
        await dispatch(getAllSettings({ name: '' }))
        if (submitButton && submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false
        }
      })
        .catch((error) => {
          console.error('Error adding item:', error)
        })
    }
  }

  const resetSiteFeedbackForm = () => {
    setSubject('')
    setMessage('')
    setFiles([])
    setFeedbackAbout('Select')
    setPIIScan({})
    setSiteFeedbackValidations({
      valid: true,
      subject: true,
      message: true,
      about: true
    })
  }

  const handleRef = (ref: HTMLParagraphElement | null) => {
    const messageRef = ref
    if (messageRef) {
      messageRef.focus()
    }
  }
  return (
    <>
      {showSuccessMessage &&
        <div
          className='buttonPopups border-color3 medium-popup sitefeedbackpopup'
          style={{ top: '10', position: 'absolute', zIndex: '9999', padding: '15px' }}
        >
          <div className='sucessfeedback' tabIndex={0} aria-label="Thank you for your time, your feedback has been recorded." ref={handleRef} >
            <span className="hintmsg w-100 pt-1 text-color1" > Thank you for your time, your feedback has been recorded.</span>
            <span className="icon-close text-color1" title="Close" tabIndex={0} aria-label="Close"
              onClick={() =>
                setShowSuccessMessage(false)}></span>
          </div>
        </div>
      }

      <div className='card card-body max-w-700 col-12 col-lg-8 col-xxl-5'>
        <h3>Site Feedback</h3>
        <div className="subtitle-color font-9 montserratregular">Please let us know how we can make this site more useful to you</div>
        <div className='feedback-body'>
          <div className="pt-2">
            <InputText
              inputProps={{
                id: 'subject',
                name: 'Subject',
                className: 'font-12',
                placeholder: 'Subject',
                maxLength: 255
              }}
              label='Subject'
              className='form-sm'
              isMandatory
              formClassName="ms-auto form-vertical"
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => setSubject(event.target.value)}
              error={!siteFeedbackValidations.subject}
              value={subject}
            />
          </div>
          <div className="pt-2">
            <CustomSelect
              id='feedbackabout '
              value={[feedbackAbout]}
              label="Feedback About"
              formClassName="form-vertical"
              className='form-sm'
              isMandatory
              options={Array.from(new Set(feedbackOptions?.map((v: any) => v.Title)))?.sort((a, b) => a.localeCompare(b))}
              onChange={(e: any) => { setFeedbackAbout(e.value) }}
              error={!siteFeedbackValidations.about}
              defaultSelect={true}
            />
          </div>
          <div className="pt-2">
            <FileUpload
              inputProps={{
                id: 'attachfiles',
                name: 'Description',
                className: ''
              }}
              label="Attach File(s)  "
              infoClassName="tool-tip tooltip-top font-12 sourcesanspro"
              info="Attach File(s) "
              infoIcon="icon-info"
              isInfo
              formClassName="d-flex flex-column"
              files={files}
              setFiles={setFiles}
              hintClassName='color-primary'
              noteClassName='color-primary'
              hint="Upload the files which are in the .png, .jpeg, .xlsx, .txt .docx, .pdf files and special characters will not be used in the document names. Maximum size for file is 25 MB. Limit is up to 10 files per screen"
              note='Screenshots need to be saved locally before uploading into system.'
            />
          </div>
          <div className="pt-2">
            <InputTextarea
              inputProps={{
                id: 'message',
                name: 'Message',
                className: '',
                placeholder: 'Message',
                value: message
              }}
              label='Message'
              rows="5"
              isMandatory
              formClassName="ms-auto form-vertical"
              className="h-auto"
              onChange={(event: { target: { value: React.SetStateAction<string> } }) => setMessage(event.target.value)}
              error={!siteFeedbackValidations.message}
            />
            <p>Click "Submit" to send us your feedback </p>
          </div>
          {displayPII && (

            <div className='pt-2'>
              <div className="pii-compliance-validation p-10">
                {displayPII && <RenderPIIPopup piiScan={piiScan} setPIIScan={setPIIScan} />}
              </div>
            </div>
          )}
        </div>
        <div className='pt-2 d-flex gap-2'>
          <Buttons
            id="submitButton"
            label="Submit"
            aria-label="Submit"
            icon="icon-checked font-12 me-1"
            className='btn btn-sm btn-primary whitetext font-14 btn-border-radius3 ms-auto text-uppercase '
            onClick={() => {
              validateSiteFeedback(subject, message, feedbackAbout)
            }}
          />
          <Buttons
            label="Clear"
            name="Clear"
            className='btn-border1 darktext btn-sm font-14 btn-border-radius3 text-uppercase'
            icon="icon-close font-10 me-1 color-primary"
            type="button"
            onClick={() => {
              resetSiteFeedbackForm()
            }}
          />
        </div>
      </div>
    </>
  )
}
