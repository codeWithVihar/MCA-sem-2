import React from "react";

const LoadingBox = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg width="80" height="80" viewBox="0 0 80 80" className="mb-4">
      <defs>
        <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <g>
        <rect x="20" y="30" width="40" height="35" rx="4" fill="url(#boxGrad)" opacity="0.9">
          <animate attributeName="y" values="30;28;30" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <polygon points="20,30 40,18 60,30" fill="url(#boxGrad)" opacity="0.7">
          <animate attributeName="points" values="20,30 40,18 60,30;20,28 40,16 60,28;20,30 40,18 60,30" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <line x1="30" y1="42" x2="50" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="x1" values="30;28;30" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="50;52;50" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="30" y1="50" x2="45" y2="50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <animate attributeName="x1" values="30;28;30" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
          <animate attributeName="x2" values="45;47;45" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
        </line>
        <circle cx="40" cy="55" r="2" fill="white" opacity="0.4">
          <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
    <p className="text-sm font-medium text-gray-400">{text}</p>
  </div>
);

export default LoadingBox;
