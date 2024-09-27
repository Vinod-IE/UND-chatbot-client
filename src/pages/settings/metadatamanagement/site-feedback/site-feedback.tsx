/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import { I_SiteFeedback } from '../../../../shared/interfaces/Settings.interface'
import { useGetFeedback } from '../../../../store/settings/hooks'
import saveAs from 'file-saver'
import XLSX from 'sheetjs-style'
import { DocumentIconNames, convertDate } from '../../../../Global'
import { NORESULT } from '../../../../configuration'
declare global {
  interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}
const Sitefeedback = (props:any) => {
  const feedbackitems: Array<I_SiteFeedback> = useGetFeedback()
  const [feedbackItems, setFeedbackItems] = useState<Array<I_SiteFeedback>>([])
  useEffect(() => {
    setFeedbackItems(feedbackitems)
  }, [feedbackitems])
  const downloadSiteFeedback = () => {
    const promises = []
    const data = feedbackitems
    const filename = 'FeedBackList'
    const folderName = 'Excel Attachments'
    const savedExcel = SaveExcelContents()
    const excelobj : any = {}
    excelobj['0'] = filename + '.xlsx'
    excelobj['1'] = savedExcel
    excelobj['2'] = folderName
    promises.push(excelobj)
    $.each(data, function (i, element : any) {
      const Id = element.ID
      if (element.AttachmentFiles.length > 0) {
        $.each(element.AttachmentFiles, function (j, attachfile) {
          $.each(attachfile, function () {
            const name = attachfile.ServerRelativeUrl
            let filename = name.split('/')
            filename = filename[filename.length - 1]
            promises.push(getBinaryData(name, filename, Id))
          })
        })
      }
    })
    Promise.all(promises).then(function (args : any) {
      // const zip = new JSZip()
      const zip = require('jszip')()
      const rootfolder = zip.folder('Attachments')
      for (let i = 0; i < args.length; i++) {
        const attfolders = rootfolder.folder(args[i][2])
        const name = args[i][0]
        const data = args[i][1]
        const Id = args[i][2]
        attfolders.file(name, data, Id)
      }
      zip.generateAsync({
        type: 'blob'
      }).then(function (content : any) {
        saveAs(content, getarchivename('SiteFeedback'))
      })
    }, function (err) {
      // error occurred
      console.log(err)
    })
  }

  function SaveExcelContents () {
    const feedbackData: any[] = []
    feedbackItems.map((elem: any) => {
      let attachNames = ''
      elem.AttachmentFiles.forEach((attachList: { FileName: string }) => {
        attachNames = attachNames + attachList?.FileName + ','
      })
      feedbackData.push({
        ID: elem.ID,
        Subject: elem.Subject,
        'Feedback About': elem.FeedBackAbout,
        Description: elem.Message,
        Attachments: attachNames,
        Modified: elem.ItemModifiedBy?.Title + ' | ' + convertDate(elem.ItemModified, 'date')
      })
    })
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'
    const ws = XLSX.utils.json_to_sheet(feedbackData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    return data
  }

  function getBinaryData (thisurl: any, name: any, folder: any) {
    return new Promise(function (resolve) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', thisurl, true)
      xhr.responseType = 'arraybuffer'
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          resolve([name, (new Blob([xhr.response])), folder])
        }
      })
      xhr.send()
    })
  }

  function getarchivename (name: any) {
    const now = new Date()
    let timestamp = now.getFullYear() + ''
    const month = pad0(now.getMonth() + 1)
    const day = pad0(now.getDate())
    timestamp = timestamp + month + day

    let hours = now.getHours()
    let affix = 'AM'
    if (hours > 12) {
      hours = hours - 12
      affix = 'PM'
    }
    hours = pad0(hours)
    const min = pad0(now.getMinutes())

    timestamp = timestamp + '' + hours + '' + min + '' + affix
    const archivename = name + '-' + timestamp + '.zip'
    return archivename
  }

  function pad0 (value: any) {
    const val = parseInt(value)
    if (val < 10) {
      value = '0' + val
    }
    return val
  }
  return (
                <div className='row m-0'>
                    <div className='mt-0 p-0 d-flex align-items-center tabsheads p-absolute'>
                        <h2 tabIndex={0} aria-label='Site Feedback'>SITE FEEDBACK</h2>
                        {feedbackitems && feedbackitems?.length > 0 && <Buttons
                            label="Download Site Feedback"
                            aria-label="Download Site Feedback"
                            icon="icon-download me-1"
                            className='btn-sm btn-primary ms-auto whitetext text-nowrap border-radius uppercase'
                            onClick = {downloadSiteFeedback}
                        />}
                    </div>
                    <div className='p-0 settings-main'>
                        { feedbackitems && feedbackitems?.length > 0
                          ? feedbackItems.map((item : any) =>
                            <div className="d-flex flex-column shadow card segoeui-regular mb-2 px-2" key={item.ID}>
                                <div className="d-flex">
                                    <div className='d-flex flex-column flex-md-row flex-wrap w-100'>
                                        <div className="d-flex col flex-column me-auto my-2 text-break" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color1 font-12'>Subject</span>
                                            <span>{item.Subject}</span>
                                        </div>
                                        <div className="dividerdashed vertical m-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-3 col-lg-2 my-2" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color1 font-12'>Feedback About</span>
                                            <span>{item.FeedBackAbout}</span>
                                        </div>
                                        <div className="dividerdashed vertical m-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-3 col-lg-2 text-break my-2" tabIndex={0} aria-live='polite'>
                                            <span className='subtitle-color1 font-12'>Message</span>
                                            <span>{item.Message}</span>
                                        </div>
                                        <div className="dividerdashed vertical m-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-5 col-lg-2 breakall my-2">
                                            <span className='subtitle-color1 font-12' tabIndex={0} aria-label='Attachments'>Attachments</span>
                                            {item?.AttachmentFiles && item.AttachmentFiles?.map((attachList: any) =>
                                           <div key ={ attachList?.FileName} className="d-flex align-items-center">
                                           <span className={`${DocumentIconNames(attachList?.FileName)} pe-1`}></span>
                                           <a href={attachList.ServerRelativeUrl} className="SpanAttachments  links-over-underline" title={attachList?.FileName} download>
                                           {attachList?.FileName}
                                           </a></div>
                                            )}
                                        </div>
                                        <div className="dividerdashed vertical m-2 mx-xxl-3 d-none d-md-block"></div>
                                        <div className="d-flex flex-column col-md-5 col-lg-2 text-break my-2">
                                            <span className='subtitle-color1 font-12'>Modified</span>
                                            <span>{item.ItemModifiedBy?.Title + ' | ' + convertDate(item.ItemModified, 'date')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          )
                          : <div className='min-h-200 d-flex align-items-center justify-content-around'>
                        <div className='subtitle-color montserratregular' tabIndex={0} aria-label={NORESULT}>{NORESULT}</div>
                    </div>}
                    </div>
                </div>
  )
}
export default Sitefeedback
