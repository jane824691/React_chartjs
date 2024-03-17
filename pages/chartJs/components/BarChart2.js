import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import data from '@/data/Unemployment.json'

const BarChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d')

    if (chartRef.current !== null) {
      chartRef.current.destroy()
    }

    const firstData = data[1]
    const labels = Object.keys(firstData).slice(1)
    const datasetsData = Object.values(firstData).slice(1)

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: firstData.月份,
            data: datasetsData.map((value) => parseInt(value)),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '2023年失業人數統計',
          },
          legend: {
            display: false,
            position: 'right',
            labels: {
              fontColor: '#000',
            },
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
  }, [])

  return (
    <div className="container">
      <canvas id="myChart" className="chart-container"></canvas>
    </div>
  )
}

export default BarChart
