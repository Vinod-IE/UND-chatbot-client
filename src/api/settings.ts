/* eslint-disable camelcase */
import { ANNOUNCEMENTS_SELECT_COLUMNS, BANNER_SELECT_COLUMNS, CALENDAR_SELECT_COLUMNS, HELPDESK_SELECT_COLUMNS, KNOWLEDGEGRAPH_SELECT_COLUMNS, LOGO_SELECT_COLUMNS, ListNames, MASTERLIST_SELECT_COLUMNS, POC_SELECT_COLUMNS, POLICY_MEMO_SELECT_COLUMNS, QANDA_SELECT_COLUMNS, QUICKLINKS_SELECT_COLUMNS, RELEASE_NOTES_SELECT_COLUMNS, SITE_FEEDBACK_ABOUT_SELECT_COLUMNS, SITE_FEEDBACK_SELECT_COLUMNS, TOOLTIPS_SELECT_COLUMNS } from '../configuration'
import { I_Announcement, I_KnowledgeGraph, I_Calendar, I_PointOfContact, I_QuickLink, I_QandA, I_HelpDesk, I_PolicyMemo, I_Banner, I_Logo, I_ReleaseNotes } from '../shared/interfaces'
import { I_SiteFeedback, I_SiteFeedbackAbout, I_ToolTips } from '../shared/interfaces/Settings.interface'
import { SettingsCollection } from '../shared/types'
import { getList, getLibrary } from './helpers'
import '@pnp/sp/fields'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/views'
import '@pnp/sp/webs'
import { compareDates, isQuotaExceededError, siteName } from '../Global'
import { loadPageContext } from 'sp-rest-proxy/dist/utils/env'
import { COMMONMETADATA_SELECT_COLUMNS } from '../configuration'
export const fetchQuickLinks = async (): Promise<Array<I_QuickLink>> => {
  const list = await getList(ListNames.QUICK_LINK)
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
    .select(QUICKLINKS_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchFewQuickLinks = async (): Promise<Array<I_QuickLink>> => {
  const list = await getList(ListNames.QUICK_LINK)
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
    .select(QUICKLINKS_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .orderBy('ItemCreated', false)
    .top(20)
    .get()
  return items
}
export const fetchCalendarEvents = async (): Promise<Array<I_Calendar>> => {
  const list = await getList(ListNames.CALENDAR)
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
    .select(CALENDAR_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.Modified).valueOf() - new Date(a.Modified).valueOf()
  })
  return items
}

export const fetchAnnouncements = async (): Promise<Array<I_Announcement>> => {
  const list = await getList(ListNames.ANNOUNCEMENT)
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
    .select(ANNOUNCEMENTS_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchFewAnnouncements = async (): Promise<Array<I_Announcement>> => {
  const list = await getList(ListNames.ANNOUNCEMENT)
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
    .select(ANNOUNCEMENTS_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .orderBy('ItemModified', false)
    .top(20)
    .get()
  return items
}
export const fetchKnowledgeGraphs = async (): Promise<Array<I_KnowledgeGraph>> => {
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
export const fetchFewKnowledgeGraphs = async (): Promise<Array<I_KnowledgeGraph>> => {
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
    .top(30)
    .get()

  return items
}
export const fetchPOCs = async (): Promise<Array<I_PointOfContact>> => {
  const list = await getList(ListNames.POINT_OF_CONTACT)
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
    .select(POC_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchFewPOCs = async (): Promise<Array<I_PointOfContact>> => {
  const list = await getList(ListNames.POINT_OF_CONTACT)
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
    .select(POC_SELECT_COLUMNS )
    .expand('ItemCreatedBy, ItemModifiedBy')
    .orderBy('ItemModified', false)
    .top(10)
    .get()
  return items
}
export const fetchQandA = async (): Promise<Array<I_QandA>> => {
  const list = await getList(ListNames.QANDA)
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
    .select(QANDA_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchFewQandA = async (): Promise<Array<I_QandA>> => {
  const list = await getList(ListNames.QANDA)
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
    .select(QANDA_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .orderBy('ItemModified', false)
    .top(20)
    .get()
  return items
}
export const fetchHelpDesk = async (): Promise<Array<I_HelpDesk>> => {
  const list = await getList(ListNames.HELPDESK)
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
    .select(HELPDESK_SELECT_COLUMNS )
    .expand('ItemCreatedBy, ItemModifiedBy')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchSiteFeedback = async (): Promise<Array<I_SiteFeedback>> => {
  const list = await getList(ListNames.FEEDBACK)
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
    .select(SITE_FEEDBACK_SELECT_COLUMNS )
    .expand('ItemCreatedBy, ItemModifiedBy', 'AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchSiteFeedbackAbout = async (): Promise<Array<I_SiteFeedbackAbout>> => {
  const list = await getList(ListNames.FEEDBACK_ABOUT_METADATA)
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
    .select(SITE_FEEDBACK_ABOUT_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .orderBy('ItemModified', false)
    .top(5000)
    .get()
  return items
}
export const fetchCommonMetadata = async () => {
  await loadPageContext()
  const oldmodifieddate = localStorage.getItem('commonMetadata_LMDate' + siteName) || ''
  const list = await getList(ListNames.COMMON_METADATA)
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
  const top1 = await list?.items.select('ItemModified')
    .top(1)
    .get()
  const needToUpdate = compareDates(top1?.[0]?.ItemModified, oldmodifieddate)
  if (needToUpdate) {
    const items = await list?.items
    .select(COMMONMETADATA_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .orderBy('ItemModified', false)
    .top(5000)
    .get().then(function (item: any) {
      try {
        localStorage.setItem('commonMetadata' + siteName, JSON.stringify(item))
        localStorage.setItem('commonMetadata_LMDate' + siteName, top1?.[0]?.ItemModified)
      } catch (err) {
        if (isQuotaExceededError(err)) {
          // Handle the case where there wasn't enough space to store the
          // item in localStorage.
          localStorage.setItem('commonMetadata_LMDate' + siteName, '')
        } else {
          console.log(err)
        }
      }
    })
    return items
  } else {
    const items: any = (localStorage.getItem('commonMetadata' + siteName) !== undefined && localStorage.getItem('commonMetadata' + siteName) !== '' && localStorage.getItem('commonMetadata' + siteName) !== null ? JSON.parse(localStorage.getItem('commonMetadata' + siteName) || '{}') : [])
       return items
  }
}
export const fetchToolTips = async (): Promise<Array<I_ToolTips>> => {
  const list = await getList(ListNames.TOOLTIP)
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
    .select(TOOLTIPS_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy', 'AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}

export const fetchPolicyMemo = async (): Promise<Array<I_PolicyMemo>> => {
  const list = await getLibrary(ListNames?.POLICY_MEMO)
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
  const itemsfolders = await list?.folders
    .select(POLICY_MEMO_SELECT_COLUMNS)
    .expand('listItemAllFields', 'Author', 'Editor', 'ListItemAllFields/FieldValuesAsText', 'Folders', 'Files', 'Files/Author', 'Files/ModifiedBy', 'Folders/ListItemAllFields/FieldValuesAsText', 'Folders/Files', 'Folders/Files/ListItemAllFields', 'Folders/Folders/Files/ListItemAllFields', 'Folders/Folders/Files/Author', 'Folders/Folders/Files/ModifiedBy', 'Folders/Files/ListItemAllFields/FieldValuesAsText', 'Folders/ListItemAllFields', 'Files/ListItemAllFields'
    )
    .get()
  const itemsfiles = await list?.files
    .select(POLICY_MEMO_SELECT_COLUMNS)
    .expand('listItemAllFields', 'Author', 'Editor', 'ListItemAllFields/FieldValuesAsText', 'Folders', 'Files', 'Files/Author', 'Files/ModifiedBy', 'Folders/ListItemAllFields/FieldValuesAsText', 'Folders/Files', 'Folders/Files/ListItemAllFields', 'Folders/Folders/Files/ListItemAllFields', 'Folders/Folders/Files/Author', 'Folders/Folders/Files/ModifiedBy', 'Folders/Files/ListItemAllFields/FieldValuesAsText', 'Folders/ListItemAllFields', 'Files/ListItemAllFields'
    )
    .get()
  const items = itemsfolders.concat(itemsfiles)
  return items
}
export const fetchFilesbasedOnGUID = async (ItemGUID : string): Promise<Array<I_PolicyMemo>> => {
  const list = await getLibrary(ListNames.DOCUMENT_LIBRARY + '/' + ItemGUID)
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
    const itemsfolders = await list?.folders
    .select(
      '*',
      'DocumentTitle',
      'IsFormFile',
      'ItemCreatedBy/Title',
      'ItemModifiedBy/Title')
    .expand('listItemAllFields', 'Author', 'Editor', 'ListItemAllFields/FieldValuesAsText', 'Folders', 'Files', 'Files/Author', 'Files/ModifiedBy', 'Folders/ListItemAllFields/FieldValuesAsText', 'Folders/Files', 'Folders/Files/ListItemAllFields', 'Folders/Folders/Files/ListItemAllFields', 'Folders/Folders/Files/Author', 'Folders/Folders/Files/ModifiedBy', 'Folders/Files/ListItemAllFields/FieldValuesAsText', 'Folders/ListItemAllFields', 'Files/ListItemAllFields'
    )
    .get()
  return itemsfolders
}
export const fetchClassificationBanner = async (): Promise<Array<I_Banner>> => {
  const list = await getList(ListNames.CLASSIFICATION_BANNER)
    .then(result => {
      if (result instanceof Error) {
        console.error(result.message)
      } else {
        return result
      }
    })
    .catch(error => {
      return error
    })
  const items = await list?.items
    .select(BANNER_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy')
    .orderBy('ItemModified', false)
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchLogo = async (): Promise<Array<I_Logo>> => {
  const list = await getList(ListNames.LOGO)
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
    .select(LOGO_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy,AttachmentFiles')
    .orderBy('ItemModified', false)
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const fetchReleaseNotes = async (): Promise<Array<I_ReleaseNotes>> => {
  const list = await getList(ListNames.RELEASE_NOTES)
  .then(result => {
    if(result instanceof Error) {
      console.error(result.message)
    } else {
      return result
    }
  })
  .catch(error=> {
    console.error('An error occured:', error)
    return error
  })
  const items = await list?.items
  .select(RELEASE_NOTES_SELECT_COLUMNS)
  .expand('ItemCreatedBy, ItemModifiedBy')
  .orderBy('ItemModified', false)
  .top(5000)
  .get()
  return items
}
export const fetchAll = async (settingsObject: SettingsCollection, objectName? : string): Promise<SettingsCollection> => {
  const updatedSettings: SettingsCollection = JSON.parse(JSON.stringify(settingsObject))
  if (objectName !== '') {
    switch (objectName) {
      case 'announcements': updatedSettings.announcements = await fetchAnnouncements()
        break
      case 'knowledgegraphs': updatedSettings.knowledgegraphs = await fetchKnowledgeGraphs()
        break
      case 'calendar': updatedSettings.calendar = await fetchCalendarEvents()
        break
      case 'quickLinks': updatedSettings.quickLinks = await fetchQuickLinks()
        break
      case 'pointsOfContact': updatedSettings.pointsOfContact = await fetchPOCs()
        break
      case 'qanda': updatedSettings.qanda = await fetchQandA()
        break
      case 'helpdesk': updatedSettings.helpdesk = await fetchHelpDesk()
        break
      case 'sitefeedback': updatedSettings.sitefeedback = await fetchSiteFeedback()
        break
      case 'tooltips': updatedSettings.tooltips = await fetchToolTips()
        break
      case 'policyMemo': updatedSettings.policyMemo = await fetchPolicyMemo()
        break
      case 'siteFeedbackAbout': updatedSettings.siteFeedbackAbout = await fetchSiteFeedbackAbout()
        break
      case 'bannertext': updatedSettings.bannertext = await fetchClassificationBanner()
        break
      case 'logo': updatedSettings.logo = await fetchLogo()
        break
      case 'releaseNotes': updatedSettings.releaseNotes = await fetchReleaseNotes()
    }
    // updatedSettings.quickLinks = await fetchQuickLinks()
  } else {
    updatedSettings.announcements = await fetchAnnouncements()
    updatedSettings.knowledgegraphs = await fetchKnowledgeGraphs()
    updatedSettings.calendar = await fetchCalendarEvents()
    updatedSettings.quickLinks = await fetchQuickLinks()
    updatedSettings.pointsOfContact = await fetchPOCs()
    updatedSettings.qanda = await fetchQandA()
    updatedSettings.helpdesk = await fetchHelpDesk()
    updatedSettings.sitefeedback = await fetchSiteFeedback()
    updatedSettings.tooltips = await fetchToolTips()
    updatedSettings.policyMemo = await fetchPolicyMemo()
    updatedSettings.siteFeedbackAbout = await fetchSiteFeedbackAbout()
    updatedSettings.bannertext = await fetchClassificationBanner()
    updatedSettings.logo = await fetchLogo()
    updatedSettings.releaseNotes = await fetchReleaseNotes()
  }
  // updatedSettings.reviewMeetingSchedule = await fetchReviewMeetingSchedule()
  return updatedSettings
}

