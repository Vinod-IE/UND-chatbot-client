/* eslint-disable camelcase */
import { SPBatch, sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/items'
import '@pnp/sp/site-users/web'
import '@pnp/sp/site-groups'
import { format } from 'date-fns'
import '@pnp/sp/sputilities'
import { IItem, IItemAddResult, IItemUpdateResult, IItems } from '@pnp/sp/items/types'
import { ListNames, COPY_TO, KNOWLEDGEGRAPH_SELECT_COLUMNS, MASTERLIST_SELECT_COLUMNS, MAX_FILE_SIZE, FILE_CHARACTERS_UNALLOWED } from './configuration'
import { getCurrentUTCDate } from './pages/pii/configuration/formatcontent'
import { Template_LIST_TITLES, db } from './localbase'
import { getList } from './api/helpers'
import { FileError } from './shared/types'
import { getFileExtensionByFileName } from './shared/utility'
export const sitePath = `${window.location.origin}`
const isTeamMember = false
export async function getMetadata() {
  const items = await sp.web.lists.getByTitle('PointofContactList').items.getAll()
  return items
}
type IItemResult = void | IItemAddResult | IItemUpdateResult
type PnpAction = (listname: string, data: any, batch?: SPBatch) => Promise<IItemResult>
function pnpBatch(listname: string, data: any[], action: PnpAction) {
  if (data.length === 0) return

  const batch = sp.createBatch()
  data.forEach((item: any) => {
    action(listname, item, batch)
  })
  return batch.execute()
}
function pnpItemOrItems(listname: string, id?: number) {
  return id
    ? sp.web.lists.getByTitle(listname).items.getById(id)
    : sp.web.lists.getByTitle(listname).items
}
/* This function is used to Add the sharepoint list items 
we need to send the listname and add object as the paramenters*/
export const pnpAdd = async (listname: string, itemData: any | any[], batch?: SPBatch) => {
  const isArray = Array.isArray(itemData)
  if (isArray) return pnpBatch(listname, itemData, pnpAdd)

  if (!isNaN(itemData.ID) || itemData.toDelete) return
  const items = pnpItemOrItems(listname) as IItems

  return batch
    ? items.inBatch(batch).add(itemData)
    : items.add(itemData)
}
/* This function is used to delete the sharepoint list items 
we need to send the listname and item object as the paramenters*/
export const pnpDelete = async (listname: string, itemData: any | any[], batch?: SPBatch) => {
  const isArray = Array.isArray(itemData)
  if (isArray) return pnpBatch(listname, itemData, pnpDelete)

  const { ID } = itemData
  if (isNaN(ID)) return
  const item = pnpItemOrItems(listname, ID) as IItem
  return batch
    ? item.inBatch(batch).delete()
    : item.delete()
}
/* This function is used to update the sharepoint list columns 
we need to send the listname and update object as the paramenters*/
export const pnpUpdate = async (listname: string, itemData: any | any[], batch?: SPBatch): Promise<void | IItemUpdateResult | IItemAddResult> => {
  const isArray = Array.isArray(itemData)
  if (isArray) return pnpBatch(listname, itemData, pnpUpdate)

  const { ID, toDelete } = itemData
  const item = pnpItemOrItems(listname, ID) as IItem

  if (!batch) return item.update(itemData)
  if (isNaN(ID)) return pnpAdd(listname, itemData, batch)
  if (toDelete) return pnpDelete(listname, itemData, batch)
  return item.inBatch(batch).update(itemData)
}
/* This function is used to check the wherther the
 given Phone is valid or not, it return true 
 if it is valid and returns false if it is not valid*/
export const validatePhone = (phonenumber: string) => {
  let str = ''
  let isvalidphone = true
  const intRegex = /^[\d ()+-]{1,16}$/
  if (phonenumber.indexOf('-') > -1) {
    phonenumber = phonenumber.replace('-', '')
  }
  if (phonenumber.indexOf('/') > -1) {
    phonenumber = phonenumber.replace('/', '')
  }
  for (let x = 0; x < phonenumber.length; x++) {
    str = phonenumber.charAt(x)
    if (!intRegex.test(str)) {
      isvalidphone = false
      return isvalidphone
    }
  }
  return isvalidphone
}
/* This function is used to check the wherther the
 given Email is valid or not, it return true 
 if it is valid and returns false if it is not valid*/
export const validateEmail = (email: string) => {
  const expr = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  return expr.test(email)
}
/* This function is used to check the wherther the
 given url is valid or not, it return true 
 if it is valid and returns false if it is not valid*/
export const isUrlValid = (url: any) => {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i.test(url)
}
/* This function is used to get the current fiscal Year*/
export const getFiscalYear = (date: any) => {
  let fyear = ''
  const currentMonth = date.getMonth() + 1
  if (currentMonth >= 10) {
    fyear = date.getFullYear() + 1
  } else {
    fyear = date.getFullYear()
  }
  return fyear
}
/* This function is used to get the number of Days between the dates*/
export const getNumberofDays = (ndate: any) => {
  let nodays = 0
  try {
    const start: any = new Date(ndate)
    const end: any = new Date()
    let days = (end - start) / 1000 / 60 / 60 / 24
    // which you need to offset as below
    days = days - (end.getTimezoneOffset() - start.getTimezoneOffset()) / (60 * 24)
    nodays = Math.floor(days)
  } catch (e) {
    return nodays
  }
  return nodays
}
/* function for removing currency format */
export const removeCurrency = (input: any) => {
  if (input !== '' && input !== undefined) {
    let part1 = input.replace('$', '')
    part1 = part1.replace('.00', '')
    part1 = part1.replace(/,/g, '')
    part1 = isNaN(part1) || part1 === '' || part1 === null ? 0 : part1
    return part1
  } else {
    return null
  }
}

/* function for appending currency format as prifix */
export const prefixFormatCurrency = (value: any) => {
  const num = decimalformat(value)
  const parts = num.split('.')
  const part1 = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  const part2 = parts[1]
  const part3 = '$' + part1 + '.' + part2
  return part3
}

// Function for making decimal format of curreny
export const decimalformat = (input: any) => {
  const num = isNaN(input) || input === '' || input === null ? 0.00 : input
  return parseFloat(num).toFixed(2)
}
/*  This isDate function is used to check whether the given input Date or not 
It returns true if the given input is Date and it returns false if the given input is other than date*/
export function isDate(dateStr: any) {
  if (isNaN(dateStr)) {
    const dt = new Date(dateStr)
    if (isNaN(dt.getTime())) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}
/* This convertDate function is used to convert 
given date to Data and Time hours, minutes and Am or PM formats */
export function convertDate(serverDate: string | number | Date | null | undefined, formatter: string) {
  let createdDate = ''
  if (serverDate !== '' && serverDate !== null && serverDate !== undefined) {
    const dt = new Date(serverDate)
    createdDate = format(dt, 'MM/dd/yyyy')
    if (formatter === 'date') {
      createdDate = format(dt, 'MM/dd/yyyy hh:mm a')
    }
  }
  return createdDate
}
/* This formatDatetoTime function is used to convert 
given date to Data and Time hours, minutes and Seconds and Am and Pm formats */
export function formatDatetoTime(dateToFormat: string) {
  const date = new Date(Date.parse(dateToFormat))
  let hoursMin = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  hoursMin = hoursMin?.split(',')?.join(' ')
  return hoursMin
}
/* This validateDate function is used to validate the given input if it is valid Date 
It will true and it will return false if it is incorrect*/
export function validateDate(date: any): boolean {
  if ((date !== undefined) && (date !== '')) {
    const datearr = date.split('-')
    if (datearr == null) { return false }
    const month = datearr[1]
    const day = datearr[2]
    const year = datearr[0]
    if (year === undefined || month === undefined || day === undefined || year === 'undefined' || month === 'undefined' || day === 'undefined') { return false }
    if ((month < 1 || month > 12) || (day < 1 || day > 31 || isNaN(day)) || (year.length > 4 || year === '' || year === 'undefined' || year === undefined || parseInt(year) < 1900 || parseInt(year) > 2099)) { return false } else if (month === 2) {
      const isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
      if (day > 29 || (day === 29 && !isleap) || isNaN(day)) { return false }
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day > 30 || isNaN(day)) { return false }
    }
  } else {
    return false
  }
  return true
}
export function removehtmltags(data: string): string {
  if (data !== '' && data !== undefined && data !== null) { return data.replace(/<[^>]+>|&nbsp;/g, '') } else { return '' }
}
function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
/* This highlightMatchingText function is used to highlight the matching text in the given seach*/
export function highlightMatchingText(text: string, searchQuery: string): string {
  if (!text || !searchQuery || (Array.isArray(searchQuery) && searchQuery.length === 0)) {
    return text || ''
  }
  let escapedSearchQuery
  if (Array.isArray(searchQuery)) {
    escapedSearchQuery = searchQuery.map(escapeRegExp).join('|')
  } else {
    escapedSearchQuery = escapeRegExp(searchQuery)
  }

  const regex = new RegExp(`(${escapedSearchQuery})`, 'gi')

  return text.replace(regex, (match: string) => `<span  style="background-color: yellow;"class="highlighted">${match}</span>`)
}
/* This DocumentIconNames function is used to get fileName extension class name and it returns the icon  class name */
export function DocumentIconNames(file: string): string{
  const fileExtension = file?.split('.').pop() ? file?.split('.')?.pop()?.toLowerCase() : ''
  const iconName = (fileExtension === 'ppt' || fileExtension === 'pptx')
    ? 'icon-pptdoc icon-pptcolor'
    : (fileExtension === 'pdf')
      ? 'icon-PDF1 icon-pdfcolor'
      : (fileExtension === 'doc' || fileExtension === 'docx')
        ? 'icon-worddoc color-primary'
        : (fileExtension === 'xlsx' || fileExtension === 'xls')
          ? 'icon-excel icon-excelcolor'
          : (fileExtension === 'txt')
            ? 'icon-emptyfile color-primary'
            : (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg')
              ? 'icon-file-picture icon-png-jpgcolor'
              : (fileExtension === 'msg') ? 'icon-email' : 'icon-file'
  return iconName
}
/* This formatPhoneNumber function is used to format given phone number into the (463)643-6436 format */
export const formatPhoneNumber = (phoneNumber: any) => {
  const cleanedNumber = phoneNumber?.replace(/\D/g, '')
  const match = cleanedNumber?.match(/(\d{0,3})(\d{0,3})(\d{0,4})/)

  if (!match?.[2]) {
    return match ? match[1] : ''
  }

  const formattedNumber = `(${match[1]})${match[2]}${match[3] ? `-${match[3]}` : ''}`
  return formattedNumber
}
/* This removeTags function is used to remove the Html Tags in the given input and it will return the tags free content*/
export function removeTags (html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}
/** *** Send Email Functionality **** */

export const sendEmail = async (emailObj: any) => {
  const withUrl = (emailObj.navURL) ? 'table-row' : 'none'
  let body = ''; let endBody; let startBody
  let clickHereText = ''; let emailbody = ''; let bodyTextHtml = ''; let clickHereTextHtml = ''
  if (emailObj.body?.includes('&;')) {
    emailbody = emailObj.body?.split('&;')[0]
    clickHereText = emailObj.body?.split('&;')[1]
    clickHereText = clickHereText?.split('[Click Here]')[1]
  } else {
    clickHereText = emailObj.body
    if (clickHereText?.indexOf('[Click Here]') > -1) { clickHereText = clickHereText?.split('[Click Here]')[1] }
  }
  if (emailObj.isDiscussion) {
    body = emailObj.Discussion
  } else if (emailObj.isSurvey) {
    body = emailObj.bodySurvey
  } else {
    startBody = '<!doctype html><html><head><meta name="GENERATOR" content="MSHTML 11.00.9600.18538"></head><body><table style="font-size: 13px; font-family: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; font-weight: 600; margin: 0px auto" cellspacing="0" cellpadding="0" width="620" border="0"><tbody><tr><td><table cellspacing="0" cellpadding="0" width="620"><tbody><tr><td style="border-collapse: collapse; padding-bottom: 10px;  padding-top: 10px;  padding-left:  15px; margin: 0px;background-color: #efeff7" valign="top" cellspacing="0" cellpadding="0" border="0"><h1 style="padding-top:0px;padding-bottom:0px; color:#00529B; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight:bold; margin-top:0px; margin-bottom:0px; ">RhyBus</h1><h2 style="padding-top:0px;padding-bottom:0px; margin-top:0px;margin-bottom:0px; color:#232324; font-family: Arial, Helvetica, sans-serif; font-weight:bold; font-size: 14px;">React-Template1 </h2></td></tr>'
    if (emailbody !== '') {
      bodyTextHtml = `<TR><TD style="FONT-SIZE: 13px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,' sans-serif'; BORDER-RIGHT: #B7B7B7 1px solid; border-left: #B7B7B7 1px solid; BORDER-TOP: #B7B7B7 1px solid; COLOR: #323232; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px">${emailbody}</TD></TR>`
    }
    if (clickHereText !== '' && emailObj.body?.indexOf('[Click Here]') > -1) { clickHereTextHtml = `<tr  style={{ display: ${withUrl} }}><td style="font-size: 13px; font-family: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,' sans-serif'; border-right: #B7B7B7 1px solid; border-left: #B7B7B7 1px solid; color: #323232; padding-bottom: 10px; padding-top: 10px; padding-left: 10px; padding-right: 10px">Please <a style="font-size: 12px; text-decoration: none; vertical-align: top; font-weight: 600; color: #199059; margin-left: 2px; margin-right: 2px" href="${emailObj.navURL}">Click Here</a> ${clickHereText}<br/></td></tr>` } else { clickHereTextHtml = `<tr  style={{ display: ${withUrl} }}><td style="font-size: 13px; font-family: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,' sans-serif'; border-right: #B7B7B7 1px solid; border-left: #B7B7B7 1px solid; color: #323232; padding-bottom: 10px; padding-top: 10px; padding-left: 10px; padding-right: 10px">${clickHereText}<br/></td></tr>` }
    endBody = '<tr><td style="font-size: 12px; border-top: #B7B7B7 1px solid; font-family: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; border-right: #B7B7B7 1px solid;border-left: #B7B7B7 1px solid; border-bottom: #B7B7B7 1px solid; color: #555555; padding-bottom: 10px; padding-top: 10px; padding-left: 10px; padding-right: 10px">PLEASE DO NOT REPLY. This mailbox is unmonitored, If you have any questions, please contact: RhyBus-ReactUI Team.</td></tr></tbody></table></td></tr></tbody></table></body></html>'
    body = startBody + bodyTextHtml + clickHereTextHtml + endBody
  }
  try {
    sp.utility.sendEmail({
      Body: emailObj.isDiscussion ? emailObj.Discussion : body?.replace(/\n/g, ''),
      Subject: emailObj.subject,
      To: [emailObj.to],
      CC: [emailObj.cc],
      AdditionalHeaders: {
        'content-type': 'text/html'
      }
    }).then(() => {
      addToEmailLogList(emailObj, body, true, 'Success')
    })
  } catch (e) {
    addToEmailLogList(emailObj, body, false, 'Error')
  }
}
/* Function to add the Email data in the Email log list */
export const addToEmailLogList = async (emailObj: any, body: any, emailSent: any, errorInfo: any) => {
  const ObjectArray: any = {
    Title: 'Test',
    Role: 'Customer',
    ItemGUID: emailObj.ItemGUID,
    From: 'no-reply@sharepointonline.com',
    To: emailObj.to,
    Subject: emailObj.subject,
    IsMailSent: emailSent,
    ItemCreated: getCurrentUTCDate(),
    ItemCreatedById: emailObj.loginuserId,
    ItemModified: getCurrentUTCDate(),
    ItemModifiedById: emailObj.loginuserId,
    Body: body,
    ErrorInformation: errorInfo === 'Error' ? 'error' : ''
  }
  try {
    pnpAdd(ListNames?.EMAILLOGLIST, ObjectArray).then(async (data: any) => null)
  } catch (error) {
    //
  }
}
const WHITE_LIST_REGEX = /[^\w. _\-$#/:()&,@;\n\r]/gi
export const encodeHTML = function (str: any) {
  return str.replace(WHITE_LIST_REGEX, function (c: any) {
    return '&#' + c.charCodeAt(0) + ';'
  })
}
export const endingEmailMessage = 'PLEASE DO NOT REPLY. This mailbox is unmonitored, if you have any questions, please contact: RhyBus React-UI Team.'
export function emaildiscussionsbody(Title: any, comment: any, bodytext: any, clickHereText: any) {
  let body = ''
  body += '<!doctype html>'
  body += '<HTML><HEAD> <META name=GENERATOR content="MSHTML 11.00.10570.1001"></HEAD> <BODY>'
  body += '<TABLE style="FONT-SIZE: 13px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; FONT-WEIGHT: 600; MARGIN: 0px auto" cellSpacing=0 cellPadding=0 width=620 border=0>'
  body += '<TBODY>'
  body += '<TR><TD style="BORDER-COLLAPSE: collapse; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 15px; MARGIN: 0px; BACKGROUND-COLOR: #efeff7" vAlign=top border="0" cellpadding="0" cellspacing="0">'
  body += '<H1 style="FONT-SIZE: 18px; MARGIN-BOTTOM: 0px; FONT-FAMILY: Arial, Helvetica, sans-serif; MARGIN-TOP: 0px; FONT-WEIGHT: bold; COLOR: #00529b; PADDING-BOTTOM: 0px; PADDING-TOP: 0px">RhyBus</H1>'
  body += '<H2 style="FONT-SIZE: 14px; MARGIN-BOTTOM: 0px; FONT-FAMILY: Arial, Helvetica, sans-serif; MARGIN-TOP: 0px; FONT-WEIGHT: bold; COLOR: #232324; PADDING-BOTTOM: 0px; PADDING-TOP: 0px">React-UI</H2>'
  body += '</TD></TR>'
  body += '<TR><TD>'
  body += '<TABLE style="BORDER-RIGHT: #B7B7B7 1px solid; BORDER-LEFT: #B7B7B7 1px solid" cellSpacing=0 cellPadding=0 width=620>'
  body += '<TBODY>'
  body += '<TR><TD style="FONT-SIZE: 13px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; BORDER-RIGHT: #efeff7 1px solid; COLOR: #323232; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px">'
  body += '<TABLE style="FONT-SIZE: 13px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'" cellSpacing=0 cellPadding=0 width=620>'
  body += '<TBODY>'
  body += '<TR><TD style="FONT-SIZE: 14px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; BORDER-BOTTOM: #88a6db 1px solid; COLOR: #88a6db; PADDING-BOTTOM: 5px">Subject'
  body += '</TD></TR>'
  body += '<TR><TD style="FONT-SIZE: 12px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; COLOR: #333333; PADDING-BOTTOM: 5px; PADDING-TOP: 5px">'
  body += '' + Title + ''
  body += '</TD></TR>'
  body += '<TR><TD style="FONT-SIZE: 14px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; BORDER-BOTTOM: #c8a2cd 1px solid; COLOR: #c8a2cd; PADDING-BOTTOM: 5px">Comment'
  body += '</TD></TR>'
  body += '<TR> <TD style="FONT-SIZE: 12px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; COLOR: #333333; PADDING-BOTTOM: 5px; PADDING-TOP: 5px">'
  body += '<P> ' + comment + ' </P><P> ' + bodytext + ' </P>'
  body += '</TD></TR>'
  body += '<TR> <TD style="FONT-SIZE: 12px; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; COLOR: #333333; PADDING-BOTTOM: 5px; PADDING-TOP: 5px">'
  body += '' + clickHereText + ''
  body += '</TD></TR>'
  body += '</TBODY>'
  body += '</TABLE>'
  body += '</TD></TR>'
  body += '<TR> <TD style="FONT-SIZE: 12px; BORDER-TOP: #B7B7B7 1px solid; FONT-FAMILY: Segoe, Segoe UI, DejaVu Sans, Trebuchet MS, Verdana,\' sans-serif\'; BORDER-RIGHT: #B7B7B7 1px solid; BORDER-BOTTOM: #B7B7B7 1px solid; COLOR: #555555; PADDING-BOTTOM: 10px; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px">'
  body += endingEmailMessage
  body += '</TD></TR></TBODY></TABLE>'
  body += '</TD></TR></TBODY></TABLE></BODY></HTML>'

  return body
}
export function sendemailObject(data: any, emailSubject: any, ItemGUID: any, type: any, ParentCommentSubject: any) {
  const Title = type === 'Reply' ? ParentCommentSubject : data?.data?.Subject
  const sendEmail = []
  let subject = emailSubject
  let bodytext = ''
  const navURL = window.location.href
  if (data?.data?.DocumentName) {
    bodytext = 'New comment has been added on ' + data?.data?.DocumentName
  }
  const to = _spPageContextInfo.userEmail
  const comment = '' + data?.data?.Comment + ''
  const clickHereText = 'Please <a style="FONT-SIZE: 12px; TEXT-DECORATION: none; VERTICAL-ALIGN: top; FONT-WEIGHT: 600; COLOR: #199059; MARGIN-LEFT: 2px; MARGIN-RIGHT: 2px" href=\'' + navURL + '\'>Click Here</a> to view the comment(s).'
  const body = emaildiscussionsbody(Title, comment, bodytext, clickHereText)
  sendEmail.push({
    to: to,
    subject: subject,
    Discussion: body,
    isDiscussion: true,
    cc: '',
    bcc: '',
    navURL: navURL,
    loginuserId: _spPageContextInfo?.userId
  })
  if (isTeamMember) {
    const to = _spPageContextInfo.userEmail
    subject = subject?.replace(/\[LoginUserName]/g, 'Team Member')
    const comment = '' + data?.data?.Comment + ''
    const clickHereText = 'Please <a style="FONT-SIZE: 12px; TEXT-DECORATION: none; VERTICAL-ALIGN: top; FONT-WEIGHT: 600; COLOR: #199059; MARGIN-LEFT: 2px; MARGIN-RIGHT: 2px" href=\'' + navURL + '\'>Click Here</a> to view the comment(s).'
    const body = emaildiscussionsbody(Title, comment, bodytext, clickHereText)
    sendEmail.push({
      to: to,
      subject: subject,
      Discussion: body,
      isDiscussion: true,
      cc: '',
      bcc: '',
      navURL: navURL,
      loginuserId: _spPageContextInfo?.userId
    })
  }
  return sendEmail
}

/* send Email Functionality End here */
export const Action = {
  Resolved: 'Resolved',
  Reopened: 'Reopened',
  Canceled: 'Canceled',
  Closed: 'Closed',
  Role: 'Customer',
  Elevated: 'Elevated',
  AssignTo: 'Assigned',
  Submitted: 'Submitted',
  Updated: 'Updated',
  RemovedDVCustomer: 'Removed DV Customer',
  AddedDVCustomer: 'Added DV Customer',
  Waiting: 'Waiting',
  Responded: 'Responded',
  Sent: 'Sent',
  Completed: 'Completed',
  Copid: 'Copied',
  Saved: 'Saved'
}
const onlyInLeft = (left: any[], right: any[], compareFunction: { (keys: any, sharepointDefaultArray: any): boolean; (keys: any, sharepointDefaultArray: any): boolean; (arg0: any, arg1: any): any; }) =>
  left.filter(leftValue =>
    !right.some(rightValue =>
      compareFunction(leftValue, rightValue)))

/* This exportToCSV function is used to the export the selected item in the CSV format*/
export function exportToCSV<T extends object> (dataArr: Array<T>, filename: string) {
  const separator = ','
  const keys: any = Object.keys(dataArr[0]) as unknown
  /* sharepointDefaultArray constant is used to hold the SharePoint Default columns
   and used to compare from the Sharepoint list columns
    while export to CSV these columns are excluded in the export to CSV*/
  const sharepointDefaultArray = ['ContentTypeId', 'FileSystemObjectType', 'OData__ColorTag', 'OData__UIVersionString', 'ServerRedirectedEmbedUri', 'ServerRedirectedEmbedUrl', 'ComplianceAssetId', 'Attachments', 'ComplianceAssetId', 'AuthorId', 'EditorId', 'ItemCreatedBy','ItemModifiedBy','ItemCreated', 'ItemModified', 'AttachmentFiles' ]
  const isSameColums = (keys: any, sharepointDefaultArray: any) => keys === sharepointDefaultArray
  const onlyInA = onlyInLeft(keys, sharepointDefaultArray, isSameColums)
  const result = [...onlyInA]
  const csvContent =
  result.join(separator) +
      '\n' +
      dataArr.map((data: any) => {
        return result.map((k: any) => {
          const cell: any = data[k] ?? ''
          let cellToString: string
          if (isDate(cell)) {
            const created = new Date(cell)
            const createdDate = convertDate(created, '')
            cellToString = createdDate
          } else {
            const validatedCell = isString(cell) ? removehtmltags(cell) : cell
            cellToString = validatedCell.toString().replace(/"/g, '""')
          }
          // check to see if any symbols/new lines exist in string
          if (cellToString.search(/("|,|\n)/g) >= 0) {
            cellToString = `"${cellToString}"`
          }
          return cellToString
        }).join(separator)
      }).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = `${filename}.csv`
  link.href = url
  link.click()
}
/* end */

/* This toCheckNullValues function is used to check wheather
 the given input containes null values or not 
 if null values are present it will return empty  */
export function toCheckNullValues (value : any) {
  return value || ''
}
/* end */ 
const kbarticalsLastModifiedLocal = () => {
  return db.collection(Template_LIST_TITLES.KBArticles).get().then((items: any) => {
    if (items.length > 0) {
      const allKBArticlesList : any[] = items[0].data
      if (allKBArticlesList && allKBArticlesList.length > 0) {
        const sortedItems = allKBArticlesList?.sort(function (a : any, b : any) {
          return new Date(b?.ItemModified).valueOf() - new Date(a?.ItemModified).valueOf()
        })
        const lastModifiedItem = sortedItems[0]
        return lastModifiedItem
      } else {
        return null
      }
    } else {
      return null
    }
  })
}

const knowledgegraphLastModifiedFromDB = async () => {
  const list = await getList(ListNames.KNOWLEDGEGRAPH)
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

  const items = await list?.items
    .select(KNOWLEDGEGRAPH_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .orderBy('ItemModified', false)
    .top(1)
    .get()

  return items
}
export const compareLastModifiedKnowledgeBase = async () => {
  try {
    const localLastModified = await kbarticalsLastModifiedLocal()
    const dbLastModified = await knowledgegraphLastModifiedFromDB()
    // localLastModified &&
    if (dbLastModified.length > 0) {
      if (localLastModified?.ItemModified === dbLastModified[0]?.ItemModified) {
        return true
      } else {
        await rebuildKBInLocalbase()
        return true
      }
    } else {
      return false
    }
  } catch (error) {
    console.error('An error occurred:', error)
    return false
  }
}
export const rebuildKBInLocalbase = async () => {
  db.collection(Template_LIST_TITLES.KBArticles).delete()
  await fetchKnowledgeGraphsData().then((data) => {
    db.collection(Template_LIST_TITLES.KBArticles).add({ data })
  })
}
export const fetchKnowledgeGraphsData = async () => {
  const list = await getList(ListNames.KNOWLEDGEGRAPH)
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

  const items = await list?.items
    .select(KNOWLEDGEGRAPH_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
/* To Generate Item GUID we use this function*/
export const generateGUID = () => {
  let d = new Date().getTime()
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return guid
}
/* End */ 
/*This copyToAction function used to copy to copy the selected fileds 
and Exclude the unselected field from sharepoint defauit array */ 
export function copyToAction<T extends object> (dataArr: Array<T>) {
  const keys: any = Object.keys(dataArr[0]) as unknown
  const intersection = keys.filter((element: any) => COPY_TO.includes(element))
  return intersection
}
/* End */
/*This scrollToTop fuction is used to scroll to Top in page */
export const scrollToTop = () => {
  document.getElementById('scroll')?.scrollIntoView({ behavior: 'smooth' })
}
/* End */
/* returnDashesIfNull is used to if the given input have no values or null value it will return the -- */
export function returnDashesIfNull (value: any) {
  return value || '--'
  }
  export function returnNAIfNull (value: any) {
    return value || 'N/A'
    }
export const validateFile = (file: File, supportedFiles: string[]): [boolean, Array<FileError>] => {
    let valid = true
    const errors: Array<FileError> = []
    const FileTypes = supportedFiles
    const ext = getFileExtensionByFileName(file.name)
    if (file.size > MAX_FILE_SIZE) {
        errors.push({ fileName: `${file.name}`, message: 'File cannot exceed 25MB.' })
        valid = false
    }
    if (FileTypes.indexOf(ext) === -1) {
        errors.push({ fileName: `${file.name}`, message: `File type is not allowed. Acceptable file types are ${FileTypes.join(', ')}.` })
        valid = false
    }
    if (FILE_CHARACTERS_UNALLOWED.some(char => file.name.includes(char))) {
        errors.push({ fileName: `${file.name}`, message: `File name contains unallowed characters. Unallowed characters are ${FILE_CHARACTERS_UNALLOWED.join(' ')}.` })
        valid = false
    }
    return [valid, errors]
  }


  /* Indexed Db for Master List */
  const masterLastModifiedLocal = () => {
    return db.collection(Template_LIST_TITLES.MasterList).get().then((items: any) => {
      if (items.length > 0) {
        const allMasterList : any[] = items[0].data
        if (allMasterList && allMasterList.length > 0) {
          const sortedItems = allMasterList?.sort(function (a : any, b : any) {
            return new Date(b?.ItemModified).valueOf() - new Date(a?.ItemModified).valueOf()
          })
          const lastModified = sortedItems[0]
          return {lastModified, allMasterList }
        } else {
          return null
        }
      } else {
        return null
      }
    })
  }
  const masterLastModifiedFromDB = async () => {
    const list = await getList(ListNames.MASTERLIST)
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
  
    const lastModified = await list?.items
      .select(MASTERLIST_SELECT_COLUMNS)
      .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
      .orderBy('ItemModified', false)
      .top(1)
      .get()
      const allMasterList = await list?.items
      .select(MASTERLIST_SELECT_COLUMNS)
      .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
      .getAll()
    return {lastModified, allMasterList }
  }
  export const rebuildMasterInLocalbase = async () => {
    db.collection(Template_LIST_TITLES.MasterList).delete()
    await fetchMasterDataData().then((data) => {
      db.collection(Template_LIST_TITLES.MasterList).add({ data })
    })
  }
  export const fetchMasterDataData = async () => {
    const list = await getList(ListNames.MASTERLIST)
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
  
    const items = await list?.items
      .select(MASTERLIST_SELECT_COLUMNS)
      .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
      .getAll()
    items.sort(function (a : any, b : any) {
      return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
    })
    return items
  }
  export const compareLastModifiedMaster = async () => {
    try {
      const localLastModified = await masterLastModifiedLocal()
      const dbLastModified: any = await masterLastModifiedFromDB()
        if (localLastModified?.allMasterList?.length === dbLastModified?.allMasterList?.length && localLastModified?.lastModified?.ItemModified === dbLastModified?.lastModified[0]?.ItemModified) {
          return true
        } else {
          await rebuildMasterInLocalbase()
          return true
        }
    } catch (error) {
      console.error('An error occurred:', error)
      return false
    }
  }
export function compareDates (dateA: string | number | Date | null | undefined, dateB: string | number | Date | null | undefined) {
  const newmdate = (dateA != null && dateA !== '' && dateA !== undefined ? new Date(dateA) : '')
  const oldmdate = (dateB != null && dateB !== '' && dateB !== undefined && dateB !== 'null' && dateB !== 'undefined' ? new Date(dateB) : '')
  if (oldmdate === '' || newmdate > oldmdate || newmdate === '') {
    return true
  }
  return false
}
export const siteName = window.location.href.split('/')[5]
export function isQuotaExceededError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    // everything except Firefox
    (err.code === 22 ||
      // Firefox
      err.code === 1014 ||
      // everything except Firefox
      err.name === 'QuotaExceededError' ||
      // Firefox
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}
export function formatUTCDateToLocal(dateToFormat: string) {
  const date = new Date(Date.parse(dateToFormat))
  const formattedDate = date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
  }).split('/').reverse().join('-')
  return formattedDate
}
export function isString(value: any) {
  return typeof value === 'string'
}
export function extractTextAndStylesFromHTML(html: any) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const text = doc.body.textContent || ''
  const styles = []
  const elements: any = doc.body.getElementsByTagName('*')
  for (const el of elements) {
    styles.push({
      tagName: el.tagName,
      className: el.className,
      cssText: el.style.cssText
    })
  }
  return { text, styles }
}
export function areContentsEqual(content1: any, content2:any) {
  const extracted1 = extractTextAndStylesFromHTML(content1)
  const extracted2 = extractTextAndStylesFromHTML(content2)
  const textEqual = extracted1.text.trim() === extracted2.text.trim()
  const stylesEqual = JSON.stringify(extracted1.styles) === JSON.stringify(extracted2.styles)
  return textEqual && stylesEqual
}