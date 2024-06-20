import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './tools/store'
import '@/styles/globals.scss'
import '@/styles/chartJs.scss'
import DefaultLayout from '@/components/layout/default-layout'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])
  
  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

    return (
      <Provider store={store}>
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    );
  };
  
