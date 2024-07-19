import React from 'react';

const LikeIcon: React.FC<{className?: string}> = ({className}) => {
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
        d="M38.258 23.5112C34.562 23.5112 33 26.1757 33 26.1757C33 26.1757 31.438 23.5 27.742 23.5C24.618 23.5112 22 26.1757 22 29.3574C22 36.6538 33 42.5 33 42.5C33 42.5 44 36.6538 44 29.3574C44 26.1757 41.382 23.5112 38.258 23.5112Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LikeIcon;
