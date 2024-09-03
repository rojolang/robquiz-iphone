// components/AndroidChat.tsx

import React, { useEffect, useCallback, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { useChatLogic } from '../hooks/useChatLogic';
import { useAudioPlayback } from '../hooks/useAudioPlayback';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const audioFiles = ['/0.mp3', '/1.mp3', '/2.mp3', '/3.mp3'];

interface AndroidChatState {
    hasError: boolean;
    globalSettings: any;
    isInitialized: boolean;
    phoneNumber: string;
    isFirstResponse: boolean;
}

export default class AndroidChat extends React.Component<{}, AndroidChatState> {
    private observer: MutationObserver | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            hasError: false,
            globalSettings: null,
            isInitialized: false,
            phoneNumber: '',
            isFirstResponse: true,
        };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    componentDidMount() {
        if (typeof window !== 'undefined' && window.globalSettings) {
            this.setState({
                globalSettings: window.globalSettings,
                phoneNumber: window.globalSettings.phoneNumberText,
            });
        }

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const newNumber = document.getElementById('click-to-call-button')?.textContent;
                    if (newNumber && newNumber !== this.state.phoneNumber) {
                        this.setState({ phoneNumber: newNumber.replace('Call Now: ', '') });
                    }
                }
            });
        });

        const targetNode = document.getElementById('phone-number-container');
        if (targetNode && this.observer) {
            this.observer.observe(targetNode, { childList: true, subtree: true });
        }
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong</div>;
        }

        if (!this.state.globalSettings) {
            return <div>Loading...</div>;
        }

        return (
            <AndroidChatContent
                globalSettings={this.state.globalSettings}
                phoneNumber={this.state.phoneNumber}
                isFirstResponse={this.state.isFirstResponse}
                setIsFirstResponse={(value: boolean) => this.setState({ isFirstResponse: value })}
            />
        );
    }
}

function AndroidChatContent({ globalSettings, phoneNumber, isFirstResponse, setIsFirstResponse }: {
    globalSettings: any;
    phoneNumber: string;
    isFirstResponse: boolean;
    setIsFirstResponse: (value: boolean) => void;
}) {
    const {
        messages,
        isTyping,
        showButtons,
        showEngagingButtons,
        showCallToAction,
        timeLeft,
        handleResponse,
        setCurrentStep,
    } = useChatLogic(globalSettings?.messagingSteps || []);

    const { initializeAudio, playInitialAudios, playNextAudio } = useAudioPlayback(audioFiles);

    useEffect(() => {
        initializeAudio();
        setCurrentStep(0);
    }, [initializeAudio, setCurrentStep]);

    const handleUserResponse = useCallback((response: string) => {
        handleResponse(response);
        if (isFirstResponse) {
            playInitialAudios();
            setIsFirstResponse(false);
        } else {
            playNextAudio();
        }
    }, [handleResponse, playInitialAudios, playNextAudio, isFirstResponse, setIsFirstResponse]);

    return (
        <motion.div className="w-[375px] h-[812px] overflow-hidden shadow-lg bg-white flex flex-col rounded-3xl border-8 border-gray-800">
            <ChatHeader globalSettings={globalSettings} phoneNumber={phoneNumber} />
            <ChatBody
                messages={messages}
                isTyping={isTyping}
                showEngagingButtons={showEngagingButtons}
                showButtons={showButtons}
                handleResponse={handleUserResponse}
            />
            <ChatFooter
                showCallToAction={showCallToAction}
                timeLeft={timeLeft}
                handleResponse={handleUserResponse}
                globalSettings={globalSettings}
                phoneNumber={phoneNumber}
            />
        </motion.div>
    );
}
