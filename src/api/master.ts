/* eslint-disable camelcase */
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import '@pnp/sp/files'
import '@pnp/sp/folders'
// utility
import { getList } from './helpers'
// constants
import { ListNames, MASTERLIST_SELECT_COLUMNS } from '../configuration'
import { I_Master } from '../shared/interfaces'
export const fetchAllMasterItems = async (): Promise<Array<I_Master>> => {
  const list = await getList(ListNames.MASTERLIST)
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
    .select(MASTERLIST_SELECT_COLUMNS)
    .expand('ItemCreatedBy, ItemModifiedBy, AttachmentFiles')
    .getAll()
  items.sort(function (a : any, b : any) {
    return new Date(b.ItemModified).valueOf() - new Date(a.ItemModified).valueOf()
  })
  return items
}
export const getItemByID = async (id: string) => {
  try {
    const list = await getList(ListNames.MASTERLIST)
    if (list instanceof Error) {
      console.error(list.message) // Log the error message
      return null
    }
    const items = await list.items()
    const matchingItem = items.find((item) => item.ItemGUID === id)
    return matchingItem
  } catch (error) {
    console.error('An error occurred:', error)
    return null
  }
}
