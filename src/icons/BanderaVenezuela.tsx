import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface Props {
  size?: number;
}

export const BanderaVenezuela: React.FC<Props> = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <G>
      <Circle cx="16" cy="16" r="16" fill="#121e36" />
      <Path d="M0 0 H32 V10.67 H0 Z" fill="#FFCC00" />
      <Path d="M0 10.67 H32 V21.33 H0 Z" fill="#00247D" />
      <Path d="M0 21.33 H32 V32 H0 Z" fill="#CF142B" />
      <Circle cx="10" cy="15" r="0.8" fill="white" />
      <Circle cx="12" cy="14" r="0.8" fill="white" />
      <Circle cx="14" cy="13.5" r="0.8" fill="white" />
      <Circle cx="16" cy="13.3" r="0.8" fill="white" />
      <Circle cx="18" cy="13.5" r="0.8" fill="white" />
      <Circle cx="20" cy="14" r="0.8" fill="white" />
      <Circle cx="22" cy="15" r="0.8" fill="white" />
    </G>
  </Svg>
);
