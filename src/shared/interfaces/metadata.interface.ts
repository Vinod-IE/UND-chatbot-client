/* eslint-disable camelcase */
import {
  sp_YesNo,
  sp_DateTime,
  sp_PersonOrGroup
} from '../types'

export interface I_ItemMetadata {
    ItemModified?: sp_DateTime | null
    ItemCreated: sp_DateTime
    ItemCreatedById: sp_PersonOrGroup<'Single'>
    ItemModifiedById?: sp_PersonOrGroup<'Single'> | null
}

interface I_MetadataDefaults {
    IsArchived: sp_YesNo
}
