import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DefaultLayout from '@/components/layout/default-layout'
import { useRouter } from 'next/router';

// Mock router（重點）
// Integration tests 目的：Navbar 有出現、點了按鈕、router 被正確呼叫
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Navbar 整合測試', () => {
    it('點擊「1 月數據」會導向 /chartJs/jan', () => {
        const push = jest.fn();

        useRouter.mockReturnValue({
            push,
            pathname: '/',
        });

        render(
            <DefaultLayout>
                <div>目前頁面</div>
            </DefaultLayout>
        );

        const janBtn = screen.getByText('1 月數據');
        fireEvent.click(janBtn);

        expect(push).toHaveBeenCalledWith('../chartJs/jan');
    });
});
