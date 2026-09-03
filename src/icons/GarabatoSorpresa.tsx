import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
}

export const GarabatoSorpresa: React.FC<Props> = ({ size = 32 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 48 32"
    fill="none"
  >
    <Path
      d="M12 12L6 4M24 8V0M36 12L42 4"
      stroke="#121e36"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path
      d="M2 24C8 28 20 29 32 27C38 26 44 24 46 22"
      stroke="#121e36"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M6 28C14 31 28 31 40 28"
      stroke="#121e36"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
