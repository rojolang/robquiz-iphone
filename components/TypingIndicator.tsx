import React from 'react';

const TypingIndicator: React.FC = () => (
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

export default TypingIndicator;
