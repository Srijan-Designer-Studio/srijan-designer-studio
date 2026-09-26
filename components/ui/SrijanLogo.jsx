import React from 'react';

export default function SrijanLogo({ className }) {

  const imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAEHgAAAlDCAIAAADj1dfzAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQVR4...[আপনার_সম্পূর্ণ_কোড_এখানে_দিন]...Jggg==";

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1440 809.999993"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <defs>
        <filter x="0%" y="0%" width="100%" height="100%" id="cbf849fc85">
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" colorInterpolationFilters="sRGB"/>
        </filter>
        <filter x="0%" y="0%" width="100%" height="100%" id="d837521e0b">
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0" colorInterpolationFilters="sRGB"/>
        </filter>
        <mask id="21ec20fc8f">
          <g filter="url(#cbf849fc85)">
            <g filter="url(#d837521e0b)" transform="matrix(0.341734, 0, 0, 0.341628, -0.533722, 0.00002)">
              <image x="0" y="0" width="4216" height="2371" preserveAspectRatio="xMidYMid meet" xlinkHref={imageData} />
            </g>
          </g>
        </mask>
      </defs>
      <g mask="url(#21ec20fc8f)">
        <g transform="matrix(0.341734, 0, 0, 0.341628, -0.533722, 0.00002)">
          <image x="0" y="0" width="4216" height="2371" preserveAspectRatio="xMidYMid meet" xlinkHref={imageData} />
        </g>
      </g>
    </svg>
  );
}