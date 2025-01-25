import React from "react";

export default function IconItalic({ className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={68}
            height={68}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${className}`}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11 5l6 0" />
            <path d="M7 19l6 0" />
            <path d="M14 5l-4 14" />
        </svg>
    );
}
