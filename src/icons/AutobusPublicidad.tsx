import React from 'react';
import Svg, { Path, Line, Rect, Ellipse, Circle, G } from 'react-native-svg';

interface Props {
  size?: number;
}

export const AutobusPublicidad: React.FC<Props> = ({ size = 280 }) => (
  <Svg
    width={size}
    height={size * 0.62}
    viewBox="0 0 420 260"
    fill="none"
  >
    <Path
      d="M30 225 C80 238 200 240 380 220 C390 215 350 205 280 205 C200 205 100 212 30 225 Z"
      fill="#000000"
    />
    <Path
      d="M50 230 C120 242 280 242 390 225"
      stroke="#000000"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <Path
      d="M32 95 C32 60 55 35 130 30 C200 25 340 32 395 55 C405 60 410 75 410 95 L410 170 C410 190 395 200 375 200 L55 200 C38 200 32 185 32 155 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    <Path
      d="M38 52 L150 52 L146 110 L38 110 Z"
      fill="#00C3FF"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <Path
      d="M42 58 L146 58 L144 90 L42 90 Z"
      fill="#000000"
    />
    <Line x1="92" y1="52" x2="90" y2="110" stroke="#000000" strokeWidth="5" />
    <Line x1="60" y1="110" x2="88" y2="70" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
    <Line x1="112" y1="110" x2="138" y2="72" stroke="#000000" strokeWidth="6" strokeLinecap="round" />

    <Path
      d="M156 50 L220 50 L220 112 L156 112 Z"
      fill="#000000"
      stroke="#000000"
      strokeWidth="4"
    />

    <Path d="M228 52 L258 52 L258 112 L228 112 Z" fill="#000000" stroke="#000000" strokeWidth="3" />
    <Line x1="238" y1="60" x2="248" y2="102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    <Path d="M264 52 L294 52 L294 112 L264 112 Z" fill="#000000" stroke="#000000" strokeWidth="3" />
    <Line x1="274" y1="60" x2="284" y2="102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    <Path d="M300 53 L330 53 L330 112 L300 112 Z" fill="#000000" stroke="#000000" strokeWidth="3" />
    <Line x1="310" y1="60" x2="320" y2="102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    <Path d="M336 54 L366 55 L366 112 L336 112 Z" fill="#000000" stroke="#000000" strokeWidth="3" />
    <Line x1="346" y1="62" x2="356" y2="102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    <Path d="M372 56 L398 60 L398 112 L372 112 Z" fill="#000000" stroke="#000000" strokeWidth="3" />
    <Line x1="380" y1="64" x2="390" y2="102" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    <Path
      d="M24 42 C14 42, 8 58, 12 80 C15 90, 24 90, 24 80 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="5"
    />
    <Path d="M24 62 L38 62" stroke="#000000" strokeWidth="5" />

    <Path
      d="M168 36 C174 36, 178 44, 175 60 L164 60 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="4"
    />

    <Path
      d="M178 138 C210 102, 280 102, 350 130 C388 145, 400 115, 395 90 C390 142, 310 195, 210 180 C178 175, 185 152, 178 138 Z"
      fill="#00C3FF"
      stroke="#00247D"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <Path
      d="M200 148 C230 120, 290 122, 330 160 C295 188, 235 182, 200 148 Z"
      fill="#00C3FF"
      stroke="#00247D"
      strokeWidth="4"
    />

    <Path
      d="M28 132 C40 122, 60 122, 70 132 C58 140, 38 140, 28 132 Z"
      fill="#00247D"
      stroke="#000000"
      strokeWidth="3"
    />

    <Ellipse cx="36" cy="144" rx="9" ry="14" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
    <Ellipse cx="36" cy="144" rx="4" ry="8" fill="#000000" />

    <Ellipse cx="120" cy="150" rx="9" ry="14" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
    <Ellipse cx="120" cy="150" rx="4" ry="8" fill="#000000" />

    <Path
      d="M52 146 Q 78 160, 104 146 L100 165 Q 78 175, 52 165 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="4"
    />

    <Rect x="25" y="172" width="20" height="24" rx="4" fill="#000000" />
    <Rect x="110" y="178" width="20" height="24" rx="4" fill="#000000" />

    <G>
      <Circle cx="185" cy="188" r="26" fill="#000000" />
      <Circle cx="185" cy="188" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
      <Circle cx="185" cy="188" r="6" fill="#000000" />
    </G>

    <G>
      <Circle cx="345" cy="184" r="25" fill="#000000" />
      <Circle cx="345" cy="184" r="12" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
      <Circle cx="345" cy="184" r="5" fill="#000000" />
    </G>
  </Svg>
);
