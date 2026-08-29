import { StyleSheet, ViewStyle } from "react-native";

const flexBoxObj: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};

const container: ViewStyle = {
  paddingHorizontal: 20,
  height: "100%",
  width: "100%",
};

const globalStyles = StyleSheet.create({
  globalContainer: container,

  globalPaddingContainer: {
    ...container,
    paddingTop: 58,
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
