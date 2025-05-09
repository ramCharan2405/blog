import React from "react";

export default function Button({
    children,
    
    bgColor = "bg-blue-500",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}