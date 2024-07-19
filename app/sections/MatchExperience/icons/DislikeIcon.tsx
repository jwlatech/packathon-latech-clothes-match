import React from 'react';

const DislikeIcon: React.FC<{className?: string}> = ({className}) => {
  return (
    <svg
      className={className}
      width="66"
      height="66"
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="63" height="63" rx="31.5" fill="white" />
      <rect
        x="1.5"
        y="1.5"
        width="63"
        height="63"
        rx="31.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M39.1338 26.8665L26.8665 39.1338"
        stroke="currentColor"
        strokeWidth="7.04849"
        strokeLinecap="round"
      />
      <path
        d="M39.1338 39.1335L26.8665 26.8662"
        stroke="currentColor"
        strokeWidth="7.04849"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DislikeIcon;
