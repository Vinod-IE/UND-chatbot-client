
// helper function to give Excel-style column letter from number
export const excelColumnName = (value: number) => {
  value = value + 1 // +1 as excel is 1-indexed
  const divmod = (a: any, b: any) => {
    const remainder = a % b
    const aIsInfinite = a === -Infinity || a === Infinity
    const bIsInfinite = b === -Infinity || b === Infinity
    const aIsNeg = a + 1 / a < 0
    const bIsNeg = b + 1 / b < 0
    return [
      (aIsInfinite !== bIsInfinite && a) ? aIsInfinite ? NaN : aIsNeg === bIsNeg ? 0 : -1 : Math.floor(a / b),
      (!a && b < 0) ? -0 : remainder + (remainder !== 0 && aIsNeg !== bIsNeg ? b : 0)
    ]
  }
  let columnName = ''
  let q = value
  let r = 0
  while (q > 0) {
    const values = divmod((q - 1), 26)
    q = values[0]
    r = values[1]
    columnName = String.fromCharCode(r + 'A'.charCodeAt(0)) + columnName
  }
  return columnName
}

// helper function for checking if current row is column header row
export const determineColumnHeaderRow = (columnHeaders: any, rowData: any, index: number) => {
  const numColumns = Object.keys(columnHeaders).length
  for (let i = 0; i < numColumns; i++) {
    const columnName = rowData[index + i]
    if (columnName === null) {
      return false
    }
    if (!(columnName === Object.values(columnHeaders)[i])) {
      return false
    }
  }
  return true
}
