// app/page.tsx

'use client';

import React from 'react';
import AndroidChat from '../components/AndroidChat';

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <AndroidChat />
        </main>
    );
}
