/* eslint-disable camelcase */
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/lists'
import { IFileAddResult } from '@pnp/sp/files'
import '@pnp/sp/folders'
import { DOCUMENT_LIBRARY_SELECT_COLUMNS, ListNames } from '../configuration'

import { I_SharePointPersonOrGroup } from '../shared/interfaces/SharePoint.interface'

const pnpGetFolder = async (GUID: string) => {
  const path = `${ListNames.DOCUMENT_LIBRARY}/${GUID}`
  const folder = sp.web.getFolderByServerRelativePath(path)
  const result = await folder.select('Exists').get()
  return result.Exists
    ? folder
    : sp.web.folders.addUsingPath(path).then((newFolder) => newFolder.folder)
}

export const pnpAddFiles = async (RequirementGUID: string, files: File[], columnData: any, currentUser: I_SharePointPersonOrGroup | null) => {
  const pnpFolder = await pnpGetFolder(RequirementGUID)
  const pnpFiles = pnpFolder.files
  const itemContext = (isNew: boolean, file: File) => {
    function updateItemContext () {
      return {
        ItemModified: new Date(),
        ItemModifiedById: currentUser?.Id
      }
    }
    const context = updateItemContext()
    return isNew
      ? {
          ...context,
          DocumentTitle: file.name,
          ItemCreated: context.ItemModified,
          ItemCreatedById: context.ItemModifiedById
        }
      : context
  }

  const result = files.map(async (file: File) => {
    const columns = {
      ...columnData,
      ...itemContext(true, file)
    }
    // small upload
    if (file.size <= 10485760) {
      return pnpFiles.addUsingPath(file.name, file, { Overwrite: true })
        .then((newFile: IFileAddResult) => newFile.file.getItem())
        .then(item => item.update(columns))
    }
    // large upload
    return pnpFiles.addChunked(file.name, file, undefined, true)
      .then((newFile: IFileAddResult) => newFile.file.getItem())
      .then(item => item.update(columns))
  })

  return Promise.all(result)
}

export const pnpDeleteFiles = async (GUID: string, filenames: string[], folderName: string) => {
  const path = `${_spPageContextInfo.webServerRelativeUrl}/${ListNames.DOCUMENT_LIBRARY}/${GUID}/${folderName}/`
  const result = filenames.map((filename: string) => sp.web.getFileByServerRelativeUrl(path + filename).delete())
  return Promise.all(result)
}

export const pnpGetFolderItems = async (GUID: string) => {
  const path = `${ListNames.DOCUMENT_LIBRARY}/${GUID}`

  let files = []
  try {
    files = await sp.web.getFolderByServerRelativePath(path).files.get()
  } catch (e) {
    console.error(e)
    return []
  }

  const items = files.map(async (file) => {
    try {
      const fileItem = await sp.web.getFileByServerRelativeUrl(file.ServerRelativeUrl).getItem()
        .then(item => item.select(DOCUMENT_LIBRARY_SELECT_COLUMNS)
          .expand('ItemCreatedBy, ItemModifiedBy').get())
      return fileItem
    } catch (e) {
      console.error(e)
    }
  })

  const filteredItems = (await Promise.all(items)).filter(item => item)
  return filteredItems
}

export const createFolder = async (path : string,folderName: string) =>{
  await sp.web.getFolderByServerRelativePath(path).folders.addUsingPath(folderName)
}