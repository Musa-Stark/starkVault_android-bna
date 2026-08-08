import { StyleSheet, ViewStyle } from "react-native";
import colors from "./colors";
import fontSizes from "./fontSize";

const flexBoxObj: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};
const globalStyles = StyleSheet.create({
  globalWidth: {
    width: "90%",
  },

  flexBox: flexBoxObj,

  flexBoxHorizantal: {
    ...flexBoxObj,
    flexDirection: "row",
  },
  logo: {
    ...flexBoxObj,
    flexDirection: "row",
    gap: 15,
  },
  logoImg: {
    width: 50,
    height: 50,
  },
  logoName: {
    fontSize: 25,
    fontWeight: 600,
    color: colors.white,
  },
  devBorder: {
    borderColor: "white",
    borderWidth: 0.8,
  },
  heading: {
    fontSize: 30,
    fontWeight: 800,
    color: colors.white,
  },
  textInput: {
    paddingHorizontal: 17,
    paddingVertical: 15,
    marginTop: 10,
    color: colors.white,
    borderColor: colors.gray700,
    borderWidth: 1,
    fontSize: fontSizes.lg,
  },
  curvedCorner: {
    borderRadius: 20,
  },
});

export default globalStyles;
