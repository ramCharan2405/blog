import React from 'react';

export default function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    );
} 