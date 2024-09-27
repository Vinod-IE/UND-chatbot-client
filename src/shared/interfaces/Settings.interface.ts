/* eslint-disable camelcase */
import { I_SharePointDefaults, I_ItemMetadata } from './SharePoint.interface'
import {
  sp_YesNo,
  sp_SingleLineOfText,
  sp_MultipleLinesOfText,
  sp_Choice,
  sp_DateTime,
  sp_Number
} from '../types'

interface I_SettingsDefaults {
    IsArchived: sp_YesNo
}

export interface I_Calendar extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    EventDate: sp_DateTime
    EventType:sp_Choice<'Single'>
    EventTitle: sp_SingleLineOfText<0, 255>
    EventLocation: sp_SingleLineOfText<0, 255>
    EventTime: sp_DateTime
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_QuickLink extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Title: sp_SingleLineOfText<0, 255>
    Info: sp_MultipleLinesOfText
    URL: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_Announcement extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Title: sp_SingleLineOfText<0, 255>
    Description: sp_MultipleLinesOfText
    Tags: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_KnowledgeGraph extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Title: sp_SingleLineOfText<0, 255>
    Description: sp_MultipleLinesOfText,
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
    Tags: sp_SingleLineOfText<0, 255>
}
type ItemCreatedByType = {
    Title: string
}
export interface I_PointOfContact extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    ContactName: sp_SingleLineOfText<0, 255>
    ContactTitle: sp_SingleLineOfText<0, 255>
    ContactEmail: sp_SingleLineOfText<0, 255>
    ContactPhone?: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_ReviewMeetingSchedule extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    FiscalYear: sp_SingleLineOfText<0, 4>
    Quarter: sp_SingleLineOfText<0, 2>
    ReviewDate: sp_DateTime
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_QandA extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Answer: sp_MultipleLinesOfText
    Question: sp_MultipleLinesOfText
    Description: sp_MultipleLinesOfText
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_HelpDesk extends I_SharePointDefaults, I_ItemMetadata {
    EmailAddress: sp_SingleLineOfText<0, 255>
    PhoneNo: sp_SingleLineOfText<0, 255>
    hoursOfOperation: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_SiteFeedback extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Message: sp_SingleLineOfText<0, 255>
    FeedBackAbout: sp_MultipleLinesOfText
    Subject: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_SiteFeedbackAbout extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Title: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_CommonMetadata extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Title: sp_SingleLineOfText<0, 255>
    MetaDataType:sp_SingleLineOfText<0, 255>
    MetaDataValue:sp_SingleLineOfText<0, 255>
    InternalCode:sp_Number
    MataDataDescription:sp_MultipleLinesOfText
    AllowEdit:sp_YesNo
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_ToolTips extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    LabelName: sp_SingleLineOfText<0, 255>
    TooltipDescription: sp_MultipleLinesOfText
    ToolTipID: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}

export interface I_PolicyMemo extends I_SharePointDefaults, I_ItemMetadata {
    link: any
    Title: sp_SingleLineOfText<0, 255>
    FolderName: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
    Name: string,
    Files:any
}
export interface I_Banner extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    Classificationmessage: string,
    classificationcolor: any,
    TextColor: any,
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}
export interface I_Logo extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
    AttachmentFiles?: any
}
export interface I_ReleaseNotes extends I_SharePointDefaults, I_ItemMetadata, I_SettingsDefaults {
    VersionName: sp_SingleLineOfText<0, 255>
    NewFeatures: sp_MultipleLinesOfText
    ResolvedIssues: sp_MultipleLinesOfText
    KnownIssues: sp_MultipleLinesOfText
    ItemCreatedBy: ItemCreatedByType,
    ItemModifiedBy: ItemCreatedByType
}