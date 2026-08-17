import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useApp } from "@/providers/app-context";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/useColor";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import InputWithLabel from "../auth/InputWithLabel";

const UploadForm = () => {
  const { uploadForm, setUploadForm } = useApp();

  const [mounted, setMounted] = useState(uploadForm.show);
  const [hasError, setHasError] = useState(false);
  const hasValue =
    !!uploadForm.inputs?.length &&
    uploadForm.inputs.every((item) => item.value?.trim());

  const backgroundColor = useColor("background");

  const isDark = backgroundColor.toLowerCase() === "#000000";

  const opacity = useRef(new Animated.Value(uploadForm.show ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(uploadForm.show ? 1 : 0.92)).current;

  useEffect(() => {
    if (uploadForm.show) {
      // Mount first, then animate in
      setMounted(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          damping: 18,
          stiffness: 180,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out first
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(scale, {
          toValue: 0.94,
          duration: 180,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [uploadForm.show]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          zIndex: 999,
          elevation: 999,
          justifyContent: "center",
          alignItems: "center",
          opacity,
        },
      ]}
    >
      {/* Full-screen blurred background */}
      <BlurView
        intensity={50}
        tint={isDark ? "dark" : "light"}
        experimentalBlurMethod={
          Platform.OS === "android" ? "dimezisBlurView" : undefined
        }
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" />

      {/* Glass card */}
      <TouchableWithoutFeedback>
        <Animated.View
          style={{
            width: "90%",
            maxWidth: 500,
            borderRadius: 30,
            overflow: "hidden",

            transform: [{ scale }],

            backgroundColor: isDark
              ? "rgba(30, 30, 38, 0.72)"
              : "rgba(255, 255, 255, 0.72)",

            borderWidth: 1,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.14)"
              : "rgba(255, 255, 255, 0.75)",

            elevation: 12,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: isDark ? 0.35 : 0.15,
            shadowRadius: 20,
          }}
        >
          <Card
            style={{
              borderWidth: 0,
              shadowOpacity: 0,
              elevation: 0,
              position: "relative",
            }}
          >
            <CardHeader>
              <CardTitle style={{ textAlign: "center" }}>
                {uploadForm.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <View>
                {/* Email */}
                {uploadForm.inputs?.map((el, idx) => (
                  <InputWithLabel
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.10)",
                      borderRadius: 999,
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.45)",
                    }}
                    key={idx}
                    label={el.label}
                    placeholderText={el.placeholderText}
                    variant="outline"
                    autoFocus={el.autoFocus}
                    disabled={el.disabled}
                    entryKeyHint={el.entryKeyHint}
                    hasError={setHasError}
                    showErrorText={el.showErrorText}
                    hasForgot={el.hasForgot}
                    inputMode={el.inputMode}
                    isPassword={el.isPassword}
                    isPicker={el.isPicker}
                    nextRef={el.nextRef}
                    pickerOptions={el.pickerOptions}
                    ref={el.ref}
                    returnKeyType={el.returnKeyType}
                    setValue={(text) => {
                      el.setValue?.(text);
                      setUploadForm((prev) => ({
                        ...prev,
                        inputs: prev.inputs?.map((item) =>
                          el.label === item.label
                            ? { ...item, value: text }
                            : item,
                        ),
                      }));
                    }}
                    value={el.value}
                  />
                ))}
              </View>
            </CardContent>

            <CardFooter
              style={{
                gap: 12,
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Button
                onPress={() =>
                  setUploadForm((prev) => ({
                    ...prev,
                    show: false,
                  }))
                }
                variant="outline"
              >
                <Text>Cancel</Text>
              </Button>

              <Button
                onPress={() =>
                  setUploadForm((prev) => ({
                    ...prev,
                    submit: true,
                    show: false,
                  }))
                }
                disabled={hasError || !hasValue}
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default UploadForm;
