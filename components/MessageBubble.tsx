import React from 'react';

interface Message {
    text: string;
    sender: 'bot' | 'user';
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
    <div className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`p-3 rounded-2xl max-w-[75%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
            <span className="text-sm">{message.text}</span>
        </div>
    </div>
);

export default MessageBubble;
