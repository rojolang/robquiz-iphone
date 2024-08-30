'use client'
import React, { useState, useEffect } from 'react';
import { Phone, MoreVertical, Battery, Wifi } from 'lucide-react';
import AndroidChat from "../components/AndroidChat";

// Add this type declaration at the top of your file
declare global {
    interface Window {
        dataLayer: any[];
    }
}

// Define the chat configuration statically
const chatConfig = {
    steps: [
        { message: "Hi 👋", waitForInput: false },
        { message: "I'm Emily from Senior Benefits Direct.", waitForInput: false },
        { message: "Want to find out if you qualify for a $3,300 Health Allowance Benefit? Tap Yes! 😃", waitForInput: true },
        { message: "Are you under the age of 64?", waitForInput: true },
        { message: "Are you on Medicare Part A or Part B?", waitForInput: true },
        { message: "🎉 Congratulations! 🎊", waitForInput: false },
        { message: "You're pre-qualified for a $3,300 Health Allowance!", waitForInput: false },
        { message: "You can use the savings for your grocery, rent, medical expenses, and so on.", waitForInput: false },
        { message: "Tap the number button below to call now to get your $3,300", waitForInput: false },
        { message: "Hurry up! I only have 5 minutes until my next customer. Call now to secure your benefit!", waitForInput: false },
    ],
    agentName: "Emily",
    agentAvatarUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-qimg-fe14c462c2025fcfe5a696fc2a64b2bb-3BNBEfS49IhI5iFTOjTLo5bcnT7nUv.webp",
    initialCountdown: 300
};

const ChatHeader = () => (
    <div className="bg-blue-500 p-3 text-white flex items-center justify-between relative z-10">
        <div className="flex items-center">
            <div className="w-10 h-10 mr-3 border-2 border-white rounded-full overflow-hidden">
                <img src={chatConfig.agentAvatarUrl} alt={chatConfig.agentName} className="w-full h-full object-cover" />
            </div>
            <div>
                <div className="font-semibold text-lg">{chatConfig.agentName}</div>
                <div className="text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    <span>Online</span>
                </div>
            </div>
        </div>
        <div className="flex items-center">
            <a href="tel:18885341809" className="text-sm mr-2 hover:underline flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-base">(888) 534-1809</span>
            </a>
            <MoreVertical className="w-5 h-5" />
        </div>
    </div>
);

const StatusBar = () => {
    const [time, setTime] = useState(new Date());
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(battery.level * 100);
                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(battery.level * 100);
                });
            });
        }
    }, []);

    return (
        <div className="bg-black text-white text-xs p-1 rounded-t-2xl flex justify-between items-center">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex space-x-1 items-center">
                <Wifi className="h-4 w-4" />
                <Battery className="h-4 w-4" />
                {batteryLevel !== null && (
                    <span className="text-xs">{Math.round(batteryLevel)}%</span>
                )}
            </div>
        </div>
    );
};

export default function Home() {
    useEffect(() => {
        // Capture kkclid from URL and push to dataLayer
        const urlParams = new URLSearchParams(window.location.search);
        const kkclid = urlParams.get('kkclid');
        if (kkclid) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'kkclid_captured',
                kkclid: kkclid
            });
        }
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-[375px] h-[812px] overflow-hidden shadow-lg bg-white flex flex-col rounded-3xl border-8 border-gray-800 touch-manipulation">
                <StatusBar />
                <ChatHeader />
                <div className="flex-1 overflow-hidden">
                    <AndroidChat config={chatConfig} />
                </div>
            </div>
        </main>
    );
}

// Force static rendering
export const dynamic = 'force-static';