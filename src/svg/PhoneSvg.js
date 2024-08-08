import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const PhoneSvg = () => (
  <Svg width={20} height={20} fill="none">
    {/* Mobile Phone Body */}
    <Rect
      x={4}
      y={2}
      width={12}
      height={16}
      rx={2}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* Screen */}
    <Rect
      x={5}
      y={4}
      width={10}
      height={12}
      rx={1}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* Home Button */}
    <Path
      d="M10 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PhoneSvg;
