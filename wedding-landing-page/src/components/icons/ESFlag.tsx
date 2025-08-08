import React from 'react';

const ESFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <rect fill="#ffce00" width="900" height="600"/>
    <rect fill="#003893" y="300" width="900" height="300"/>
    <rect fill="#ce1126" y="450" width="900" height="150"/>
  </svg>
);

export default ESFlag;
