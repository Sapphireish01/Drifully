import React from "react";

interface FilterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export default function FilterIcon({
  size = 20,
  width,
  height,
  color = "currentColor",
  className = "",
  ...props
}: FilterIconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M18.332 5.41663H13.332"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.0013 5.41663H1.66797"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33464 8.33333C9.94547 8.33333 11.2513 7.0275 11.2513 5.41667C11.2513 3.80584 9.94547 2.5 8.33464 2.5C6.7238 2.5 5.41797 3.80584 5.41797 5.41667C5.41797 7.0275 6.7238 8.33333 8.33464 8.33333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 14.5834H15"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66797 14.5834H1.66797"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 17.5C13.2775 17.5 14.5833 16.1941 14.5833 14.5833C14.5833 12.9725 13.2775 11.6666 11.6667 11.6666C10.0558 11.6666 8.75 12.9725 8.75 14.5833C8.75 16.1941 10.0558 17.5 11.6667 17.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
