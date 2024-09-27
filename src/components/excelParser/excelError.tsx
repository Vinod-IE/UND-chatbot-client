import React, { useEffect, useState } from 'react'

const ExcelError = ({ errorString, key }: { errorString: string, key: number }) => {
  const [errorType, setErrorType] = useState<string>('')
  const [tableName, setTableName] = useState<string>('')
  const [row, setRow] = useState<string>('')
  const [col, setCol] = useState<string>('')

  const parseErrorString = (error: string) => {
    const data = error.split('::')
    setErrorType(data[0])
    const tableData = data[1].trim().split(':')
    setTableName(tableData[0].trim().split(' ')[1])
    const tableMetadata = tableData[1].trim().split(' ')
    setRow(tableMetadata[1])
    setCol(tableMetadata[3])
  }

  useEffect(() => {
    parseErrorString(errorString)
  }, [errorString])

  return (
        <div className='excelError'>
            <div id='info'>Table: <span>{tableName}</span></div>
            <div id='info'>Row: <span>{row}</span></div>
            <div id='info'>Column: <span>{col}</span></div>
            <p>{errorType}</p>
        </div>
  )
}

export default ExcelError
