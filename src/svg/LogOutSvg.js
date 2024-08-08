import * as React from "react";
import Svg, { Path } from "react-native-svg";

const LogOutSvg = () => (
  <Svg width={20} height={20} fill="none">
    <Path
      d="M7.5 17.5H4.167A1.667 1.667 0 0 1 2.5 15.833V4.167A1.667 1.667 0 0 1 4.167 2.5H7.5M13.333 14.167 17.5 10l-4.167-4.167M17.5 10h-10"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LogOutSvg;
