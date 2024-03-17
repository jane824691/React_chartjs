import React, { useState, useEffect } from 'react'
import data from '@/data/Unemployment.json'

const Form = () => {

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <table className={'table table-striped table-bordered '}>
            <thead>
              <tr>
                <th>月分</th>
                <th>失業給付申請人數</th>
                <th>初次認定人數</th>
                <th>再認定人數</th>
                <th>失業就業人數</th>
                <th>失業職訓人數</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 1).map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{v.月份}</td>
                    <td>{v.失業給付申請人數}</td>
                    <td>{v.初次認定人數}</td>
                    <td>{v.再認定人數}</td>
                    <td>{v.失業就業人數}</td>
                    <td>{v.失業職訓人數}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Form
