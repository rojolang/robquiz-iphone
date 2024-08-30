import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RobChat2',
    description: 'A chat application with Android-like UI',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-TZTF7T2R');
                    `}
            </Script><title></title>
        </head>
        <body className={inter.className}>
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TZTF7T2R"
                    height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe>
        </noscript>
        <div id="phone-number-container" className="hidden">
            <a href="tel:18885341809" id="click-to-call-button" className="bg-green-500 text-white font-bold py-2 px-4 rounded">
                Call Now: (888) 534-1809
            </a>
        </div>
        {children}
        </body>
        </html>
    )
}