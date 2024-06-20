import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ChartApi from '@/pages/chartJs/components/ChartApi';
import FormApi from './components/FormApi';
// 會用到的引入可寫進{}
import store, { getCurrentUser, setUser, getBornCity, setBornCity } from '../tools/store';


// const currentUser = store.getState().user;

// store.dispatch({ type: 'SET_USER', user: { name: 'John Doe' } });

// 在最前頭要先給定義, 該頁面才對的到參數
const currentUser = getCurrentUser();
const currentBornCity  = getBornCity();


// 想塞進去顯示的地方也要塞變數進({})=>{}
const ChartApiIndex = ({ user, bornCity }) => {
  // 定義狀態來存儲從API獲取的數據
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // 發送API請求並獲取數據
    fetch('https://apiservice.mol.gov.tw/OdService/download/A17000000J-030145-2EQ')
      .then((response) => response.json())
      .then((data) => {
        // 將獲取的數據設置為狀態的值
        setApiData(data);
      })
      .catch((error) => {
        // 處理錯誤
        console.error('Error fetching data:', error);
      });
  }, []);


  useEffect(() => {
    setUser({ name: 'John Doe' });
    setBornCity({ city: 'Taipei' });
  }, []);

  return (
    <div className="chart-box mx-5">
      {/* 將從API獲取的資料以props傳遞給<ChartApi />跟<FormApi />元件 */}
      <ChartApi apiData={apiData} />
      <FormApi apiData={apiData} />
      <div>Current user: {user.name}</div>
      <div>Current user from currentUser: {currentUser.name}</div>
      <div>Current user Born City: {currentBornCity.city}</div>

    </div>
  );
};

// 用 react-redux連接connet的部分也要補充進來
const mapStateToProps = (state) => ({
  user: state.user,
  bornCity: state.bornCity,
});

export default connect(mapStateToProps)(ChartApiIndex);
