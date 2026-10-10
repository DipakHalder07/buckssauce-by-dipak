const fs = require('fs');

const svgs = JSON.parse(fs.readFileSync('extracted_svgs.json', 'utf8'));

// Find exact SVGs
const logoSvg = svgs.find(s => s.viewBox === '0 0 118 142');
const cartSvg = svgs.find(s => s.viewBox === '0 0 23 19');
const hamburgerSvg = svgs.find(s => s.viewBox === '0 0 25 12');
const closeSvg = svgs.find(s => s.viewBox === '0 0 19 19');
const bannerSvg = svgs.find(s => s.viewBox === '0 0 1000 300');
const circularTextSvg = svgs.find(s => s.viewBox === '0 0 1000 1000');
const leftBadge = svgs.find(s => s.viewBox === '0 0 72 61');
const rightBadge = svgs.find(s => s.viewBox === '0 0 132 55');

let content = `import React from 'react';

export const BucksLogo = ({ className = "w-15 h-auto text-foreground" }) => (
  ${logoSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/style="[^"]*"/g, '').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule')}
);

export const CartBagIcon = ({ className = "w-6 h-6 text-current" }) => (
  ${cartSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/style="[^"]*"/g, '').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule')}
);

export const HamburgerIcon = ({ className = "w-6 h-4 text-current" }) => (
  ${hamburgerSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/style="[^"]*"/g, '').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule')}
);

export const CloseIcon = ({ className = "w-5 h-5 text-current" }) => (
  ${closeSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/style="[^"]*"/g, '').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule')}
);

export const LeftAntlerBadge = ({ className = "w-16 h-auto" }) => (
  ${leftBadge ? leftBadge.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule') : '<svg></svg>'}
);

export const RightAntlerBadge = ({ className = "w-16 h-auto" }) => (
  ${rightBadge ? rightBadge.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule') : '<svg></svg>'}
);

export const BucksLargeBanner = ({ className = "w-full h-auto text-foreground" }) => (
  ${bannerSvg ? bannerSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule') : '<svg></svg>'}
);

export const BucksCircularText = ({ className = "w-full h-full text-foreground" }) => (
  ${circularTextSvg ? circularTextSvg.raw.replace(/class="[^"]*"/g, 'className={className}').replace(/fill-rule/g, 'fillRule').replace(/clip-rule/g, 'clipRule') : '<svg></svg>'}
);
`;

fs.writeFileSync('src/components/Icons.jsx', content);
console.log('Saved src/components/Icons.jsx');
