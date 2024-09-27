/* eslint-disable camelcase */
import { addOrReplaceDataInListBatch, getList } from '../../../api/helpers'
import { ListNames } from '../../../configuration'
import { LABELSTOSCAN, PII, uniqueFormatStartsWithAlpha } from './pii.types'
import NamedRegExp from 'named-regexp-groups'
import readXlsxFile from 'read-excel-file'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import Tesseract from 'tesseract.js'
import * as XLSX from 'xlsx'
import { sp } from '@pnp/sp'
import { getCurrentUTCDate } from '../configuration/formatcontent'
// import { getTextExtractor } from 'office-text-extractor'
declare const window: any
// const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')

/** PII **/
export async function loadPII() {
  // variables
  PII.CategoryFormatList = ListNames.PII_FORMATS
  PII.CategoryParamsList = ListNames.PIICATEGORY
  // functions
  PII.getPiiConfigTemplate = getPiiConfigTemplate
  PII.getData = getData
  PII.getDataHandleError = getDataHandleError
  PII.scanObject_v2 = scanObject_v2
  //   PII.exportToExcel = exportToExcel
}
export const getData = async (tablename: string) => {
  // const data = await (await csp().getList(tablename)).query().filter(filterval).get()

  const list = await getList(tablename)
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
  return data
}
function fillUniqueFormats(piiScan: { scanId?: null; status?: string; listsArray?: never[]; listsMetadata?: any; foldersArray?: never[]; CategoryParams?: never[]; CategoryParamsObj?: any; resultsArray?: never[]; RecordsDetected?: number; RecordsOccurancesDetected?: number; RecordsScanned?: number; ExtraData?: { groupByParam: any }; createdTime?: string; uniqueFormatObj?: any }) {
  return getUniqueFormats().then(function (uniqueFormatObj) {
    piiScan.uniqueFormatObj = uniqueFormatObj
    return piiScan
  })
}
function getUniqueFormats() {
  return new Promise(function (resolve, reject) {
    getDataHandleError(ListNames.PII_FORMATS).then(function (categoryFormatsArray) {
      return getDataHandleError(ListNames.PIICATEGORY).then(function (categoryParamsArray) {
        return {
          categoryFormatsArray: categoryFormatsArray,
          categoryParamsArray: categoryParamsArray
        }
      })
    }).then(function (dataObj) {
      if (!(dataObj && Array.isArray(dataObj.categoryFormatsArray) && Array.isArray(dataObj.categoryParamsArray))) {
        return resolve({})
      }

      const categoryParamsArray = dataObj.categoryParamsArray
      const categoryFormatsArray = dataObj.categoryFormatsArray

      const categoryParamsObj = categoryParamsArray.reduce(function (acc, paramObj) {
        acc[paramObj.ID.toString()] = paramObj
        return acc
      }, {})

      const uniqueFormatsArray = []
      const uniqueFormatStrings = []

      // sort formats, because we will compare the regex string to check if the cache is valid or not
      categoryFormatsArray.sort(function (formatA, formatB) {
        if (formatA.Id < formatB.Id) {
          return -1
        } else if (formatA.Id > formatB.Id) {
          return 1
        }
        return 0
      })
      for (const format of categoryFormatsArray) {
        if (!(format && format.FormatRegExp)) {
          continue
        }
        if (!(format.PID && categoryParamsObj[format.PID.toString()])) {
          continue
        }

        // fill param in format
        format.param = categoryParamsObj[format.PID.toString()]
        if (!format.IsEnable || !(format.param.IsEnable.toLowerCase() === 'true') || !format.param.IsEnable) {
          continue
        }

        // check if this format string already exists
        const ufsIndex = uniqueFormatStrings.indexOf(format.FormatRegExp)

        if (ufsIndex === -1) {
          uniqueFormatStrings.push(format.FormatRegExp)
          uniqueFormatsArray.push({
            formatString: format.FormatRegExp,
            formats: [format],
            contextString: format.param && format.param.CategoryContext ? format.param.CategoryContext : ''
          })
        } else {
          const uniqueFormatItem = uniqueFormatsArray[ufsIndex]
          uniqueFormatItem.formats.push(format)

          if (format.param && format.param.CategoryContext) {
            if (uniqueFormatItem.contextString) {
              uniqueFormatItem.contextString += ','
            }
            uniqueFormatItem.contextString += format.param.CategoryContext
          }
        }
      }

      const groupedRegExString = uniqueFormatsArray.map(function (uniqueFormatItem, uniqueFormatItemIndex) {
        // using named groups
        return '(?<' + uniqueFormatStartsWithAlpha + uniqueFormatItemIndex + '>' + uniqueFormatItem.formatString + ')'
      }).join('|')

      const groupedRegEx = groupedRegExString ? new NamedRegExp(groupedRegExString, 'g') : null
      return resolve({
        uniqueFormatsArray: uniqueFormatsArray,
        uniqueFormatStrings: uniqueFormatStrings,
        groupedRegEx: groupedRegEx,
        groupedRegExString: groupedRegExString
      })
    }).catch(function (err) {
      window.debugPii && console.log('An error occurred while constructing unique formats: ', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      return resolve([])
    })
  })
}
// helper function for scanObject_v2
function getPiiResultsArrayFromText_v2(uniqueFormatObj: { groupedRegEx: any; contextString: any; uniqueFormatsArray: { [x: string]: any } }, extractedText: any, colName: string) {
  const resultsArray = []
  const findingsObj = discoverPII_v2(uniqueFormatObj, uniqueFormatObj.groupedRegEx, extractedText, colName, uniqueFormatObj.contextString)
  if (findingsObj && Array.isArray(findingsObj.findingsArray) && findingsObj.findingsArray.length > 0) {
    for (const element of findingsObj.findingsArray) {
      const findingPart = element
      const finding: any = {
        StartIndex: findingPart.indexStart,
        EndIndex: findingPart.indexEnd
      }
      // fill formats -> these are formats passed for each finding
      const formatIndexes: any = findingPart.formatGroupIds.map(function (groupKey: string) {
        return Number(groupKey.split(uniqueFormatStartsWithAlpha)[1])
      })

      finding.formats = formatIndexes.reduce(function (formatsArray: string | any[] | any, uniqueFormatIndex: string | number) {
        const uniqueFormat = uniqueFormatObj.uniqueFormatsArray[uniqueFormatIndex]
        formatsArray = formatsArray.concat(uniqueFormat.formats)
        return formatsArray
      }, []).sort(function (formatObjA: { ID: number }, formatObjB: { ID: number }) {
        if (formatObjA.ID < formatObjB.ID || (formatObjA.ID > formatObjB.ID)) {
          return -1
        }
        return 0
      })

      finding.FormatIds = finding.formats.map(function (format: { ID: any }) {
        return format.ID
      }).sort()

      resultsArray.push(finding)
    }
  }
  // create all findings aggregation string by param
  let findingsAggString = ''
  const findingsAggObj: any = {}
  for (const element of resultsArray) {
    const finding = element
    const allFindingParamsObj = finding.formats.map(function (formatObj: { param: any }) {
      return formatObj.param
    }).reduce(function (acc: { [x: string]: any }, param: { ID: { toString: () => string | number } }) { // to get unique params
      acc[param.ID.toString()] = param
      return acc
    }, {})

    const uniqueParamIdString = Object.keys(allFindingParamsObj)
      .map(paramId => Number(paramId))
      .sort((a, b) => a - b)
      .join('_')
    if (!findingsAggObj[uniqueParamIdString]) {
      findingsAggObj[uniqueParamIdString] = {
        count: 0,
        formatText: uniqueParamIdString.split('_').map(function (paramId) {
          return allFindingParamsObj[paramId].CategoryParamName
        }).join('/')
      }
    }
    findingsAggObj[uniqueParamIdString].count++
  }

  findingsAggString = getFindingsAggregationString(findingsAggObj)
  return {
    resultsArray: resultsArray,
    displayText: findingsObj.allFormatsFoundText,
    findingsAggregationObj: findingsAggObj,
    findingsAggreationString: findingsAggString
  }
}
function getFindingsAggregationString(findingsAggregationObj: any) {
  if (findingsAggregationObj && Object.keys(findingsAggregationObj).length > 0) {
    return Object.keys(findingsAggregationObj).sort().map(function (key) {
      return findingsAggregationObj[key].formatText + ': ' + findingsAggregationObj[key].count
    }).join(', ')
  }
  return ''
}
// helper function for scanObject_v2
function getPiiResultsArrayFromFile_v2(uniqueFormatObj: any, fileInstance: File) {
  return new Promise(function (resolve, reject) {
    if (!(fileInstance instanceof File)) {
      return resolve([])
    }
    getArrayBufferFromFile(fileInstance).then(function () {
      return extractTextFromFileBuffer(fileInstance.arrayBuffer, fileInstance.name.split('.').pop())
    }).then(function (extractedText: any) {
      const val: any = getPiiResultsArrayFromText_v2(uniqueFormatObj, extractedText, '')
      return val
    }).then(resolve)
  })
}
function extractTextFromExcelSheets(arrayBuffer: File | Blob | ArrayBuffer, name: any) {
  return new Promise(function (resolve, reject) {
    // `rows` is an array of rows
    // each row being an array of cells.
    readXlsxFile(arrayBuffer)
      .then(function (rows) {
        window.debugPii && console.log(rows)
        resolve(JSON.stringify(rows))
      })
      .catch(function (err) {
        window.debugPii && console.log('Exception in extractTextFromExcel', JSON.stringify(err, Object.getOwnPropertyNames(err)))
        resolve('')
      })
  })
}
function getExcelSheets(arrayBuffer: File | Blob | ArrayBuffer) {
  const excelPromises: any[] = []
  const fullExcelData: any[] = []
  return new Promise(function (resolve, reject) {
    if (arrayBuffer) {
      const a = XLSX.read(arrayBuffer)
      // readXlsxFile(arrayBuffer).then(function (sheets: any) {
      for (const sheet of a.SheetNames) {
        excelPromises.push(extractTextFromExcelSheets(arrayBuffer, sheet).then(function (data: any) {
          fullExcelData.push(data)
        }))
      }
      Promise.all(excelPromises).then(function () {
        resolve(fullExcelData.join(' '))
      })
      // }).catch(function () {
      //   resolve('')
      // })
    } else {
      resolve('')
    }
  })
}
let _pdfWorker : any = null
function getPdfWorker () {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
  if (!_pdfWorker) {
    const x : any = 'pii'
    _pdfWorker = new pdfjsLib.PDFWorker(x)
  }
  return _pdfWorker
}
function extractTextFromPdf (arrayBuffer:any) {
  return new Promise(function (resolve, reject) {
    if (arrayBuffer) {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, worker: getPdfWorker() })
      loadingTask.promise.then(function (pdf: { numPages: any; getPage: (arg0: number) => any }) {
        const maxPages = pdf.numPages
        const countPromises = [] // collecting all page promises
        for (let j = 1; j <= maxPages; j++) {
          const page = pdf.getPage(j)
          countPromises.push(page.then(function (page: { getTextContent: () => any }) { // add page promise
            const textContent = page.getTextContent()
            return textContent.then(function (text: { items: any[] }) { // return content promise
              return text.items.map(function (s: { str: any }) {
                return s.str
              }).join(' ')
            })
          }))
        }

        // Wait for all pages and join text
        Promise.all(countPromises).then(function (texts) {
          loadingTask.destroy()
          resolve(texts.join(' '))
        })
      }).catch(function (err: any) {
        window.debugPii && console.log('Exception in extractTextFromPdf', JSON.stringify(err, Object.getOwnPropertyNames(err)))
        loadingTask.destroy()
        resolve('')
      })
    } else {
      resolve('')
    }
  })
}
function extractTextFromFileBuffer(fileArrayBuffer: any, fileExtenstion: string | undefined) {
  return new Promise(function (resolve, reject) {
    if (!fileArrayBuffer || !fileExtenstion) {
      return resolve('')
    }

    if (fileExtenstion === 'docx') {
      extractTextFromWord(fileArrayBuffer).then(resolve)
    } else if (fileExtenstion === 'xlsx') {
      getExcelSheets(fileArrayBuffer).then(resolve)
    } else if (fileExtenstion === 'pdf') {
        extractTextFromPdf(fileArrayBuffer).then(resolve)
    } else if (fileExtenstion.match(/(jpg|jpeg|png|gif|tif|tiff)$/i)) {
      extractTextFromImage(fileArrayBuffer).then(resolve)
    } else if (fileExtenstion === 'txt') {
      readBinaryStringFromArrayBuffer(fileArrayBuffer).then(resolve)
    } else {
      return resolve('')
    }
  })
}
function readBinaryStringFromArrayBuffer(arrayBuffer: BlobPart) {
  return new Promise(function (resolve, reject) {
    const reader: any = new FileReader()
    reader.onload = function (event: any) {
      if (!event) {
        return resolve(reader.content)
      }
      return resolve(event.target.result)
    }
    reader.onerror = function () {
      return resolve('')
    }
    reader.readAsBinaryString(new Blob([arrayBuffer], { type: 'application/octet-stream' }))
  })
}
function extractTextFromImage(imagePathOrArrayBuffer: Iterable<number>) {
  return new Promise(function (resolve, reject) {
    if (imagePathOrArrayBuffer) {
      Tesseract.recognize(new Blob([new Uint8Array(imagePathOrArrayBuffer).buffer])).then(function (tessResponse: { data: { text: unknown } }) {
        return resolve(tessResponse && tessResponse.data.text ? tessResponse.data.text : '')
      }).catch(function (err: any) {
        window.debugPii && console.log('Exception in extractTextFromImage', JSON.stringify(err, Object.getOwnPropertyNames(err)))
        resolve('')
      })
    } else {
      resolve('')
    }
  })
}
async function extractTextFromWord(arrayBuffer: File | Blob | ArrayBuffer) {
  try {
    // Need to find a library to replace mammoth  which doesn't require polyfill
    // let result = ( await mammoth.extractRawText({arrayBuffer: arrayBuffer })).value;
    // const extractor = getTextExtractor()
    // const result = await extractor.extractText({ input: arrayBuffer, type: 'buffer' })
    const result = ''
    return result
  } catch (error) {
    window.debugPii && console.log('Exception in extractTextFromWord', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return ''
  }
}
function getArrayBufferFromFile(fileInstance: any) {
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(fileInstance)

    fileReader.onload = function () {
      fileInstance.arrayBuffer = fileReader.result
      return resolve(fileInstance)
    }
    fileReader.onerror = function () {
      window.debugPii && alert('Error reading File: ' + fileInstance.name + JSON.stringify(fileReader.error, Object.getOwnPropertyNames(fileReader.error)))
      return resolve(fileInstance)
    }
  })
}
function toFormatEnhancedRichText(comment: string | null | undefined) {
  if (comment !== undefined || comment != null) {
    comment = comment?.replace(/\n/g, '<br />')
  }
  return comment
}
function discoverPII_v2(uniqueFormatObj: { groupedRegEx: any; contextString: any; uniqueFormatsArray: { [x: string]: any } }, regEx: any, val: any, colName: string, context: any) {
  // if (regEx.hasOwnProperty('lastIndex')) {
  if (Object.prototype.isPrototypeOf.call(regEx, 'lastIndex')) {
    regEx.lastIndex = 0
  }
  if (regEx.regex) {
    regEx.regex.lastIndex = 0
  }
  val = (/<\/?[a-z][\s\S]*>/i.test(val) ? toFormatEnhancedRichText(val) : val) // to format the results
  let counter = 0; let regExResponse: { index: any; groups: { [x: string]: any } } | null = null; const findingsArray = []; let allFormatsFoundText = val
  while ((regExResponse = regEx.exec(val)) != null) {
    const indexStart = regExResponse.index // response will have start index
    const indexEnd = regEx.regex ? regEx.regex.lastIndex : regEx.lastIndex // and regEx will store the last index from which it has to scan again
    // eslint-disable-next-line no-loop-func
    const formatGroupIds = regExResponse.groups
      ? Object.keys(regExResponse.groups).filter(function (groupKey) {
        return groupKey[0] === uniqueFormatStartsWithAlpha && regExResponse?.groups[groupKey]
      })
      : []
    findingsArray.push({
      indexStart: indexStart,
      indexEnd: indexEnd,
      formatGroupIds: formatGroupIds
    })
    counter++
  }
  // create allFormatsFoundText
  if (counter > 0) {
    // reset
    regEx.lastIndex = 0
    allFormatsFoundText = allFormatsFoundText.toString().replace(regEx, '<span style="background-color:yellow">$&</span>')
  }

  return {
    allFormatsFoundText: allFormatsFoundText,
    findingsArray: findingsArray,
    count: counter
  }
}
function scanObject_v2(objectToScan: { [x: string]: any } | null) {
  return new Promise(function (resolve, reject) {
    if (!(typeof objectToScan === 'object' && objectToScan !== null && Object.keys(objectToScan).length > 0)) {
      return resolve({ error: 'Invalid Object' })
    }
    // construct pii metadata
    const piiScan: any = getPiiConfigTemplate()
    fillUniqueFormats(piiScan).then(function () {
      if (!(piiScan.uniqueFormatObj && Array.isArray(piiScan.uniqueFormatObj.uniqueFormatsArray) && piiScan.uniqueFormatObj.uniqueFormatsArray.length > 0)) {
        return resolve({ error: 'No PII configuration found in your site' })
      }
      const objToReturn: any = {}
      Promise.all(Object.keys(objectToScan).map(function (attrKey) {
        return new Promise<void>(function (resolve, reject) {
          const attrVal = objectToScan[attrKey]
          if (typeof attrVal === 'string' || attrVal instanceof String) {
            const resultsObj = getPiiResultsArrayFromText_v2(piiScan.uniqueFormatObj, attrVal, attrKey)
            objToReturn[attrKey] = Object.assign({ value: attrVal }, resultsObj)
            return resolve()
          } else if (typeof attrVal === 'number') {
            const resultsObj = getPiiResultsArrayFromText_v2(piiScan.uniqueFormatObj, '' + attrVal, attrKey)
            objToReturn[attrKey] = Object.assign({ value: attrVal }, resultsObj)
            return resolve()
          } else if (attrVal instanceof File) {
            getPiiResultsArrayFromFile_v2(piiScan.uniqueFormatObj, attrVal).then(function (resultsObj: any) {
              objToReturn[attrKey] = Object.assign({ value: attrVal }, resultsObj)
            })
            return resolve()
          } else if (Array.isArray(attrVal)) {
            const allAttrValsArray: { value: any }[] = []
            Promise.all(attrVal.map(function (arrayItem) {
              return new Promise<void>(function (resolve, reject) {
                if (arrayItem instanceof File) {
                  getPiiResultsArrayFromFile_v2(piiScan.uniqueFormatObj, arrayItem).then(function (resultsObj: any) {
                    allAttrValsArray.push(Object.assign({ value: arrayItem }, resultsObj))
                    return resolve()
                  })
                } else if (arrayItem && arrayItem.docName && arrayItem.docPath) {
                  getDataHandleError(arrayItem.docPath).then(function (arrayBuffer: any) {
                    return extractTextFromFileBuffer(arrayBuffer, arrayItem.docName.split('.').pop())
                  }).then(function (extractedText) {
                    return getPiiResultsArrayFromText_v2(piiScan.uniqueFormatObj, extractedText, arrayItem.docName)
                  }).then(function (resultsObj) {
                    allAttrValsArray.push(Object.assign({ value: arrayItem }, resultsObj))
                    return resolve()
                  })
                } else {
                  allAttrValsArray.push({
                    value: arrayItem
                  })
                  return resolve()
                }
              })
            })).then(function () {
              objToReturn[attrKey] = {
                value: allAttrValsArray
              }
              return resolve()
            })
          } else {
            objToReturn[attrKey] = {
              value: attrVal
            }
            return resolve()
          }
        })
      })).then(function () {
        return resolve(objToReturn)
      })
    })
  })
}
function getDataHandleError(url: string) {
  return new Promise<void>(function (resolve, reject) {
    getData(url)
      .then(function (data) {
        resolve(data)
      })
      .catch(function (err) {
        window.debugPii && alert('Exception in getDataAndHandleError' + JSON.stringify(err, Object.getOwnPropertyNames(err)))
        // resolve(typeof defaultValue === typeof undefined ? null : defaultValue)
      })
  })
}
function getPiiConfigTemplate() {
  return {
    scanId: null,
    status: 'STARTED',
    listsArray: [],
    listsMetadata: {},
    foldersArray: [],
    CategoryParams: [],
    CategoryParamsObj: {},
    resultsArray: [],
    RecordsDetected: 0,
    RecordsOccurancesDetected: 0,
    RecordsScanned: 0,
    ExtraData: { groupByParam: {} },
    createdTime: new Date().toISOString()
  }
}
export const validatePII = async (items: { [x: string]: any; Files: any }, piiScanObj: any) => {
  return new Promise(function (resolve, reject) {
    const scanFieldObj: any = {}
    // Get values to scan if they are new/modified values and not yet scanned.
    // Loop through each label in the `LABELSTOSCAN` array
    for (const label of LABELSTOSCAN) {
      if (
        label in items &&
        typeof items[label] === 'string' &&
        items[label]
      ) {
        // Check if the value is not already scanned for PII
        if (
          !(
            piiScanObj &&
            piiScanObj[label] &&
            piiScanObj[label].value === items[label]
          )
        ) {
          // Add the value to the `scanFieldObj` object with the label as the key
          scanFieldObj[label] = items[label]
        } 
        // else {
        //   // Remove the item from the `piiScanObj` object if it has already been scanned
        //   if (piiScanObj && piiScanObj[label]) {
        //     delete piiScanObj[label]
        //   }
        // }
      } else {
        // Remove the item from the `piiScanObj` object if it has already been scanned
        if (piiScanObj && piiScanObj[label]) {
          delete piiScanObj[label]
        }
      }
    }
    const fileArray = items.Files ? items.Files : []
    if (Array.isArray(fileArray) && fileArray.length > 0) {
      if (
        piiScanObj &&
        piiScanObj.FileArray &&
        Array.isArray(piiScanObj.FileArray.value) &&
        piiScanObj.FileArray.value.length > 0
      ) {
        piiScanObj.FileArray.value.forEach(function (fileObj: { isStillPresent: boolean }) {
          fileObj.isStillPresent = false
        })
      }
      // Now fill scanFieldObj.FileArray with only new File Instances
      scanFieldObj.FileArray = fileArray.reduce(function (
        acc,
        fileInstance
      ) {
        let isNewFileInstance = true
        if (
          piiScanObj &&
          piiScanObj.FileArray &&
          Array.isArray(piiScanObj.FileArray.value) &&
          piiScanObj.FileArray.value.length > 0
        ) {
          // find if this file instance is already scanned
          const fileObj = piiScanObj.FileArray.value.find(function (fileObj: { value: any; isStillPresent: boolean }) {
            if (fileObj.value === fileInstance) {
              fileObj.isStillPresent = true
              return true
            }
            return false
          })
          if (fileObj) {
            isNewFileInstance = false
          }
        }
        if (isNewFileInstance) {
          acc.push(fileInstance)
        }
        return acc
      },
        [])
      // Now check if we have to remove any File Instance from piiScanObj
      if (
        piiScanObj &&
        piiScanObj.FileArray &&
        Array.isArray(piiScanObj.FileArray.value) &&
        piiScanObj.FileArray.value.length > 0
      ) {
        piiScanObj.FileArray.value = piiScanObj.FileArray.value.filter(
          function (fileObj: { isStillPresent: any }) {
            const isStillPresent = fileObj.isStillPresent
            delete fileObj.isStillPresent
            return isStillPresent
          }
        )
      }
      // also delete from scanFieldObj if no new File Instances have been found
      if (scanFieldObj.FileArray.length === 0) {
        delete scanFieldObj.FileArray
      }
    } else {
      if (piiScanObj && piiScanObj.FileArray) {
        delete piiScanObj.FileArray
      }
    }
    // show old validations if there is no new data to scan
    if (Object.keys(scanFieldObj).length === 0) {
      resolve(piiScanObj)
    } else {
      PII.scanObject_v2(scanFieldObj).then(function (piiScanInstance: { [x: string]: any; FileArray: any }) {
        if (piiScanObj) {
          LABELSTOSCAN.forEach((label) => {
            if (piiScanInstance[label]) {
              piiScanObj[label] = piiScanInstance[label]
            }
          })
          if (piiScanInstance.FileArray) {
            piiScanObj.FileArray = piiScanInstance.FileArray
          }
        } else {
          piiScanObj = piiScanInstance
        }
        resolve(piiScanObj)
      })
    }
  })
}
// Function to check and add to the PII Audit Trail
export const shouldAddToPIIAuditTrail = async (piiScan: any) => {
  let foundResultsArray = false
  const fileArray = piiScan.FileArray

  if (piiScan && Object.keys(piiScan).length > 0) {
    if (fileArray && Array.isArray(fileArray.value)) {
      for (const item of fileArray.value) {
        if (item.resultsArray && Array.isArray(item.resultsArray) && item.resultsArray.length > 0) {
          foundResultsArray = true
          break
        }
      }
    }

    for (const key in piiScan) {
      // eslint-disable-next-line no-prototype-builtins
      if (piiScan.hasOwnProperty(key) && key !== 'FileArray' && piiScan[key].resultsArray?.length > 0) {
        foundResultsArray = true
        break
      }
    }

    return foundResultsArray
  }
}
export const addtoPIIAuditTrail = async (data: any, itemGUID: any, piiScan: any, AppID: any) => {
  const batchSize = 1000
  const filteredLabels = LABELSTOSCAN.filter(label => piiScan[label] && piiScan[label].resultsArray && piiScan[label].resultsArray?.length > 0)
  const totalLabelSize = filteredLabels.length
  let fileBatch = 0
  let fileBatchSize = 0
  const userdetails = await sp.web.currentUser.get()
  if (piiScan.FileArray && Array.isArray(piiScan.FileArray?.value)) {
    // eslint-disable-next-line no-unsafe-optional-chaining
    for (const item of piiScan.FileArray?.value) {
      if (item.resultsArray && Array.isArray(item.resultsArray) && item.resultsArray.length > 0) {
        fileBatch += 1
      }
    }
    fileBatchSize = fileBatch > batchSize ? batchSize : fileBatch
  }
  const totalSize = totalLabelSize + fileBatchSize
  try {
    for (let index = 0; index < totalSize; index += batchSize) {
      const auditBatch: never[] = []
      const addBatch = populateAddBatch({
        batch: auditBatch,
        filteredLabels: filteredLabels,
        piiScan: piiScan,
        data: data,
        labelCount: totalLabelSize,
        filecount: fileBatchSize,
        itemGUID: itemGUID,
        USER_ID: userdetails?.Id,
        start: index,
        AppID: AppID
      })
      if (addBatch.length > 0) {
        // await addBatch.execute()
        await addOrReplaceDataInListBatch(ListNames.PIIAUDITTRAIL, addBatch, userdetails)
      }
    }
  } catch (error: any) {
    console.log(error?.name)
  }
}
function populateAddBatch(options: { batch: any; filteredLabels: any; piiScan: any; data: any; labelCount: any; filecount: any; itemGUID: any; USER_ID: any; start: any; AppID: any }) {
  const {
    batch,
    filteredLabels,
    piiScan,
    data,
    labelCount,
    filecount,
    itemGUID,
    USER_ID,
    start = 0,
    AppID
  } = options
  for (let index = start; index < labelCount; index += 1) {
    const label = filteredLabels[index]
    const n = piiScan[label]
    if (piiScan && piiScan[label] && n.resultsArray && n.resultsArray.length > 0) {
      const listItem = {
        ItemGUID: itemGUID,
        UserAnswer: n.userAnswer,
        Comment: data,
        JsonResult: generatePIIAuditJson(n),
        FieldorFileName: label,
        EntityType: label,
        AppID: AppID,
        ItemCreated: getCurrentUTCDate(),
        ItemModified: getCurrentUTCDate(),
        ItemModifiedById: USER_ID,
        ItemCreatedById: USER_ID
      }
      if (listItem) {
        batch.push(listItem)
      }
    }
  }

  if (piiScan && piiScan.FileArray && piiScan.FileArray.value && piiScan.FileArray.value.length > 0) {
    const fileArray = piiScan.FileArray.value
    const checkfilecount = fileArray.length >= filecount ? fileArray.length : filecount
    for (let index = start; index < checkfilecount; index++) {
      if (index < fileArray.length) {
        const file = fileArray[index]
        if (file.resultsArray && file.resultsArray.length > 0) {
          const auditFileObj = {
            ItemGUID: itemGUID,
            UserAnswer: file.userAnswer,
            Comment: data,
            JsonResult: generatePIIAuditJson(file),
            FieldorFileName: file.value.name,
            DocumentPath: file.value.name,
            AppID: AppID,
            EntityType: 'File',
            ItemCreated: getCurrentUTCDate(),
            ItemModified: getCurrentUTCDate(),
            ItemModifiedById: USER_ID,
            ItemCreatedById: USER_ID
          }
          if (auditFileObj) {
            batch.push(auditFileObj)
          }
        }
      }
    }
  }
  return batch
}
function generatePIIAuditJson(piiScanItemObj: any) {
  const returnObj: any = {
    groupByParam: {}
  }
  if (piiScanItemObj && piiScanItemObj.findingsAggregationObj) {
    Object.keys(piiScanItemObj.findingsAggregationObj).forEach(function (formatKey) {
      const aggObj = piiScanItemObj.findingsAggregationObj[formatKey]
      if (aggObj && Object.prototype.hasOwnProperty.call(aggObj, 'count') && aggObj.formatText) {
        returnObj.groupByParam[formatKey] = {
          label: aggObj.formatText,
          occurences: aggObj.count
        }
      }
    })
  }
  return JSON.stringify(returnObj)
}
