export const nthIndex = (str: string, pat: string, n: number) => {
  const L = str.length; let i = -1
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i)
    if (i < 0) break
  }
  return i
}

// handling scripts in the input fileds
const WHITE_LIST_REGEX = /[^\w. _\-$#/:()&,@;\n\r]/gi

export const encodeHTML = function (str: string) {
  return str.replace(WHITE_LIST_REGEX, function (c) {
    return '&#' + c.charCodeAt(0) + ';'
  })
}

export const decodeHTML = function (str: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

export const removehtmltags = function (data: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'text/html')
  return doc.body.textContent || ''
}
