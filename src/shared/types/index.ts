/* eslint-disable camelcase */
/* eslint-disable comma-spacing */
// interfaces
import { I_Announcement, I_KnowledgeGraph, I_Calendar, I_PointOfContact, I_QuickLink, I_ReviewMeetingSchedule, I_QandA, I_HelpDesk, I_PolicyMemo, I_Master, I_Banner, I_Logo } from '../interfaces'
// constants
import { FetchStatus, Display, Submission } from '../../configuration'
import { I_ReleaseNotes, I_SiteFeedback, I_SiteFeedbackAbout, I_ToolTips } from '../interfaces/Settings.interface'

/// / global types
// TODO: Uncomment the stringoflength once erd is finalized, then write validations for data to conform to type
// export type StringOfLength<Min, Max> = string & {
//     min: Min
//     max: Max
//     readonly StringOfLength: unique symbol // this is the phantom type
// }
export type StringOfLength<Min, Max> = string

export type RGB = `rgb(${number}, ${number}, ${number})`
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
export type HEX = `#${string}`
export type Color = RGB | RGBA | HEX

export type Position = {
    x: number
    y: number
}

// Type that, when passed a union of keys, creates an object which
// cannot have those properties
export type Impossible<K extends keyof any> = {
    [P in K]: never
}

// window
declare global {
    interface Window { _spPageContextInfo: SPContext }
}

// sharepoint context
// add more properties as needed
export type SPContext = {
    webAbsoluteUrl: string
    siteAbsoluteUrl: string
    __siteAbsoluteUrl: string
    siteServerRelativeUrl: string
    webTitle?: string
}

// Provide it the type that contains only the properties you want,
// and then a type that extends that type, based on what the caller provided
// using generics.
export type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>

/// / process flow metadata type
export type ProcessFlowType = keyof any

/// / Backend call status types
export type FetchStatusType = typeof FetchStatus[keyof typeof FetchStatus]

/// / Display types
export type DisplayType = typeof Display[keyof typeof Display]

/// / Submission types
export type SubmissionType = typeof Submission[keyof typeof Submission]

/// / Security group excel file
export type SecurityGroupInfo = {
    Title?: string
    Description?: string
    PermissionLevels?: Array<string>
    ViewMembership?: boolean
    EditMembership?: boolean
    GroupOwners?: string
}

/// / File Error types
export type FileError = {
    fileName: string
    message: string
}

/// / Form Error types
export type FormError = {
    fieldName: string
    message: string
}

/// / sharepoint types
export enum sp_PrincipalType {
    'None' = 0, // Enumeration whose value specifies no principal type
    'User' = 1, // Enumeration whose value specifies a user
    'DistributionList' = 2, // Enumeration whose value specifies a distribution list
    'SecurityGroup' = 4, // Enumeration whose value specifies a security group
    'SharePointGroup' = 8, // Enumeration whose value specifies a group
    'All' = 15 // Enumeration whose value specifies all principal types
}

export type sp_YesNo = boolean
export type sp_SingleLineOfText<Min, Max> = StringOfLength<Min, Max>
export type sp_MultipleLinesOfText = string
export type sp_Choice<SingleOrMulti extends 'Single' | 'Multi'> =
    SingleOrMulti extends 'Single' ? string :
    {
        results: Array<string>
    }
export type sp_Number = number
export type sp_DateTime = string
export type sp_PersonOrGroup<SingleOrMulti extends 'Single' | 'Multi'> =
    SingleOrMulti extends 'Single' ? number :
    {
        results: Array<number> // User/Groups ids as an array of numbers
    }
export type sp_PersonOrGroupTitle<SingleOrMulti extends 'Single' | 'Multi'> =
    SingleOrMulti extends 'Single' ? string :
    {
        results: Array<string> // User/Groups ids as an array of numbers
    }

/// / list info
export interface ListInfo<I> {
    ListName: string | null
    ListData: Array<I> | null
}
export type extractListInfoType<Type> = Type extends ListInfo<infer X> ? X : never

export type SettingsCollection = {
    calendar: Array<I_Calendar>
    quickLinks: Array<I_QuickLink>
    announcements: Array<I_Announcement>
    knowledgegraphs: Array<I_KnowledgeGraph>
    pointsOfContact: Array<I_PointOfContact>
    reviewMeetingSchedule: Array<I_ReviewMeetingSchedule>
    qanda: Array<I_QandA>
    helpdesk: Array<I_HelpDesk>
    policyMemo: Array<I_PolicyMemo>
    sitefeedback: Array<I_SiteFeedback>
    tooltips: Array<I_ToolTips>
    siteFeedbackAbout: Array<I_SiteFeedbackAbout>
    bannertext: Array<I_Banner>
    logo: Array<I_Logo>
    releaseNotes: Array<I_ReleaseNotes>
}
export type masterCollection = {
    allItems: Array<I_Master>
}

export type StatusToRoleMapping = {
    [status in sp_SingleLineOfText<0, 255>]?: string[]
}
