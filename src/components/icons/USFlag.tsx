import React from 'react';

const USFlag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <path fill="#B22234" d="M0 0h60v30H0z"/>
    <path fill="#fff" d="M0 3h60v3H0zm0 6h60v3H0zm0 6h60v3H0zm0 6h60v3H0z"/>
    <path fill="#3C3B6E" d="M0 0h30v15H0z"/>
    <g fill="#fff">
      <g id="s18">
        <g id="s9">
          <path id="s" d="M3.6 2.9L2 4.1l.4-1.8L1 1.1l1.8.4L3.6 0l.8 1.5 1.8-.4-1.4 1.2.4 1.8z"/>
          <use href="#s" x="6"/>
          <use href="#s" x="12"/>
          <use href="#s" x="18"/>
          <use href="#s" x="24"/>
        </g>
        <use href="#s9" y="3"/>
        <use href="#s9" y="6"/>
        <use href="#s9" y="9"/>
      </g>
      <g id="s12">
        <use href="#s" x="3" y="1.5"/>
        <use href="#s" x="9" y="1.5"/>
        <use href="#s" x="15" y="1.5"/>
        <use href="#s" x="21" y="1.5"/>
        <use href="#s" x="27" y="1.5"/>
      </g>
      <use href="#s12" y="3"/>
      <use href="#s12" y="6"/>
      <use href="#s12" y="9"/>
    </g>
  </svg>
);

export default USFlag;
