import React from 'react';

interface ResponseButtonsProps {
    onResponse: (response: string) => void;
}

const ResponseButtons: React.FC<ResponseButtonsProps> = ({ onResponse }) => (
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

export default ResponseButtons;
