// components/ChatHeader.tsx

import React from 'react';
import { Phone, MoreVertical, Battery, Wifi } from 'lucide-react';

interface ChatHeaderProps {
    globalSettings: any;
    phoneNumber: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ globalSettings, phoneNumber }) => (
    <>
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
                    <img src={globalSettings.agentAvatarUrl} alt="Emily" className="w-full h-full object-cover" />
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
                <a href={`tel:${phoneNumber}`} className="text-sm mr-2 hover:underline flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="text-base">{phoneNumber}</span>
                </a>
                <MoreVertical className="w-5 h-5" />
            </div>
        </div>
    </>
);

export default ChatHeader;
