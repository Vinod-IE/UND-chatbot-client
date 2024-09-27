/* eslint-disable camelcase */
import {
  I_ItemMetadata
} from './metadata.interface'
import { I_SharePointDefaults, I_SharePointPersonOrGroup } from './SharePoint.interface'
import {
  sp_YesNo,
  sp_SingleLineOfText,
  sp_MultipleLinesOfText,
  sp_Choice,
  sp_Number,
  sp_DateTime,
  sp_PersonOrGroup
} from '../types'

export interface I_Master extends I_SharePointDefaults, I_ItemMetadata {
    ItemGUID: sp_SingleLineOfText<0, 255>
}

export interface I_History extends I_SharePointDefaults, I_ItemMetadata {
    ItemGUID: sp_SingleLineOfText<0, 255>
}

export interface I_TeamMember extends I_SharePointDefaults, I_ItemMetadata {
    ItemGUID: sp_SingleLineOfText<0, 255>
    TeamMembers: sp_PersonOrGroup<'Multi'>
}

export interface I_Discussion extends I_SharePointDefaults, I_ItemMetadata {
    ItemGUID: sp_SingleLineOfText<0, 255>
    Subject: sp_SingleLineOfText<0, 255>
    Comment: sp_MultipleLinesOfText
    IsActionComment: sp_YesNo
    ParentCommentID: sp_SingleLineOfText<0, 255>
    UserRole: sp_SingleLineOfText<0, 255>
    DocumentName: sp_SingleLineOfText<0, 255>
    ItemCreatedBy: ItemCreatedByType
    ItemModifiedBy: ItemCreatedByType
}

type ItemCreatedByType = {
    Title: string
}
