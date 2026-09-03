import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export const AlcancíaCerdo: React.FC<Props> = ({ size = 24, color = '#2563eb' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 11C19 7.13401 15.866 4 12 4C8.13401 4 5 7.13401 5 11C5 12.8726 5.73356 14.5739 6.93291 15.8344L6 19H9.5L10.5 17.5H13.5L14.5 19H18L17.0671 15.8344C18.2664 14.5739 19 12.8726 19 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 8H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="15" cy="10" r="1" fill={color} />
  </Svg>
);
