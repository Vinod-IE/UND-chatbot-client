/* eslint-disable camelcase */
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
// types
import { I_SharePointPersonOrGroup } from '../shared/interfaces/SharePoint.interface'
// utility
import { getList } from './helpers'
// constants
import { DISCUSSIONLIST_SELECT_COLUMNS, ListNames } from '../configuration'

export const fetchAllDiscussion = async (ItemGUID: string) => {
  const list = await getList(ListNames.DISCUSSION)
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
    .select(DISCUSSIONLIST_SELECT_COLUMNS)
    .filter(`ItemGUID eq '${ItemGUID}'`)
    .expand('ItemCreatedBy, ItemModifiedBy, UserRole')
    .orderBy('ItemCreated', false)
    .get()
  return items
}

export const saveDiscussion = async (discussion: any, userInfo: I_SharePointPersonOrGroup | null) => {
  if (!userInfo) {
    return
  }
  const listResult = await getList(ListNames.DISCUSSION)
    .catch(error => {
      console.error('An error occurred:', error)
      return error
    })
  if (listResult instanceof Error) {
    console.error(listResult.message) // Log the error message
  } else if (listResult) {
    discussion.ItemCreatedById = userInfo.Id
    discussion.ItemCreated = new Date()
    const data = await listResult.items.add(discussion)
    return data.data
  }
}
