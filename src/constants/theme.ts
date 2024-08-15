import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const FONTS = {
  H1: {
    fontFamily: "Mulish_700Bold",
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },
  H2: {
    fontFamily: "Mulish_700Bold",
    fontSize: 22,
    lineHeight: 22 * 1.2,
  },
  H3: {
    fontFamily: "Mulish_700Bold",
    fontSize: 20,
    lineHeight: 20 * 1.2,
  },
  H4: {
    fontFamily: "Mulish_600SemiBold",
    fontSize: 18,
    lineHeight: 18 * 1.2,
  },
  H5: {
    fontFamily: "Mulish_600SemiBold",
    fontSize: 16,
    lineHeight: 16 * 1.2,
  },
  Mulish_400Regular: {
    fontFamily: "Mulish_400Regular",
  },
  Mulish_600SemiBold: {
    fontFamily: "Mulish_600SemiBold",
  },
  Mulish_700Bold: {
    fontFamily: "Mulish_700Bold",
  },
};

const COLORS = {
  black: "#111111",
  white: "#FFFFFF",
  secondaryWhite: "#F7F7FC",
  tertiaryWhite: "#fafafa",
  gray1: "#626262",
  lightGray: "#BABABA",
  lightBlue1: "#DBE3F5",
  transparent: "transparent",
};

const SIZES = {
  width,
  height,
};

const theme = {
  COLORS,
  FONTS,
  SIZES,
};

export { COLORS, FONTS, SIZES, theme };
