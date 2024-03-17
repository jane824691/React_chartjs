import React, { useState, useEffect } from 'react'
import ChartApi from '@/pages/chartJs/components/ChartApi'
import FormApi from './components/FormApi'

export default function ChartApiIndex() {
  // 定義狀態來存儲從API獲取的數據
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    // 發送API請求並獲取數據
    fetch(
      'https://apiservice.mol.gov.tw/OdService/download/A17000000J-030145-2EQ'
    )
      .then((response) => response.json())
      .then((data) => {
        // 將獲取的數據設置為狀態的值
        setApiData(data)
      })
      .catch((error) => {
        // 處理錯誤
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <div className="chart-box mx-5">
      {/* 將從API獲取的資料以props傳遞給<ChartApi />跟<FormApi />元件 */}
      <ChartApi apiData={apiData} />

      <FormApi apiData={apiData} />
    </div>
  )
}
