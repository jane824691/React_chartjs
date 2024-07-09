import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
// import { persistor } from './tools/persistor'
import store from './tools/store'
import '@/styles/globals.scss'
import '@/styles/chartJs.scss'
import '@/styles/scroll.scss'
import DefaultLayout from '@/components/layout/default-layout'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    // Redux用法
    <Provider store={store}>
    {/* persist庫存進session */}
      {/* <PersistGate loading={null} persistor={persistor}> */}
        {getLayout(<Component {...pageProps} />)}
      {/* </PersistGate> */}
    </Provider>
  )
}
