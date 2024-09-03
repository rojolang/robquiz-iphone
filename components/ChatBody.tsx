import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EngagingButtons from './EngagingButtons';
import ResponseButtons from './ResponseButtons';
import { useKowboyKit } from '../hooks/useKowboyKit';

interface Message {
    text: string;
    sender: 'bot' | 'user';
}

interface ChatBodyProps {
    messages: Message[];
    isTyping: boolean;
    showEngagingButtons: boolean;
    showButtons: boolean;
    handleResponse: (response: string) => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({
                                               messages,
                                               isTyping,
                                               showEngagingButtons,
                                               showButtons,
                                               handleResponse
                                           }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { trackEvent } = useKowboyKit();

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUserResponse = (response: string) => {
        handleResponse(response);
        if (messages.length === 2) {
            trackEvent({ eventType: 'lead' });
        } else if (messages.length === 4) {
            trackEvent({ eventType: 'add_to_cart' });
        }
    };

    return (
        <div className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full bg-gray-100">
                <div className="flex-1 overflow-y-auto px-3 py-4" ref={scrollAreaRef}>
                    {messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    {showEngagingButtons && (
                        <EngagingButtons onResponse={handleUserResponse} />
                    )}
                    {showButtons && !showEngagingButtons && (
                        <ResponseButtons onResponse={handleUserResponse} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBody;
