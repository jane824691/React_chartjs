import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

// props接起傳過來的api資料，再帶出總圖表
const ChartApi = (props) => {
  const { apiData } = props
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d')

    // 防止重複渲染出錯
    if (chartRef.current !== null) {
      chartRef.current.destroy()
    }

    if (apiData) {
      // 從apiData中取月份組陣列做標籤
      const labels = apiData.map((entry) => entry.月份)

      // 因為月份將作為標籤, 故用filter將月份屬性排除在外
      const datasets = Object.keys(apiData[0])
        .filter((key) => key !== '月份')
        .map((key, i) => {
          return {
            label: key,
            data: apiData.map((entry) => parseInt(entry[key])),
            // 隨機生成背景顏色
            backgroundColor: `rgba(${Math.random() * 255}, ${
              Math.random() * 255
            }, ${Math.random() * 255}, 0.6)`,
          }
        })

      // 創建圖表
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: '2023年失業人數統計',
            },
            legend: {
              display: true,
              position: 'right',
            },
            layout: {
              padding: {
                left: 50,
                right: 0,
                bottom: 0,
                top: 0,
              },
            },
            tooltips: {
              enabled: true,
            },
          },
        },
      })
    }
  }, [apiData])

  return (
    <div className="container">
      <canvas id="myChart" className="chart-container"></canvas>
    </div>
  )
}

export default ChartApi
