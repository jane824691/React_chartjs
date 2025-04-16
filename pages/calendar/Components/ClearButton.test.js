import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClearButton from './clearButton';

test('點擊清空按鈕時應呼叫 setMyDate 並傳入 0', () => {
    const setMyDateMock = jest.fn(); // mock function

    render(<ClearButton setMyDate={setMyDateMock} />);

    const button = screen.getByText(/清空/i);
    fireEvent.click(button);

    // 驗證是否有被呼叫一次，並且參數是 0
    expect(setMyDateMock).toHaveBeenCalledTimes(1);
    expect(setMyDateMock).toHaveBeenCalledWith(0);
});
