'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Phone } from 'lucide-react';

interface Message {
    text: string;
    sender: 'bot' | 'user';
}

interface ChatConfig {
    steps: Array<{ message: string; waitForInput: boolean }>;
    agentName: string;
    agentAvatarUrl: string;
    initialCountdown: number;
}

interface AndroidChatProps {
    config: ChatConfig;
}

export default function AndroidChat({ config }: AndroidChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showCallToAction, setShowCallToAction] = useState(false);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(config.initialCountdown);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const { steps } = config;

    useEffect(() => {
        setCurrentStep(0);
    }, []);

    useEffect(() => {
        handleChatStep();
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
                addBotMessage(steps[currentStep].message);
                setIsTyping(false);
                if (steps[currentStep].message.includes("Tap the number button below")) {
                    setShowCallToAction(true);
                    setTimeout(() => {
                        setCurrentStep(currentStep + 1);
                    }, 10000); // 10 seconds pause before the final message
                } else if (!steps[currentStep].waitForInput) {
                    handleNonInputStep();
                } else {
                    showResponseButtons();
                }
            }, steps[currentStep].waitForInput ? 2000 : 1000);
            return () => clearTimeout(timer);
        }
    };

    const handleNonInputStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const showResponseButtons = () => {
        setTimeout(() => {
            setShowButtons(true);
        }, 100);
    };

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    const addBotMessage = (text: string) => {
        setMessages((prev) => [...prev, { text, sender: "bot" }]);
    };

    const addUserMessage = (text: string) => {
        setMessages((prev) => [...prev, { text, sender: "user" }]);
    };

    const handleResponse = (response: string) => {
        setShowButtons(false);
        addUserMessage(response);
        setInput("");
        setCurrentStep(currentStep + 1);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="flex-1 overflow-y-auto px-3 py-4" ref={scrollAreaRef}>
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                </AnimatePresence>
                {showButtons && <ResponseButtons onResponse={handleResponse} />}
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
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now: +1 (888) 534-1809
                    </button>
                    <div className="text-center mt-2 text-sm text-gray-600">
                        Time left: {formatTime(timeLeft)}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-2">
                    <div className="flex items-center bg-gray-100 rounded-full p-2">
                        <button className="p-2 rounded-full bg-gray-200 mr-2">
                            <Mic className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                        <button
                            onClick={() => handleResponse(input)}
                            className="p-2 rounded-full bg-blue-500 ml-2"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
        <div className={`p-3 rounded-2xl max-w-[75%] ${
            message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'
        }`}>
            <span className="text-sm">{message.text}</span>
        </div>
    </motion.div>
);

const TypingIndicator = () => (
    <div className="flex justify-start mb-3">
        <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center">
            <div className="flex items-center space-x-1">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}
            </div>
        </div>
    </div>
);

const ResponseButtons = ({ onResponse }: { onResponse: (response: string) => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex justify-center space-x-4 mt-2"
    >
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
    </motion.div>
);