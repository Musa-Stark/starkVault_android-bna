import { StyleSheet, ViewStyle } from "react-native";
import { useColor } from "@/hooks/useColor";

const flexBoxObj: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};
const globalStyles = StyleSheet.create({
  globalContainer: {
    paddingHorizontal: "5%",
    height: "100%",
    width: "100%",
  },

  flexBox: flexBoxObj,

  flexBoxHorizantal: {
    ...flexBoxObj,
    flexDirection: "row",
  },
  devBorder: {
    borderColor: "white",
    borderWidth: 0.8,
  },
});

export default globalStyles;
