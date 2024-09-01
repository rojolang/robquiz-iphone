// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ACA Chat',
    description: 'A chat application with Android-like UI',
};

const globalSettings = {
    enableGTM: true,
    enableFBPixel: true,
    gtmId: 'GTM-TKRSJ49M',
    fbPixelId: '768195892040623',
    phoneNumber: '+18666731626',
    phoneNumberText: '(866) 673-1626',
    messagingSteps: [
        { message: "Hi 👋", waitForInput: false },
        { message: "I'm Emily from Senior Benefits Direct.", waitForInput: false },
        { message: "Want to find out if you qualify for a $3,300 Health Allowance Benefit? Tap Yes! 😃", waitForInput: true },
        { message: "Are you under the age of 64?", waitForInput: true },
        { message: "Are you on Medicare Part A and Part B?", waitForInput: true },
        { message: "🎉 Congratulations! 🎊", waitForInput: false },
        { message: "You're pre-qualified for a $3,300 Health Allowance!", waitForInput: false },
        { message: "You can use the savings for your grocery, rent, medical expenses, and so on.", waitForInput: false },
        { message: "Tap the number button below to call now to get your $3,300", waitForInput: false },
        { message: "Hurry up! I only have 5 minutes until my next customer. Call now to secure your benefit!", waitForInput: false }
    ],
    initialCountdown: 300,
    agentAvatarUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-qimg-fe14c462c2025fcfe5a696fc2a64b2bb-3BNBEfS49IhI5iFTOjTLo5bcnT7nUv.webp",
    kkclid: ''
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <title>ACA Chat</title>

            {/* Global settings script */}
            <Script id="global-settings" strategy="beforeInteractive">
                {`
                    window.globalSettings = ${JSON.stringify(globalSettings)};
                    const urlParams = new URLSearchParams(window.location.search);
                    window.globalSettings.kkclid = urlParams.get('kkclid') || '';
                `}
            </Script>

            {/* Google Tag Manager */}
            <Script id="conditional-gtm" strategy="afterInteractive">
                {`
                    if (window.globalSettings.enableGTM) {
                        (function(w,d,s,l,i){
                            w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+window.globalSettings.gtmId+dl;
                            f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer', window.globalSettings.gtmId);
                    }
                `}
            </Script>

            {/* Facebook Pixel */}
            <Script id="conditional-facebook-pixel" strategy="afterInteractive">
                {`
                    if (window.globalSettings.enableFBPixel) {
                        !function(f,b,e,v,n,t,s) {
                            if(f.fbq) return; n=f.fbq=function() {
                                n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)
                            };
                            if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
                            n.queue=[]; t=b.createElement(e); t.async=!0;
                            t.src=v; s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)
                        }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', window.globalSettings.fbPixelId);
                        fbq('track', 'PageView');
                    }
                `}
            </Script>

            {/* CTM Script */}
            <Script id="ctm-script" strategy="afterInteractive" src="//516526.tctm.xyz/t.js" async />
        </head>
        <body className={inter.className}>
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${globalSettings.gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
        </noscript>
        <div id="phone-number-container" className="hidden">
            <a href={`tel:${globalSettings.phoneNumber}`} id="click-to-call-button" className="bg-green-500 text-white font-bold py-2 px-4 rounded">
                Call Now: {globalSettings.phoneNumberText}
            </a>
        </div>
        {children}
        </body>
        </html>
    );
}
