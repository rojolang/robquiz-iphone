'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, MoreVertical, Battery, Wifi } from 'lucide-react';

interface Message {
    text: string;
    sender: 'bot' | 'user';
    audioSrc?: string;
}

const audioFiles = ['/0.mp3', '/1.mp3', '/2.mp3', '/3.mp3'];

export default function AndroidChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showCallToAction, setShowCallToAction] = useState(false);
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [steps, setSteps] = useState<Array<{ message: string; waitForInput: boolean }>>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
    const [phoneHref, setPhoneHref] = useState<string>('#');
    const [phoneNumberText, setPhoneNumberText] = useState<string>('');
    const [agentAvatarUrl, setAgentAvatarUrl] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.globalSettings) {
            setSteps(window.globalSettings.messagingSteps);
            setCurrentStep(0);
            setPhoneHref(`tel:${window.globalSettings.phoneNumber}`);
            setPhoneNumberText(window.globalSettings.phoneNumberText);
            setAgentAvatarUrl(window.globalSettings.agentAvatarUrl);

            audioFiles.forEach((file) => {
                const audio = new Audio(file);
                audio.preload = 'auto';
                audioRefs.current[file] = audio;
            });
        }
    }, []);

    useEffect(() => {
        if (currentStep >= 0) {
            handleChatStep();
        }
    }, [currentStep]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, showButtons, showCallToAction]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showCallToAction && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showCallToAction, timeLeft]);

    const handleChatStep = () => {
        if (currentStep >= 0 && currentStep < steps.length) {
            setIsTyping(true);

            const timer = setTimeout(() => {
                const currentMessage = steps[currentStep];
                let audioSrc: string | undefined;

                switch (currentStep) {
                    case 2:
                        showEngagingButtons();
                        break;
                    case 4:
                        audioSrc = '/1.mp3';
                        break;
                    case 5:
                        audioSrc = '/2.mp3';
                        break;
                    case 9:
                        setShowCallToAction(true);
                        break;
                    default:
                        audioSrc = undefined;
                        break;
                }

                addBotMessage(currentMessage.message, audioSrc);
                setIsTyping(false);

                if (currentStep === 9) {
                    setTimeout(() => {
                        setCurrentStep(currentStep + 1);
                    }, 15000); // Delay the final message
                } else if (!currentMessage.waitForInput) {
                    handleNonInputStep();
                }
            }, steps[currentStep].waitForInput ? 2000 : 1000);
            return () => clearTimeout(timer);
        }
    };

    const handleNonInputStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const showEngagingButtons = () => {
        setShowButtons(true);
    };

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    const addBotMessage = (text: string, audioSrc?: string) => {
        setMessages((prev) => [...prev, { text, sender: 'bot', audioSrc }]);
        if (audioSrc) {
            playAudio(audioSrc);
        }
    };

    const playAudio = (src: string) => {
        let audio = audioRefs.current[src];
        if (!audio) {
            audio = new Audio(src);
            audioRefs.current[src] = audio;
        }
        audio.currentTime = 0;
        audio.play().catch((error) => {
            console.error('Failed to play audio:', error);
            if (error.name === 'NotAllowedError') {
                const retryPlay = () => {
                    audio.play().catch((err) => console.error('Retry failed:', err));
                    document.removeEventListener('click', retryPlay);
                };
                document.addEventListener('click', retryPlay);
            }
        });
    };

    const handleResponse = (response: string) => {
        setShowButtons(false);
        addUserMessage(response);
        setInput('');
        setCurrentStep((prev) => prev + 1);
    };

    const addUserMessage = (text: string) => {
        setMessages((prev) => [...prev, { text, sender: 'user' }]);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            className="w-[375px] h-[812px] overflow-hidden shadow-lg bg-white flex flex-col rounded-3xl border-8 border-gray-800"
        >
            <div className="bg-black text-white text-xs p-1 rounded-t-2xl flex justify-between items-center">
                <span>09:30 AM</span>
                <div className="flex space-x-1 items-center">
                    <Wifi className="h-4 w-4" />
                    <Battery className="h-4 w-4" />
                    <span className="text-xs">100%</span>
                </div>
            </div>
            <div className="bg-blue-500 p-3 text-white flex items-center justify-between relative z-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 mr-3 border-2 border-white rounded-full overflow-hidden">
                        <img src={agentAvatarUrl} alt="Emily" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Emily</div>
                        <div className="text-xs flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <a href={phoneHref} className="text-sm mr-2 hover:underline flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        <span className="text-base">{phoneNumberText}</span>
                    </a>
                    <MoreVertical className="w-5 h-5" />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex flex-col h-full bg-gray-100">
                    <div className="flex-1 overflow-y-auto px-3 py-4" ref={scrollAreaRef}>
                        {messages.map((message, index) => (
                            <MessageBubble key={index} message={message} />
                        ))}
                        {isTyping && <TypingIndicator />}
                        {showButtons && (
                            currentStep === 2 ? (
                                <EngagingButtons onResponse={handleResponse} />
                            ) : (
                                <ResponseButtons onResponse={handleResponse} />
                            )
                        )}
                    </div>

                    {showCallToAction ? (
                        <div className="bg-white p-2">
                            <button
                                onClick={() => {
                                    const hiddenButton = document.getElementById('click-to-call-button') as HTMLAnchorElement;
                                    if (hiddenButton) {
                                        hiddenButton.click();
                                    }
                                }}
                                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                            >
                                Call Now: {phoneNumberText}
                            </button>
                            <div className="text-center mt-2 text-sm text-gray-600">
                                Time left: {formatTime(timeLeft)}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-2">
                            <div className="flex items-center bg-gray-100 rounded-full p-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent outline-none text-sm"
                                />
                                <button
                                    onClick={() => handleResponse(input)}
                                    className="p-2 rounded-full bg-blue-500 ml-2 text-white"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`p-3 rounded-2xl max-w-[75%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
            <span className="text-sm">{message.text}</span>
        </div>
    </div>
);

const TypingIndicator = () => (
    <div className="flex justify-start mb-3">
        <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center">
            <div className="flex items-center space-x-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                        style={{
                            animation: `bounce 1s ${i * 0.1}s infinite`,
                            display: 'inline-block',
                        }}
                    ></span>
                ))}
            </div>
        </div>
    </div>
);

const EngagingButtons = ({ onResponse }: { onResponse: (response: string) => void }) => (
    <div className="flex justify-center space-x-4 mt-2">
        <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full text-sm animate-bounce"
            onClick={() => onResponse("Hello")}
        >
            Hello
        </motion.button>
        <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full text-sm animate-bounce"
            onClick={() => onResponse("Let's Get Started")}
        >
            Let's Get Started
        </motion.button>
    </div>
);

const ResponseButtons = ({ onResponse }: { onResponse: (response: string) => void }) => (
    <div className="flex justify-center space-x-4 mt-2">
        <button
            onClick={() => onResponse("Yes")}
            className="bg-green-500 text-white font-bold py-2 px-6 rounded-full text-sm"
        >
            Yes
        </button>
        <button
            onClick={() => onResponse("No")}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-full text-sm"
        >
            No
        </button>
    </div>
);
