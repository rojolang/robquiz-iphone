import React, { useState } from 'react';
import { useKowboyKit } from '../hooks/useKowboyKit';

interface ChatFooterProps {
    showCallToAction: boolean;
    timeLeft: number;
    handleResponse: (response: string) => void;
    globalSettings: any;
    phoneNumber: string;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
                                                   showCallToAction,
                                                   timeLeft,
                                                   handleResponse,
                                                   globalSettings,
                                                   phoneNumber
                                               }) => {
    const [input, setInput] = useState('');
    const { trackEvent } = useKowboyKit();

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCallButtonClick = () => {
        trackEvent({ eventType: 'purchase', price: 60 });
        const hiddenButton = document.getElementById('click-to-call-button') as HTMLAnchorElement;
        if (hiddenButton) {
            hiddenButton.click();
        }
    };

    return (
        <div className="bg-white p-2">
            {showCallToAction ? (
                <>
                    <button
                        onClick={handleCallButtonClick}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                    >
                        Call Now: {phoneNumber}
                    </button>
                    <div className="text-center mt-2 text-sm text-gray-600">
                        Time left: {formatTime(timeLeft)}
                    </div>
                </>
            ) : (
                <div className="flex items-center bg-gray-100 rounded-full p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button
                        onClick={() => {
                            handleResponse(input);
                            setInput('');
                        }}
                        className="p-2 rounded-full bg-blue-500 ml-2 text-white"
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatFooter;
