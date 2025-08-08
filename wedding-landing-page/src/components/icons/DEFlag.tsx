import React from 'react';

const DEFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="20" height="12" {...props}>
    <rect width="5" height="3" fill="#ffce00" />
    <rect width="5" height="2" fill="#000" />
    <rect width="5" height="1" fill="#d00" />
  </svg>
);

export default DEFlag;
