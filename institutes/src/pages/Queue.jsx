import React from 'react';
import { assets } from '../assets/assets';

const Queue = () => {
    return (
        <div className="flex flex-col items-center mt-10">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-2">Queues</h1>

            {/* Total Count */}
            <h2 className="text-lg font-semibold mb-6">Total Count: <span className="font-normal">0</span></h2>

            {/* Queue Line */}
            <div className="flex items-center space-x-8">
                <img src={assets.Counter} alt="Counter" className="w-90 h-90" />
                <img src={assets.Male} alt="Male User" className="w-80 h-80" />
                <img src={assets.Female} alt="Female User" className="w-80 h-80" />
            </div>
        </div>
    );
};

export default Queue;
