const employee = require('./employee');

// 明確描述測試的目標：'拿 200 元買套餐，預期會找 73 元'
// 測試的目標為何？    test('...', ()=>{})
test('拿 200 元買套餐，預期會找 73 元', () => {
    const bill = 200;  // 小明手中的鈔票
    const price = 127; // 餐點的價格

    // 期望找錢的結果是符合預期的
    // 導入要測試的函式   employee.makeChange()
    expect(employee.makeChange(bill, price)).toBe(73); 
    //測試的期望是什麼？  expect(...).toBe(...);
});