import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const ProfileEditSvg = () => (
  <Svg width={40} height={40} fill="none">
    <Rect width={40} height={40} rx={20} fill="#DBE3F5" />
    <Path
      d="M20 25.333h6M23 14.333a1.414 1.414 0 0 1 2 2l-8.333 8.334-2.667.666.667-2.666L23 14.333Z"
      stroke="#626262"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ProfileEditSvg;
