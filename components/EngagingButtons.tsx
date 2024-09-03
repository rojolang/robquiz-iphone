import React from 'react';
import { motion } from 'framer-motion';

interface EngagingButtonsProps {
    onResponse: (response: string) => void;
}

const EngagingButtons: React.FC<EngagingButtonsProps> = ({ onResponse }) => (
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

export default EngagingButtons;
