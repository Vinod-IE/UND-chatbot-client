import { stringOfLength } from './typeHelpers'
import { nthIndex, encodeHTML, decodeHTML, removehtmltags } from './stringHelpers'
import { useWindowDimensions } from './sizeHelpers'
import {
  getFileExtension,
  getFileExtensionByFileName,
  compareArraysOfFiles,
  downloadFile,
  getContentType
} from './fileHelpers'

import {
  scrollToTop
} from './scollHelpers'

export {
  scrollToTop
}
export { stringOfLength }

export {
  nthIndex,
  encodeHTML,
  decodeHTML,
  removehtmltags
}

export { useWindowDimensions }

export {
  getFileExtension,
  getFileExtensionByFileName,
  compareArraysOfFiles,
  downloadFile,
  getContentType
}

export const getPublicURL = () => {
  return window.location.hostname === 'localhost' ? '/' : '../SiteAssets/'
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const getSiteRelativeURLFromPageContext = (pageContext: any): string => {
  return window.location.hostname === 'localhost' ? '' : pageContext.siteServerRelativeUrl
}

export const getSiteURLFromPageContext = (pageContext: any): string => {
  return window.location.hostname === 'localhost' ? pageContext.__siteAbsoluteUrl : pageContext.siteAbsoluteUrl
}
export const getSiteURLFromPageContextSettings = (pageContext: any): string => {
  return window.location.hostname === 'localhost' ? pageContext.__siteAbsoluteUrl : pageContext.webAbsoluteUrl
}
export const encrypt = (text: string, key: number) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key)
  }
  return result
}

export const decrypt = (text: string, key: number) => {
  return encrypt(text, key) // XOR encryption is its own inverse
}
