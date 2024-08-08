import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const CitySvg = () => (
  <Svg width={24} height={24} fill="none">
    {/* Buildings */}
    <Rect x={2} y={10} width={4} height={12} fill="#626262" />
    <Rect x={8} y={6} width={5} height={16} fill="#626262" />
    <Rect x={15} y={12} width={6} height={10} fill="#626262" />
    
    {/* Windows */}
    <Rect x={3} y={11} width={2} height={2} fill="#fff" />
    <Rect x={3} y={14} width={2} height={2} fill="#fff" />
    
    <Rect x={9} y={7} width={3} height={2} fill="#fff" />
    <Rect x={9} y={10} width={3} height={2} fill="#fff" />
    <Rect x={9} y={13} width={3} height={2} fill="#fff" />
    
    <Rect x={16} y={13} width={2} height={2} fill="#fff" />
    <Rect x={19} y={13} width={2} height={2} fill="#fff" />
    <Rect x={16} y={16} width={2} height={2} fill="#fff" />
    <Rect x={19} y={16} width={2} height={2} fill="#fff" />
    
    {/* Roofs */}
    <Path
      d="M2 10 L4 8 L4 10 Z"
      fill="#404040"
    />
    <Path
      d="M8 6 L10 4 L13 6 L13 6 L8 6 Z"
      fill="#404040"
    />
    <Path
      d="M15 12 L18 10 L21 12 L21 12 L15 12 Z"
      fill="#404040"
    />
  </Svg>
);

export default CitySvg;
