import React from 'react';

const ENFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <clipPath id="en-flag-clip">
      <path d="M0 0h60v30H0z" />
    </clipPath>
    <g clipPath="url(#en-flag-clip)">
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path stroke="#fff" strokeWidth="6" d="M0 0l60 30m0-30L0 30" />
      <path stroke="#C8102E" strokeWidth="2" d="M0 0l60 30m0-30L0 30" />
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
    </g>
  </svg>
);

export default ENFlag;
