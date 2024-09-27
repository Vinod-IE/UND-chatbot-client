/* eslint-disable camelcase */
import { sp } from '@pnp/sp'
import '@pnp/sp/fields'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/views'
import '@pnp/sp/webs'
import { I_SharePointPersonOrGroup } from '../shared/interfaces/SharePoint.interface'
import { loadPageContext } from 'sp-rest-proxy/dist/utils/env'
// constants
import { getSiteURLFromPageContext, getSiteURLFromPageContextSettings } from '../shared/utility'

// Ensure list exists
export const getList = async (listName: string) => {
  try {
    const list = sp.web.lists.getByTitle(listName)
    return list
  } catch (error: any) {
    return new Error(`List with name '${listName}' not found.`)
  }
}

export const getLibrary = async (listName: string) => {
  try {
    const list = sp.web.getFolderByServerRelativeUrl(listName)
    return list
  } catch (error: any) {
    return new Error(`List with name '${listName}' not found.`)
  }
}
export const getFile = async (filepath: string) => {
  try {
    const file = await sp.web.getFileByServerRelativeUrl(filepath).getItem()
    return file
  } catch (error: any) {
    return new Error(`file with name '${filepath}' not found.`)
  }
}

export async function addOrReplaceDataInListBatch<T extends object>(listName: string, data: Array<T> | T, userInfo: I_SharePointPersonOrGroup, overwriteMetaData?: boolean) {
  if (!userInfo) {
    return
  }
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContextSettings(pageContext)
    }
  })
  if(overwriteMetaData) {
    await deleteAllItemsInListBatch(listName)
  }
  console.log(`Adding items to ${listName}`)

  const listResult = await getList(listName)
    .catch(error => {
      console.error('An error occurred:', error)
      return error
    })

  try {
    const batch = sp.web.createBatch() // Create a batch object

    if (!Array.isArray(data)) {
      data = [data]
    }

    for (const object of data) {
      const objectCopy: T = { ...object }
      if (('ID' in objectCopy)) {
        const item: T = await listResult.items.getById(objectCopy.ID)().catch((error: Error) => { console.log(error) })
        if (item) {
          await listResult.items.getById(objectCopy.ID).delete()
        }
      }

      if (!('ItemCreatedById' in objectCopy) || !('ItemCreated' in objectCopy)) {
        throw new Error('ItemCreatedById or ItemCreated field is missing')
      }

      objectCopy.ItemCreatedById = userInfo.Id
      objectCopy.ItemCreated = new Date().toISOString()
      sp.web.lists.getByTitle(listName).items.inBatch(batch).add(objectCopy) // Add add operation to batch
    }

    await batch.execute() // Execute the batch
  } catch (error) {
    console.error('An error occurred:', error)
    throw error
  }
}

// function to add item in a list and replace the item if a matching ID already exists
export async function addOrReplaceDataInList<T extends object>(listName: string, data: Array<T> | T, userInfo: I_SharePointPersonOrGroup) {
  if (!userInfo) {
    return
  }
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  console.log(`Adding items to ${listName}`)
  const listResult = await getList(listName)
    .catch(error => {
      console.error('An error occurred:', error)
      return error
    })
  const resultArray = []
  if (listResult instanceof Error) {
    console.error(listResult.message) // Log the error message
  } else if (listResult) {
    if (!Array.isArray(data)) {
      data = [data]
    }
    for (const object of data) {
      const objectCopy = { ...object }
      if (('ID' in objectCopy)) {
        const item: T = await listResult.items.getById(objectCopy.ID)().catch((error: Error) => { console.log(error) })
        if (item) {
          await listResult.items.getById(objectCopy.ID).delete()
        }
      }
      if (!('ItemCreatedById' in objectCopy)) {
        throw new Error('ItemCreatedById field is missing')
      }
      if (!('ItemCreated' in objectCopy)) {
        throw new Error('ItemCreatedById field is missing')
      }
      objectCopy.ItemCreatedById = userInfo.Id
      objectCopy.ItemCreated = new Date().toISOString()
      const result = await listResult.items.add(objectCopy).catch((error: Error) => { console.log(error) })
      if (result) resultArray.push(result)
    }
    return resultArray
  }
}
export async function deleteAllItemsInListBatch(listName: string) {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContextSettings(pageContext)
    }
  })
  try {
    const batch = sp.web.createBatch()
    const list = sp.web.lists.getByTitle(listName)
    let items = await list.items.top(5000).get()
    while (items?.length > 0) {
      items.forEach(async (item) => {
        await list.items.getById(item.Id).inBatch(batch).delete()
      })
      await batch.execute()
      items = await list.items.top(5000).get()
    }
  } catch (error) {
    console.log('Error deleting items', error)
  }
}