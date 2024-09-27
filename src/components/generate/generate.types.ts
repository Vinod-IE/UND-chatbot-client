import { SPContext } from '../../shared/types'

export type LoadingSampleData = {
    POC: boolean
    Calendar: boolean
    QuickLink: boolean
    addFolder: boolean
}
declare global {
    interface Window { _spPageContextInfo: SPContext }
}
export type SPContext1 = {
    webAbsoluteUrl: string
    siteAbsoluteUrl: string
    __siteAbsoluteUrl: string
    siteServerRelativeUrl: string
}
