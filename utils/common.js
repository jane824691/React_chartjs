import base64 from './Base64'

/**
 * Timestamp conversion
 * eg: 2023/11/30
 */
export const getMonthYear = (time) => {
  const date = new Date(time * 1000)
  const month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return date.getFullYear() + '/' + month + '/' + day
}

/**
 * Timestamp conversion
 * cellValue: Incoming timestamp
 * eg: Jan 01 2000 16:00:00
 */
export function formatDate(
  cellValue,
  time = false,
  connect = ' ',
  changeMonth = true,
  options = {}
) {
  let { hasDay = true, showAPM = false } = options
  if (cellValue == null || cellValue == '') return ''
  var date = new Date(cellValue * 1000)
  var year = date.getFullYear()
  var month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return (
    (changeMonth ? month : '') +
    connect +
    (hasDay ? day : '') +
    connect +
    year +
    (time ? ' ' + hour + ':' + min + ':' + sec : '') +
    (showAPM ? (hour <= 12 ? ' AM' : ' PM') : '')
  )
}

/**
 *
 * @param {*} timestamp
 * eg: 2023-08-28 13:58:00
 * @returns
 */
export const formatTimestamp = (timestamp) => {
  var date = new Date(timestamp * 1000)

  var year = date.getFullYear()
  var month = ('0' + (date.getMonth() + 1)).slice(-2)
  var day = ('0' + date.getDate()).slice(-2)
  var hour = ('0' + date.getHours()).slice(-2)
  var minute = ('0' + date.getMinutes()).slice(-2)
  var second = ('0' + date.getSeconds()).slice(-2)

  var formattedDate =
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

  return formattedDate
}

/**
 *
 * @param {*} timestamp
 * handleFormatDate(1736188800, 1736352000)
 * eg: {
  startYear: 2025,
  startMonth: 'Jan',
  startDay: '06',
  endYear: 2025,
  endMonth: 'Jan',
  endDay: '08'
}
 * @returns
 */
export const handleFormatDate = (start, end) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const startDate = new Date(start * 1000)
  const endDate = new Date(end * 1000)

  const startDay = startDate.getDate()
  const startMonth = months[startDate.getMonth()]
  const startYear = startDate.getFullYear()

  const endDay = endDate.getDate()
  const endMonth = months[endDate.getMonth()]
  const endYear = endDate.getFullYear()

  return {
    startYear: startYear,
    startMonth: startMonth,
    startDay: (startDay > 9 ? '' : '0') + startDay,
    endYear: endYear,
    endMonth: endMonth,
    endDay: (endDay > 9 ? '' : '0') + endDay,
  }
}

/**
 *
 * @param {*} timestamp
 * eg: daysSince(1736188800) // 2025-01-06T00:00:00Z
 * {
  day: 1,
  isProgress: true
}
 * @returns
 */
export const daysSince = (time = 0) => {
  const currentTime = new Date().getTime() / 1000
  const daysDifference = Math.floor((time - currentTime) / (60 * 60 * 24))
  return {
    day: daysDifference,
    isProgress: time - currentTime > 0, //Boolean
  }
}

/**
 * translate timestamp into Start & End date time
 * eg: "Dec 1 10:00 - Dec 1 11:00"
 * @param {*} timestamp
 * @returns Value corresponding to str
 */
export const handleEnTime = (start, end) => {
  const date1 = new Date(start * 1000)
  const date2 = new Date(end * 1000)

  const options = {
    timeZone: 'Asia/Taipei',
    year: undefined, // hide
    month: 'numeric', //or EN 'short'
    day: 'numeric',
  }

  // 將月份放在日期前
  const startDate = date1
    .toLocaleDateString('zh-TW', options)
    .replace('月', '月 ')
  const endDate = date2.toLocaleDateString('zh-TW', options).replace('月', '月 ')

  // 時間格式選項
  const startTime = date1.toLocaleTimeString('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: 'numeric',
    minute: 'numeric',
  })
  const endTime = date2.toLocaleTimeString('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: 'numeric',
    minute: 'numeric',
  })

  const formattedRange = `${startDate} ${startTime} - ${endDate} ${endTime}`
  return formattedRange
}
;``

/**
 * Get the value of str in url
 * @param str url Parameter name
 * @returns Value corresponding to str
 */
export const getQueryString = (str, path = '') => {
  let reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i')
  let search
  if (path) {
    search = path.substring(path.indexOf('?'))
  } else {
    search = decodeURIComponent(window.location.search)
  }
  let r = search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

/**
 *
 * @param {*} obj
 * @returns
 * console.log(isNullOrEmpty(null));         // true
console.log(isNullOrEmpty(undefined));    // true
console.log(isNullOrEmpty(""));           // true
console.log(isNullOrEmpty("null"));       // true
console.log(isNullOrEmpty("undefined"));  // true
console.log(isNullOrEmpty(0));            // false
console.log(isNullOrEmpty("0"));          // false
console.log(isNullOrEmpty([]));           // false (陣列不是空值)
console.log(isNullOrEmpty({}));           // false (物件不是空值)
console.log(isNullOrEmpty(false));        // false (布林值不是空值)
console.log(isNullOrEmpty("some text"));  // false (有效字串)
console.log(isNullOrEmpty(" "));          // false (空白字串，不在函式判定範圍內)
 */
export const isNullOrEmpty = function (obj) {
  var result =
    obj === null ||
    obj === undefined ||
    obj === '' ||
    obj === 'null' ||
    typeof obj === 'undefined' ||
    obj === 'undefined'
  if (result && (obj !== 0 || obj !== '0')) {
    return result
  } else {
    return false
  }
}

//to base64
export const encodeBase64 = (str, isConvert = true) => {
  var encode = encodeURI(str)
  var res = base64.encode(isConvert ? encode : str)
  return res
}

//to string
export const decodeBase64 = (value) => {
  var decode = base64.decode(value)
  var str = decodeURI(decode)
  return str
}

/**
 * @param str number is ok
 * @param symbolStr Money symbol
 * @param symbolStrIsPre Position true front, false after
 * @param Symbol
 * @param isHtml Add span label or not
 * @returns
 */
export const dealMoneyShow = (obj) => {
  let {
    str,
    symbolStr = '',
    symbolStrIsPre = true,
    isHtml = false,
    Symbol = ',',
  } = obj

  const moneySymbol = symbolStr
    ? isHtml
      ? `<span>${symbolStr}</span>`
      : symbolStr
    : ''

  if (!str) {
    str = '0'
  } else {
    str = str + ''
    let len = str.length,
      str2 = '',
      max = Math.floor(len / 3)
    for (let i = 0; i < max; i++) {
      let s = str.slice(len - 3, len)
      str = str.substr(0, len - 3)
      str2 = Symbol + s + str2
      len = str.length
    }
    str += str2
    if (len % 3 === 0) {
      str = str.slice(1)
    }
  }
  return symbolStrIsPre ? moneySymbol + str : str + moneySymbol
}

/**
 * Check if it is legal
 * @param {*} str
 * @param {*} type
 * @returns
 */
export const validate = (str, type) => {
  var reg
  // eslint-disable-next-line default-case
  switch (type) {
    case 'number':
      reg = /^[0-9]*$/
      break
    case 'num_Str':
      reg = /^[a-zA-Z0-9]*$/
      break
    case 'phone':
      reg = /^[6-9]\d{9}$/
      break
    case 'password': // at least 1 num || !@#$%^&*, within upper or lower letter, length between 8~16
      // reg = /^(?=.*[0-9\!@#\$%\^&\*])(?=.*[a-zA-Z]).{8,16}$/
      reg = /^(?=.*[0-9!@#$%^&*])(?=.*[a-zA-Z]).{8,16}$/
      break
    case 'strongPassword':
      reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\p{P}\p{S}])(?!.*\s).{3,}$/u
      break
    case 'string':
      reg = /[a-zA-Z]/
      break
    case 'specialString':
      reg = /[^a-zA-Z0-9]/
      break
    case 'onlyNumber':
      reg = /\d/
      break
    case 'numberPoint':
      reg = /^\d+(\.\d{0,2})?$/
      break
  }
  return reg.test(str)
}

/**
 * localstorage
 */
export const timeStorage = {
  set(key, value, options = {}) {
    let { time, mode } = options
    try {
      if (!window.localStorage) {
        return null
      }
      if (!time || isNaN(time)) {
        time = 12
      }
      let endTime = new Date()
      if (mode === 'today') {
        endTime.setDate(endTime.getDate() + 1)
        endTime.setHours(0, 0, 0, 0)
        endTime = endTime.getTime()
      } else {
        endTime = endTime.getTime() + time * 60 * 60 * 1000
      }
      window.localStorage.setItem(
        key,
        JSON.stringify({ data: value, time: endTime })
      )
    } catch (e) {
      return null
    }
  },
  get(key) {
    try {
      if (!window.localStorage || !window.localStorage.getItem(key)) {
        return null
      }
      const result = JSON.parse(window.localStorage.getItem(key))
      const now = new Date().getTime()
      if (now > result.time) {
        this.remove(key)
        return null
      }
      return result.data
    } catch (e) {
      this.remove(key)
      return null
    }
  },
  remove(key) {
    window.localStorage.removeItem(key)
  },
}

export const setSession = (key, value) => {
  return sessionStorage.setItem(key, value)
}

export const getSession = (key) => {
  return sessionStorage.getItem(key)
}

export const removeSession = (key) => {
  return sessionStorage.removeItem(key)
}

export const setLocal = (key, value) => {
  window.localStorage.setItem(key, value)
}

export const getLocal = (key) => {
  return window.localStorage.getItem(key)
}

export const removeLocal = (key) => {
  window.localStorage.removeItem(key)
}

// fit in 3↑ groups timeout
export const timeout = {
  showTimeout(callback = () => {}, time, timer) {
    if (!this[timer]) {
      this[timer] = setTimeout(callback, time)
    }
  },
  clearTimeout(timer) {
    if (Object.prototype.toString.call(timer) === '[object String]') {
      clearTimeout(this[timer])
      this[timer] = null
    } else if (Object.prototype.toString.call(timer) === '[object Array]') {
      timer.map((item) => {
        clearTimeout(this[item])
        this[item] = null
      })
    }
  },
}

// for debounce 防抖 0.3s
export const debounceClick = (callback = () => {}, time = 300) => {
  let lastExecutedTime = 0

  return () => {
    const currentTime = Date.now()
    if (currentTime - lastExecutedTime >= time) {
      callback()
      lastExecutedTime = currentTime
    }
  };
}