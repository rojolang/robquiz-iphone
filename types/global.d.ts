// global.d.ts

declare global {
    interface Window {
        globalSettings: {
            enableGTM: boolean;
            enableFBPixel: boolean;
            gtmId: string;
            fbPixelId: string;
            phoneNumber: string;
            phoneNumberText: string;
            messagingSteps: Array<{ message: string; waitForInput: boolean }>;
            initialCountdown: number;
            agentAvatarUrl: string;
            kkclid: string;
        };
    }
}

// This is necessary to make the file a module and avoid TypeScript errors
export {};
