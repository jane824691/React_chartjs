## 失業認定統計

首先，可以下載後以下列指令安裝環境並運行
```bash
npm i
# and
npm run dev
```

## 展示畫面
![ezgif-2-e018182a91](https://github.com/jane824691/React_chartjs/assets/147688970/98be8465-1235-49e0-a8bf-5b5fbc01d908)



 - 一開啟瀏覽器首頁即自動導向/chartJs頁面, 或以navbar的按鈕router.push來進行切換畫面
 - 可觀看串聯[政府資料開放平臺](https://data.gov.tw/dataset/44759) api帶出的所有月份資料
 - 將chartjs套件生成的圖表 & 報表存成元件component
 - 將串聯的api資料以props傳進元件裡再帶出所有資料 詳見所有月份資料 `pages/chartJs/index.js`
 - 也可觀看將Json格式內存於專案資料夾再導入資料的方式, 詳見個別月份頁面 `pages/chartJs/jan.js`
 - SASS以全域設定的方式運行, 詳見 `styles/globals.scss`


## 環境
使用 [Next.js](https://nextjs.org/)，並以 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 來運行。

