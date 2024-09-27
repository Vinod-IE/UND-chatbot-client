/* eslint-disable camelcase */
import { ISiteUserInfo } from '@pnp/sp/site-users/types'
import {
  sp_SingleLineOfText,
  sp_Number,
  sp_DateTime,
  sp_PersonOrGroup,
  sp_PersonOrGroupTitle
} from '../types'

export interface I_SharePointDefaults {
    ID?: sp_Number
    Title?: sp_SingleLineOfText<0, 255>
}
export interface I_ItemMetadata {
  ItemModified?: sp_DateTime | null
  ItemCreated: sp_DateTime
  ItemCreatedById: sp_PersonOrGroup<'Single'>
  ItemModifiedById?: sp_PersonOrGroup<'Single'> | null
  ItemCreatedTitle :sp_PersonOrGroupTitle<'Single'> | null
}
export type I_SharePointPersonOrGroup = ISiteUserInfo
