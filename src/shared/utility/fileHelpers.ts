import { ACCEPTABLE_FILE_TYPES } from '../../configuration'

export const getFileExtension = (file: File): string => {
  const fileName = file.name
  const ext = fileName.split('.').pop()
  return ext || ''
}

export const getFileExtensionByFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop()
  return ext || ''
}
export const isAcceptableFileType = (fileName: string) => {
  const data = ACCEPTABLE_FILE_TYPES?.includes(getFileExtensionByFileName(fileName))
  return data
}
export const trimBeforeExtension = (fileName: string) => {
  const parts = fileName.split('.')
  const extension = parts.pop()
  const nameWithoutExtension = parts.join('.').trim()
  return `${nameWithoutExtension}.${extension}`
}
export const compareArraysOfFiles = (initialFiles: Array<File>, newFiles: Array<File>): [Array<File>, Array<File>] => {
  const removedFiles: File[] = []
  const newAddedFiles: File[] = []

  initialFiles.forEach((initialFile) => {
    const found = newFiles.some((newFile) => {
      return (
        newFile.name === initialFile.name &&
                newFile.size === initialFile.size &&
                newFile.type === initialFile.type
      )
    })

    if (!found) {
      removedFiles.push(initialFile)
    }
  })

  newFiles.forEach((newFile) => {
    const found = initialFiles.some((initialFile) => {
      return (
        newFile.name === initialFile.name &&
                newFile.size === initialFile.size &&
                newFile.type === initialFile.type
      )
    })

    if (!found) {
      newAddedFiles.push(newFile)
    }
  })

  return [removedFiles, newAddedFiles]
}

export const downloadFile = (file: File) => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(file)
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getContentType = (file: File): string => {
  return file.type
}
