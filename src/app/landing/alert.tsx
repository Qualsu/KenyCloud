"use client"

import { useState } from 'react';

export function Alert() {
    const [visible, setVisible] = useState(true);
    const handleDismiss = () => {
        setVisible(false);
    };

    const alert: boolean = false;

    if (!alert) return null;

    return (
        <>
            {visible && (
                <div id="alert-border-2" className="flex items-center p-4 mb-4 border-t-4 text-purple-dark bg-white border-purple-lightest" role="alert">
                    <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <div className="ms-3 text-sm font-medium">
                        С 01.12.2024 регистрация и авторизация при помощи Google, Discord и Github станут недоступны. Успейте перенести аккаунты следуя <a href="https://telegra.ph/Otklyucheniya-storonnih-SSO--Qual-ID-11-17" className="font-semibold underline hover:no-underline">этой</a> инструкции.
                    </div>
                    <button type="button" onClick={handleDismiss} className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-purple-darkest p-1.5 inline-flex items-center justify-center h-8 w-8 bg-white text-purple-dark hover:bg-white-dark" aria-label="Close">
                        <span className="sr-only">Закрыть</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
