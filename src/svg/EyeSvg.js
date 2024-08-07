import * as React from "react";
import { Svg, Path } from "react-native-svg";

const EyeSvg = () => (
  <Svg width={16} height={16} fill="none">
    <Path
      d="M1.333 8S3.667 3.333 8 3.333 14.667 8 14.667 8 12.333 12.667 8 12.667 1.333 8 1.333 8z"
      stroke="#111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 10.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334z"
      stroke="#111"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EyeSvg;
