import { StyleSheet, ViewStyle } from "react-native";

const flexBoxObj: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};

const container: ViewStyle = {
  paddingHorizontal: "5%",
  height: "100%",
  width: "100%",
};

const globalStyles = StyleSheet.create({
  globalContainer: container,

  globalPaddingContainer: {
    ...container,
    paddingTop: "12%",
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
