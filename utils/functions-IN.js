import base64 from "./Base64";
// const { publicUrl } = env;
/**
 * Support only incoming urls, jumpurls ('/pathA')
 * type,
 * @param { url, type, status } params
 * @title Jump to third-party page title
 */
export const jumpUrl = async (params = {}, option = {}) => {
  let {
    title = "",
    jumpType,
    isLoading = true,
    openType = "insideWeb",
    isForceAgree = false,
    offerCode,
    needLogin = false,
    businessTypeObj = {},
    priorityChannel,
    sourceIconId = "",
    sourceExtraId = "",
    isNeedGPS = false,
    activityGid,
    noUrlRepeat = false,
    isNeedBack = 0,
    isLoginPopup = false,
    reLoad = () => {},
  } = option;
  if (openType === null || openType === undefined) {
    openType = "insideWeb";
  }

  let type = 1; // 1 push, 0 replace
  let url = "";
  let linkUrl = "";
  let exit = ""; //If it is blank, it is not logout. If the incoming '/logout' is logout, it is required to skip to the home page
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    url = params;
  } else {
    ({ type = 1, url = "", exit = "" } = params || {});
  }

  if (!(typeof url === "string" && (url.startsWith('http') || url.startsWith('finshell://'))) && isLoading) {
    Loading.showLoading();
  }

  const { pathname } = window.location;
  let pathUrl =
    (publicUrl ? pathname.replace("/naruto", "") : pathname) +
    window.location.search;

  let routeParams = storeUtil.getRouteParams() || {};
  let { pageId } = routeParams;

  console.log(businessTypeObj, "businessType==");

  if (globalModalHandler) {
    // Close modal if modal is open when redirecting
    globalModalHandler.close();
  }

  if (typeof url === "number") {
    storeUtil.setPageBackCount(url);
    storeUtil.setIsPageBack(true);
    storeUtil.setPrePathname(history.location.pathname);
    mars.iconClickTrack({
      [marsDoc.iconClick.fields.icon_id.field]:
        marsDoc.public_button.ele.acb_h5_back.eleId,
    });
    history.go(url);
    return;
  }

  
  let isLoan = typeof url === "string" && url.startsWith('/apiloan')
  let isBillDetail = typeof url === "string" && url.startsWith('/billDetail')
  let urlc = url.split('?')[0]
  if ([urlc, publicUrl + urlc, publicUrl + urlc + '/'].includes(pathname) && !noUrlRepeat) {    
    // if(storeUtil.getRefreshPage()){      
    //   // reload if needed
    //   history.go(0);      
    //   storeUtil.setRefreshPage(false)
    // }
    Loading.hideLoading()
    return
  }

  // force login
  if (
    (needLogin || isLoginPopup || ["/feedback", "/messageInfo"].includes(urlc)) &&
    !storeUtil.getUserGid()
  ) {
    linkUrl = isLoan ? goBullDog({
      type: 'credit',
      sourcePageId: pageId,
      sourceIconId,
      sourceExtraId,
    }) : url
    url = `/login?isLoan=${isLoan}`
    urlc = '/login'
    if(pathname === '/naruto/login'){
      type = 0
    }    
  }
    
  console.log(urlc, "url====");

  // agree show check
  if (
    !needLogin &&
    !isLoginPopup &&
    storeUtil.getIsFirstStart() &&
    (businessTypeObj.business_type === "LOAN_MARKET" || isForceAgree) &&
    checkShowAgree(params, {
      ...option,
      isForceAgree: true,
    })
  ) {
    return;
  }

  if (url !== "/appindex") setLocal("isUseApp", true);

  // need gps
  if (isNeedGPS) {
    dialogShow(() => {
      jumpUrl(params, {
        ...option,
        isNeedGPS: false,
      });
    });
    return;
  }

  //Whether to jump to the login page
  if (
    urlc === "/login" ||
    (urlc === "/logincode" && url.indexOf("source=system") > -1)
  ) {
    url =
      url +
      `${
        url.indexOf("?") > -1 ? "&" : "?"
      }sourcePageId=${pageId}&sourceIconId=${sourceIconId}&sourceExtraId=${sourceExtraId}`;
    storeUtil.setRegisterCon(null);
    storeUtil.setLocationPathname({
      url: exit ? "/index" : linkUrl || pathUrl,
      backUrl: pathUrl,
      title,
      openType,
      businessTypeObj,
      offerCode,
      priorityChannel,
      activityGid,
    });    
  }

  // apiloan
  if (isLoan) {
    if (storeUtil.getUserGid()) {
      try {
        let res = await Api.PreApiHome();
        console.log(res, "res==");

        let { defaultChannelInfo, hasOtp } = res;
        let { currentStatus } = defaultChannelInfo || {};
        if (!hasOtp) {
          storeUtil.setDefaultPhoneInput(storeUtil.getPhoneNoHide());
          jumpUrl(
            `/logincode?creditItemStatus=${currentStatus}&supplement=${true}&sourceIconId=${sourceIconId}&sourceExtraId=${sourceExtraId}`
          );
          return;
        } else {
          if ([0, 1].includes(currentStatus)) {
            setTitle(true);
            Loading.hideLoading();
            window.location.href = goBullDog({
              type: "credit",
              sourcePageId: pageId,
              sourceIconId,
              sourceExtraId,
            });
            return;
          } else if ([2, 3, 4, 5, 6, 7, 8, 9].includes(currentStatus)) {
            url = `/reviewing?sourcePageId=${pageId}&sourceIconId=${sourceIconId}&sourceExtraId=${sourceExtraId}`;
          }
        }
      } catch (error) {
        Loading.show(language.indexApiError);
      }
    }
  }

  // message push

  if(isBillDetail && (!url.includes('billerResponse'))){
    if(storeUtil.getUserGid()){
      const getParamValue = (paramName) => {
        const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
      const billerName = getParamValue('billerCategoryName')
      const billerId = getParamValue('billerId')
      try {
        let res = await handleBillTypeData(billerName)
        if(!(res?.length > 0)) return
        res.map((info)=>{
          if(info.billerId === billerId){
            storeUtil.setBillerMessage(info)
          }
        })
      } catch (error) {
        Loading.show(language.indexApiError)
      }
    }
  }

  if (url === '/setAutoPay'){
    Loading.hideLoading()
    crab.contentApp({
      type: 'takePay',
      data: {
        type: 'manage'
      },
    })
    url = '/'
  }

  if (title) {
    console.log(title, "storeUtil.setOpenViewTitle(title)");
    storeUtil.setOpenViewTitle(title);
  }

  if(url.includes('/transit_?type=InPoker')) {
    url = SYSTEM_URL + url + `&isDark=${storeUtil.getDarkTheme()}&user_gid=${storeUtil.getUserGid() || ''}&deviceId=${storeUtil.getDeviceId() || ''}&zuid_pre=${storeUtil.getZuidPre() || ''}&version=${storeUtil.getVersion() || ''}&version_name=${storeUtil.getVersionName() || ''}&b=${storeUtil.getBValue() || ''}&c=${storeUtil.getCValue() || ''}&ch=${storeUtil.getCHValue() || ''}&t=${storeUtil.getToken() || ''}&u=${getQueryString('u') || ''}`
  }

  if (typeof url === "string" && (url.startsWith('http') || url.startsWith('finshell://'))) {
    if (_isApp() && jumpType === 'webView') {
      if(isNeedBack === 1) {
        storeUtil.setIsPageBack(true)
        history.go(-1)
      }
      setTimeout(() => {
        OpenNewWebView({
          uniqueUrl: url,
          urlTitle: title,
          openType,
          priorityChannel,
        });
      }, 0)
      Loading.hideLoading();
    } else {      
      type === 0 ? window.location.replace(url) : (window.location.href = url);
      setTimeout(() => {
        Loading.hideLoading();
      }, 3000);
    }
  } else {
    console.log('realurl', url)
    storeUtil.setPrePathname(history.location.pathname);

    // Login Popup
    if (isLoginPopup && url.indexOf('/login') >= 0) {
      Loading.hideLoading()    
      openLoginModal({
        sourceIconId,
        sourceExtraId,
        sourcePageId: pageId,
        reLoad,
      });
    } else {
      type === 0 ? history.replace(url) : history.push(url);
    }
  }
};

export const jumpUrlReduce = async (params = {}, option = {}) => {
  let {
    title = "",
    jumpType,
    isLoading = true,
    openType = "insideWeb",
    isForceAgree = false,
    needLogin = false,
    sourceIconId = "",
    sourceExtraId = "",
    noUrlRepeat = false,
    isNeedBack = 0,
    isLoginPopup = false,
    reLoad = () => {},
  } = option;
  if (openType === null || openType === undefined) {
    openType = "insideWeb";
  }

  let type = 1; // 1 push, 0 replace
  let url = "";
  let linkUrl = "";
  let exit = ""; //If it is blank, it is not logout. If the incoming '/logout' is logout, it is required to skip to the home page
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    url = params;
  } else {
    ({ type = 1, url = "", exit = "" } = params || {});
  }

  const { pathname } = window.location;
  const path = publicUrl ? pathname.replace(publicUrl, "") : pathname
  let pathUrl = path + window.location.search;

  let { pageId } = storeUtil.getRouteParams() || {};

  let urlc
  if (typeof url !== 'number') {
    urlc = url.split('?')[0]
    if ([urlc, urlc + '/'].includes(path) && !noUrlRepeat) {
      Loading.hideLoading()
      return
    }
  }

  if (!(typeof url === "string" && (url.startsWith('http') || url.startsWith('finshell://'))) && isLoading) {
    Loading.showLoading();
  }

  // agree show check
  if (
    !needLogin &&
    !isLoginPopup &&
    storeUtil.getIsFirstStart() &&
    isForceAgree &&
    checkShowAgree(params, {
      ...option,
      isForceAgree: true,
    })
  ) {
    return;
  }

  // force login
  if ((needLogin || isLoginPopup) && !storeUtil.getUserGid()) {
    linkUrl = url
    url = `/login`
    if(path === '/login'){
      type = 0
    }
  }

  //Whether to jump to the login page
  if (
    url === "/login" ||
    (urlc === "/logincode" && url.indexOf("source=system") > -1)
  ) {
    url =
      url +
      `${
        url.indexOf("?") > -1 ? "&" : "?"
      }sourcePageId=${pageId}&sourceIconId=${sourceIconId}&sourceExtraId=${sourceExtraId}`;
    storeUtil.setRegisterCon(null);
    storeUtil.setLocationPathname({
      url: exit ? "/index" : linkUrl || pathUrl,
      backUrl: pathUrl,
      title,
      openType,
    });
  }

  if (title) {
    storeUtil.setOpenViewTitle(title);
  }

  // back
  if (typeof url === "number") {
    storeUtil.setPageBackCount(url);
    storeUtil.setIsPageBack(true);
    storeUtil.setPrePathname(history.location.pathname);
    mars.iconClickTrack({
      [marsDoc.iconClick.fields.icon_id.field]:
        marsDoc.public_button.ele.acb_h5_back.eleId,
    });
    history.go(url);
    return;
  }

  if (typeof url === "string" && (url.startsWith('http') || url.startsWith('finshell://'))) {
    if (_isApp() && jumpType === 'webView') {
      if(isNeedBack === 1) {
        storeUtil.setIsPageBack(true)
        history.go(-1)
      }
      setTimeout(() => {
        OpenNewWebView({
          uniqueUrl: url,
          urlTitle: title,
          openType,
        });
      }, 0)
      
      Loading.hideLoading();
    } else {
      type === 0 ? window.location.replace(url) : (window.location.href = url);
      setTimeout(() => {
        Loading.hideLoading();
      }, 3000);
    }
  } else {
    storeUtil.setPrePathname(history.location.pathname);
    // Login Popup
    if (isLoginPopup && url.indexOf('/login') >= 0) {
      Loading.hideLoading()    
      openLoginModal({
        sourceIconId,
        sourceExtraId,
        sourcePageId: pageId,
        reLoad,
      });
    } else {
      type === 0 ? history.replace(url) : history.push(url);
    }
  }
};

// exit: Whether to redirect to the home page
export const jumpLogin = (exit, type = 1, urlData = "", sourceIconId = "") => {
  jumpUrl(
    {
      url: "/login" + urlData,
      type,
      exit,
    },
    {
      sourceIconId,
    }
  );
};

/**
 * set title
 */
export const setTitle = (needBack) => {
  crab.title({
    url_title: "",
    dark: !storeUtil.getDarkTheme(),
    need_back: needBack,
    canScreen: true,
  });
};

/**
 * Judge whether it is in the app
 */
export const _isApp = function () {
  // Obtain UA information
  var userAgent = window.navigator.userAgent.toLowerCase();
  //Judge whether the ua contains the identity agreed with the app end
  if (userAgent.includes("app_cash")) {
    return true;
  } else {
    return false;
  }
};

/**
 * Get the value of str in url
 * @param str url Parameter name
 * @returns Value corresponding to str
 */
export const getQueryString = (str, path = "") => {
  let reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
  let search;
  if (path) {
    search = path.substring(path.indexOf("?"));
  } else {
    search = decodeURIComponent(window.location.search);
  }
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

/**
 * Timestamp conversion
 * cellValue: Incoming timestamp
 * eg: Jan 01 2000 16:00:00
 */
export function formatDate(cellValue, time = false, connect = ' ', changeMonth = true, options = {}) {
  let {
    hasDay= true,
    showAPM= false,
  } = options
  if (cellValue == null || cellValue == '') return ''
  var date = new Date(cellValue * 1000)
  var year = date.getFullYear()
  var month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var min =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var sec =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return (
    (hasDay ? day : '') +
    connect +
    (changeMonth ? language["month" + month] : month) +
    connect +
    year +
    (time ? ' ' + hour + ':' + min + ':' + sec : '') + 
    (showAPM ? hour <= 12 ? ' AM' : ' PM' : '')
  )
}

/**
 *
 * @param {*} obj
 * @returns
 */
export const isNullOrEmpty = function (obj) {
  var result =
    obj === null ||
    obj === undefined ||
    obj === "" ||
    obj === "null" ||
    typeof obj === "undefined" ||
    obj === "undefined";
  if (result && (obj !== 0 || obj !== "0")) {
    return result;
  } else {
    return false;
  }
};

//to base64
export const encodeBase64 = (str, isConvert = true) => {
  var encode = encodeURI(str);
  var res = base64.encode(isConvert ? encode : str);
  return res;
};

//to string
export const decodeBase64 = (value) => {
  var decode = base64.decode(value);
  var str = decodeURI(decode);
  return str;
};

/**
 * @param str number
 * @param symbolStr Money symbol
 * @param symbolStrIsPre Position true front， false after
 * @param Symbol
 * @param isHtml Add span label or not
 * @returns
 */
export const dealMoneyShow = (obj) => {
  let {
    str,
    symbolStr = "",
    symbolStrIsPre = true,
    isHtml = false,
    Symbol = ",",
  } = obj;

  const moneySymbol = symbolStr
    ? isHtml
      ? `<span>${symbolStr}</span>`
      : symbolStr
    : "";

  if (!str) {
    str = "0";
  } else {
    str = str + "";
    let len = str.length,
      str2 = "",
      max = Math.floor(len / 3);
    for (let i = 0; i < max; i++) {
      let s = str.slice(len - 3, len);
      str = str.substr(0, len - 3);
      str2 = Symbol + s + str2;
      len = str.length;
    }
    str += str2;
    if (len % 3 === 0) {
      str = str.slice(1);
    }
  }
  return symbolStrIsPre ? moneySymbol + str : str + moneySymbol;
};

/**
 * Check if it is legal
 * @param {*} str 
 * @param {*} type 
 * @returns 
 */
export const validate = (str, type) => {
  var reg;
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
    case 'password':
      reg = /^(?=.*[0-9\!@#\$%\^&\*])(?=.*[a-zA-Z]).{8,16}$/
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
  return reg.test(str);
};

// index resource error
export const defaultResourceImg = (isDark = "") => {
  if (isDark.toString() || storeUtil.getDarkTheme()) {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASoAAACqCAYAAAAa/QJDAAAAAXNSR0IArs4c6QAABw9JREFUeF7t3I1uVFUUBeB9+BMFUf4k+v5PJwiCFKHQHrMnp02pUzok0q44302axlLp6rd3Vs7cmWHUjtec80ZV3amqu1V1a33011wECBDYReC4qj6tj/dVdTjG6K9deo3LvmPO2aV0fxWUYroMzJ8TILCrQJdUF9bbMUYX2IXXhUW1TlBdUPeq6tJC2zWZ7yNAgMA5gVlVB6uwtp6wthbQOkU9rKrbSAkQIHBFAh+r6tW209W/imrO2eX0qKpuXlE4P4YAAQInAkdV9XKM0aV1en1WVOsk9VhJ2RoCBK5RoMvqj7Mnq9OiWvekuqQ83LvGCfnRBAhsBPpE1WW1uWd1tqgerGf3OBEgQCBBoJ8NfHNaVOsh31PP7iXMRgYCBJZAPxv4vB8Cbk5Uc86fq+oHPAQIEAgTeDfG+HOse1O/VJUXc4ZNSBwCBKrvUf3eRdVviemXI7gIECCQKPCyi8rDvsTRyESAwInAuy6qJ+vNxlgIECCQKHDYRfXMCzwTZyMTAQJL4KiL6jccBAgQSBZQVMnTkY0AgY2AorIIBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSICAorIDBAjECyiq+BEJSIBAF9WvVTVQECBAIFRgdlE9q6qboQHFIkCAwFEX1eOq+o4FAQIEQgU+dFE9qKr7oQHFIkCAwNsuqjtV9YQFAQIEQgVedFH1jfSnVXUrNKRYBAjsr8Cnqnq+ebZvznmvqn7aXwu/OQECoQKvxxgHJ0V1Yz38c6oKnZZYBPZQoE9TL8YYx6evn5pz3q2qR3uI4VcmQCBT4NUY4++O9tkLPeec/fCvHwa6CBAgcJ0CB2OM1ycBzhdV//fDqurTlYsAAQLXIfC+qvo0NbcWVX9xztn3q/pk9f11JPQzCRDYa4F+qNc30I/PKmx9j996ycKP62Gg9wHu9d745QlciUCfng6q6q+zJ6kLT1RnI60Xg/Yr1/tFoS4CBAh8C4HDqnozxujPW6+dTktzzn4vYN9k7887/T/f4rfxdxIg8L8R6BPUhz5FjTH68xevryqddf/qdlX1R/+LC30/y0WAAIFdBPq+01FVfeyP8/ehvvQXfFVR7ZLE9xAgQOC/FvgHeGJVq6e5/PoAAAAASUVORK5CYII=";
  } else {
    return "data:image/png;base64,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";
  }
};

/**
 * localstorage
 */
export const timeStorage = {
  set(key, value, options = {}) {
    let { time, mode } = options;
    try {
      if (!window.localStorage) {
        return null;
      }
      if (!time || isNaN(time)) {
        time = 12;
      }
      let endTime = new Date();
      if(mode === 'today') {
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(0, 0, 0, 0);
        endTime = endTime.getTime();
      } else {
        endTime = endTime.getTime() + time * 60 * 60 * 1000
      }
      window.localStorage.setItem(
        key,
        JSON.stringify({ data: value, time: endTime })
      );
    } catch (e) {
      return null;
    }
  },
  get(key) {
    try {
      if (!window.localStorage || !window.localStorage.getItem(key)) {
        return null;
      }
      const result = JSON.parse(window.localStorage.getItem(key));
      const now = new Date().getTime();
      if (now > result.time) {
        this.remove(key);
        return null;
      }
      return result.data;
    } catch (e) {
      this.remove(key);
      return null;
    }
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
};

export const InputScroll = (
  dom,
  type = "focus",
  btndom,
  scaleCount = 4,
  paddingBottom = 0
) => {
  if (InputScrollVersion()) {
    console.log(dom, type, btndom, "====");
    let bodyHeight = window.screen.height;
    if (type === "focus") {
      setTimeout(() => {
        btndom.scrollIntoView();
      }, 100);
      // dom.paddingBottomDEF= (dom.style.paddingBottom || '0' ).replace('px', '')
      dom.style.paddingBottom = bodyHeight / scaleCount + "px";
    } else {
      dom.style.paddingBottom = paddingBottom + "px";
    }
  }
};

export const setSession = (key, value) => {
  return sessionStorage.setItem(key, value);
};

export const getSession = (key) => {
  return sessionStorage.getItem(key);
};

export const removeSession = (key) => {
  return sessionStorage.removeItem(key);
};

export const copyContent = (value, callback, callbackSu) => {
  if (storeUtil.getIsExpMode() || !_isApp()) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    if (callback) callback();
  } else {
    crab.contentAppSync(
      "copyText",
      {
        type: "copyText",
        text: value,
      },
      (result) => {
        if (callback) {
          callback(result.isSuccess);
        } else {
          if (result.isSuccess) {
            Loading.show(language.v_copy_suc, null, "bottom");
            if (callbackSu) callbackSu();
          } else {
            Loading.show(language.v_copy_fail, null, "bottom");
          }
        }
      }
    );
  }
};

// set timeout
export const timeout = {
  showTimeout(callback = () => {}, time, timer) {
    if (!this[timer]) {
      this[timer] = setTimeout(callback, time);
    }
  },
  clearTimeout(timer) {
    if (Object.prototype.toString.call(timer) === "[object String]") {
      clearTimeout(this[timer]);
      this[timer] = null;
    } else if (Object.prototype.toString.call(timer) === "[object Array]") {
      timer.map((item) => {
        clearTimeout(this[item]);
        this[item] = null;
      });
    }
  },
};

export const setLocal = (key, value) => {
  window.localStorage.setItem(key, value);
};

export const getLocal = (key) => {
  return window.localStorage.getItem(key);
};

export const removeLocal = (key) => {
  window.localStorage.removeItem(key);
};

export const getChannelAbtestTag = (res = {}) => {
  let { channelList = [] } = res;
  let abtestTag = "";
  channelList.map((item) => {
    if (item.abtestTag) {
      abtestTag += item.abtestTag;
    }
    (item.entityList || []).map((info) => {
      (info.resourceList || []).map((value) => {
        if (value.abtestTag) {
          abtestTag += value.abtestTag;
        }
      });
    });
  });
  return abtestTag;
};

export const getClickAbtestTag = (res = [], values) => {
  let channelGid = values && values.channelGid;
  let resourceGid = values && values.resourceGid;
  let abtestTag = "";
  res.map((item) => {
    if (item.channelGid === channelGid) {
      if (item.abtestTag) {
        abtestTag += item.abtestTag;
      }
      (item.entityList || []).map((value) => {
        (value.resourceList || []).map((info) => {
          if (info.resourceGid === resourceGid) {
            if (info.abtestTag) {
              abtestTag += info.abtestTag;
            }
          }
        });
      });
    }
  });
  return abtestTag;
};

export const setAppTabStatus = (status = false, selectedIndexTab = storeUtil.getSelectedIndexTab()) => {
  console.log('setAppTabStatus:', status)
  //status-- false: show, true: hide
  if(isShowAppIndex()) {
    storeUtil.setIsHideAppTab(status)
    crab.contentAppSync('updateIndexTab',{
      isShowIndexTab: !status,
      selectedIndexTab,
    })
    // setTimeout(() => {
    //   storeUtil.setIsHideAppTab(status)
    // }, 0)
    // storeUtil.setIsHideAppTab(status)
  }  
};

/**
 * handle loan amount
 * 如果數字後 6 位全為 0，簡寫為 "Crore"（千萬單位，常用於印度）
 * @param {*} amount 
 * @param {*} isAmountSymbol 
 * @param {*} isAbbreviation 
 * @returns 
 */
export const formatAmount = (
  amount,
  isAmountSymbol = false,
  isAbbreviation = true
) => {
  let str = amount.toString();
  let len = str.length;
  let result;
  if (len < 6) {
    // result = amount.toLocaleString();
    result = str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    if (len >= 8) {
      if (parseInt(str.substr(len - 6, 6)) === 0) {
        let num = amount / 10000000;
        let isFixed = Number.isInteger(num) ? 0 : 1;
        result = (amount / 10000000).toFixed(isFixed) + " " + language.Crore;
      } else {
        result = amount.toLocaleString();
      }
    } else {
      if (parseInt(str.substr(len - 5, 5)) === 0 && isAbbreviation) {
        result = amount / 100000 + " " + language.Lakh;
      } else {
        result = str.substring(0, len - 5) + "," + str.substring(len - 5, len);
        result =
          result.substring(0, len - 2) +
          "," +
          result.substring(len - 2, len + 1);
          result = amount / 100000 + " " + language.Lakh;
      }
    }
  }

  return (isAmountSymbol ? language.RS : "") + result;
};

export const getMonthYear = (time) => {
  const date = new Date(time * 1000);
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return day + "/" + month + "/" + date.getFullYear();
};

export const getListValue = (value1, value2, num1, num2) => {
  const DAYSELECT = [
    { value: "D7", label: "7" },
    { value: "D14", label: "14" },
    { value: "D21", label: "21" },
    { value: "D30", label: "30" },
    { value: "P1", label: "1" },
    { value: "P2", label: "2" },
    { value: "P3", label: "3" },
    { value: "P4", label: "4" },
    { value: "P6", label: "6" },
    { value: "P9", label: "9" },
    { value: "P12", label: "12" },
    { value: "P18", label: "18" },
    { value: "P24", label: "24" },
    { value: "P36", label: "36" },
    { value: "P48", label: "48" },
    { value: "P60", label: "60" },
    { value: "P72", label: "72" },
    { value: "P84", label: "84" },
    { value: "P96", label: "96" },
    { value: "P108", label: "108" },
    { value: "P120", label: "120" },
  ];
  if ((num1 === 30 && num2 === 31) || (num1 === 31 && num2 === 30))
    return "30" + language.newDay;
  if (num2 > num1) {
    let con1, con2;
    DAYSELECT.map((item) => {
      if (item.value === value1) {
        con1 = item.label;
      } else if (item.value === value2) {
        con2 = item.label;
      }
    });
    if (num1 < 31 && num2 < 31) {
      return con1 + "-" + con2 + " " + language.newDay;
    } else if (num1 >= 31 && num2 >= 31) {
      return con1 + "-" + con2 + " " + language.newStage;
    } else {
      return con1 + language.newDay + "-" + con2 + language.newStage;
    }
  } else if (num2 < num1) {
    let con1, con2;
    DAYSELECT.map((item) => {
      if (item.value === value1) {
        con1 = item.label;
      } else if (item.value === value2) {
        con2 = item.label;
      }
    });
    if (num1 < 31 && num2 < 31) {
      return con2 + "-" + con1 + " " + language.newDay;
    } else if (num1 >= 31 && num2 >= 31) {
      return con2 + "-" + con1 + " " + language.newStage;
    } else {
      return con2 + language.newDay + "-" + con1 + language.newStage;
    }
  } else {
    let con1;
    DAYSELECT.map((item) => {
      if (item.value === value1) {
        con1 = item.label;
      }
    });
    if (num1 < 31) {
      return con1 + language.newDay;
    } else {
      return con1 + language.newStage;
    }
  }
};

export const handleFormatDate = (start, end) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);

  const startDay = startDate.getDate();
  const startMonth = months[startDate.getMonth()];
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = months[endDate.getMonth()];
  const endYear = endDate.getFullYear();

  return {
    startDay: (startDay > 9 ? "" : "0") + startDay,
    startMonth: startMonth,
    startYear: startYear,
    endDay: (endDay > 9 ? "" : "0") + endDay,
    endMonth: endMonth,
    endYear: endYear,
  };
};

export const handleEnTime = (start, end) => {
  const date1 = new Date(start * 1000);
  const date2 = new Date(end * 1000);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
  };
  const startNew = date1.toLocaleDateString("en-IN", options);
  const endNew = date2.toLocaleDateString("en-IN", options);

  const startTime = date1.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "numeric",
  });
  const endTime = date2.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "numeric",
  });

  const formattedRange = `${startNew} ${startTime} - ${endNew} ${endTime}`;
  return formattedRange;
};

/**
 *
 * @param {*} timestamp
 * eg: 2023-08-28 13:58:00
 * @returns
 */
export const formatTimestamp = (timestamp) => {
  var date = new Date(timestamp * 1000);

  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var hour = ('0' + date.getHours()).slice(-2);
  var minute = ('0' + date.getMinutes()).slice(-2);
  var second = ('0' + date.getSeconds()).slice(-2);

  var formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

  return formattedDate;
}

export const handleFormatNumDate = (start, end) => {

  const startDate = new Date(start * 1000);
  const endDate = new Date(end * 1000);

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;
  const startYear = startDate.getFullYear();

  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth() + 1;
  const endYear = endDate.getFullYear();

  return {
    startDay: (startDay > 9 ? "" : "0") + startDay,
    startMonth: (startMonth > 9 ? "" : "0") + startMonth,
    startYear: startYear,
    endDay: (endDay > 9 ? "" : "0") + endDay,
    endMonth: (endMonth > 9 ? "" : "0") + endMonth,
    endYear: endYear,
  };
};


/**
 * Open Login Modal
 */

// Global handler for the modal
export let globalModalHandler = null;
export let isDefaultHideAppTab = false;

// Custom onClose function that accepts a callback
function onCloseEvent({
  sourceIconId,
  sourceExtraId,
  sourcePageId,
}) {

  if(!isDefaultHideAppTab){
    setAppTabStatus()
  }

  mars.iconClickTrack({
    icon_id: marsDoc.acv_login_popup.ele.acb_close_login.eleId,
    source_page_id: sourcePageId,
    source_icon_id: sourceIconId,
    source_extra_id: sourceExtraId,
  })
  // Reset the handler when modal is closed
  globalModalHandler = null;
}

// Function to open the login modal and pass a custom onClose function
export const openLoginModal = ({
  sourceIconId,
  sourceExtraId,
  sourcePageId,
  reLoad,
}) => {  

  isDefaultHideAppTab = storeUtil.getIsHideAppTab()

  if(!isDefaultHideAppTab){
    setAppTabStatus(true)
  }

  mars.iconClickTrack({
    icon_id: marsDoc.acv_login_popup.ele.acb_open_login.eleId,
    source_page_id: sourcePageId,
    source_icon_id: sourceIconId,
    source_extra_id: sourceExtraId,
  })

  globalModalHandler = Modal.show({
    // closeOnMaskClick: true,
    className: "login-pop-modal",
    bodyClassName: "login-popup-content-container",
    content: (
      <LoginPop
        getPopupHandler={() => globalModalHandler}
        isDark={true}
        sourceIconId={sourceIconId}
        sourceExtraId={sourceExtraId}
        sourcePageId={sourcePageId}
        reLoad={reLoad}
      />
    ),
    onClose: () => onCloseEvent({
      sourceIconId,
      sourceExtraId,
      sourcePageId,
    }),
  });
}
