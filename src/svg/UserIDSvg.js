import * as React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

const UserIdSvg = () => (
  <Svg width={20} height={20} fill="none">
    {/* ID Card Body */}
    <Rect
      x={2}
      y={4}
      width={16}
      height={12}
      rx={2}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* Card Header */}
    <Rect
      x={2}
      y={4}
      width={16}
      height={3}
      rx={1}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* User Avatar */}
    <Circle
      cx={10}
      cy={10}
      r={3}
      stroke="#626262"
      strokeWidth={1.5}
    />
    {/* User Details */}
    <Rect
      x={4}
      y={13}
      width={12}
      height={2}
      rx={1}
      stroke="#626262"
      strokeWidth={1.5}
    />
    <Rect
      x={4}
      y={15}
      width={8}
      height={1}
      rx={1}
      stroke="#626262"
      strokeWidth={1.5}
    />
  </Svg>
);

export default UserIdSvg;
