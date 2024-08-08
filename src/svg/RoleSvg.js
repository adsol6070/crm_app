import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const RoleSvg = () => (
  <Svg width={20} height={20} fill="none">
    {/* Badge Outer Circle */}
    <Circle
      cx={10}
      cy={10}
      r={8}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* Badge Inner Circle */}
    <Circle
      cx={10}
      cy={10}
      r={4}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* Role Icon - User */}
    <Path
      d="M10 11.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 12.5c-2 0-3.5 1.5-3.5 3v0.5h7v-0.5c0-1.5-1.5-3-3.5-3z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RoleSvg;
