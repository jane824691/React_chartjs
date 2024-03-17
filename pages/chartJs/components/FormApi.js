import React from 'react'

// 用props接起串聯過來的api資料，再帶出所有表格
const FormApi = (props) => {
  const { apiData } = props
  console.log(apiData)

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
              {apiData &&
                apiData.map((v, i) => (
                  <tr key={i}>
                    <td>{v.月份}</td>
                    <td>{v.失業給付申請人數}</td>
                    <td>{v.初次認定人數}</td>
                    <td>{v.再認定人數}</td>
                    <td>{v.失業就業人數}</td>
                    <td>{v.失業職訓人數}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FormApi
