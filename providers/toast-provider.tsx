import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { Check, CircleAlert, Info, X } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  duration?: number;
  description?: string;
};

type ToastData = {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
  duration: number;
};

type ToastContextType = {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;

    dismiss: (id?: number) => void;
    dismissAll: () => void;
  };
};

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

/*
 * Default duration for each toast type.
 *
 * success = 3 seconds
 * info    = 5 seconds
 * error   = 10 seconds
 */
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  info: 5000,
  error: 10000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = ++toastId;

      const newToast: ToastData = {
        id,
        type,
        message,
        description: options?.description,

        // Use custom duration if provided,
        // otherwise use the duration for this toast type.
        duration: options?.duration ?? DEFAULT_DURATIONS[type],
      };

      setToasts((current) => [...current, newToast]);
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("success", message, options);
    },
    [showToast],
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("error", message, options);
    },
    [showToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast("info", message, options);
    },
    [showToast],
  );

  const dismiss = useCallback((id?: number) => {
    if (id === undefined) {
      setToasts([]);
      return;
    }

    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success,
          error,
          info,
          dismiss,
          dismissAll,
        },
      }}
    >
      {children}

      <StarkToast
        toasts={toasts}
        onClose={dismiss}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

/* ========================================================= */
/* Toast                                                       */
/* ========================================================= */

type StarkToastProps = {
  toasts: ToastData[];
  onClose: (id: number) => void;
};

function StarkToast({
  toasts,
  onClose,
}: StarkToastProps) {
  const foreground = useColor("foreground");
  const background = useColor("background");
  const mutedForeground = useColor("mutedForeground");

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 99999,
        elevation: 999,
      }}
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          onClose={() => onClose(toast.id)}
          foreground={foreground}
          background={background}
          mutedForeground={mutedForeground}
        />
      ))}
    </View>
  );
}

/* ========================================================= */
/* Toast Item                                                  */
/* ========================================================= */

type ToastItemProps = {
  toast: ToastData;
  index: number;
  onClose: () => void;
  foreground: string;
  background: string;
  mutedForeground: string;
};

function ToastItem({
  toast,
  index,
  onClose,
  foreground,
  background,
  mutedForeground,
}: ToastItemProps) {
  /*
   * Start above the screen and animate down into position.
   */
  const translateY = useRef(
    new Animated.Value(-90),
  ).current;

  const opacity = useRef(
    new Animated.Value(0),
  ).current;

  const scale = useRef(
    new Animated.Value(0.96),
  ).current;

  const mounted = useRef(false);

  const timeoutRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const isClosing = useRef(false);

  /*
   * Toast colors
   */
  const config = {
    success: {
      background: "#f0fdf4",
      border: "#bbf7d0",
      iconBackground: "#22c55e",
      icon: Check,
    },

    error: {
      background: "#fef2f2",
      border: "#fecaca",
      iconBackground: "#ef4444",
      icon: CircleAlert,
    },

    info: {
      background: "#eff6ff",
      border: "#bfdbfe",
      iconBackground: "#3b82f6",
      icon: Info,
    },
  };

  const {
    background: toastBackground,
    border,
    iconBackground,
    icon: Icon,
  } = config[toast.type];

  /*
   * Clear timeout
   */
  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  /*
   * Close animation
   */
  const close = () => {
    if (isClosing.current) {
      return;
    }

    isClosing.current = true;

    clearTimeoutRef();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -90,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 0.96,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  /*
   * Animate toast into the stack.
   */
  useEffect(() => {
    if (mounted.current) {
      return;
    }

    mounted.current = true;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),

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

    return () => {
      clearTimeoutRef();
    };
  }, []);

  /*
   * Auto dismiss
   */
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      close();
    }, toast.duration);

    return () => {
      clearTimeoutRef();
    };
  }, [toast.id, toast.duration]);

  return (
    <Animated.View
      style={{
        width: "100%",

        // Small gap above the first toast.
        marginTop: index === 0 ? 30 : 0,

        marginBottom: 10,

        opacity,

        transform: [
          {
            translateY,
          },
          {
            scale,
          },
        ],
      }}
    >
      <View
        style={{
          width: "100%",
          minHeight: 72,

          flexDirection: "row",
          alignItems: "center",

          paddingLeft: 14,
          paddingRight: 8,
          paddingVertical: 16,

          borderRadius: 18,

          backgroundColor: toastBackground,

          borderWidth: 1,
          borderColor: border,

          elevation: 8,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.12,
          shadowRadius: 10,
        }}
      >
        {/* Icon */}

        <View
          style={{
            width: 36,
            height: 36,

            alignItems: "center",
            justifyContent: "center",

            borderRadius: 999,

            backgroundColor: iconBackground,
          }}
        >
          <Icon
            size={20}
            color="#ffffff"
            strokeWidth={2.7}
          />
        </View>

        {/* Content */}

        <View
          style={{
            flex: 1,
            marginLeft: 11,
            paddingRight: 8,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: "700",
              lineHeight: 19,
              color: iconBackground,
            }}
          >
            {toast.message}
          </Text>

          {toast.description ? (
            <Text
              numberOfLines={2}
              style={{
                marginTop: 3,
                fontSize: 12,
                lineHeight: 17,
                color: mutedForeground,
              }}
            >
              {toast.description}
            </Text>
          ) : null}
        </View>

        {/* Close */}

        <Pressable
          onPress={close}
          hitSlop={8}
          style={{
            width: 38,
            height: 38,

            alignItems: "center",
            justifyContent: "center",

            borderRadius: 999,
          }}
        >
          <X
            size={18}
            color={mutedForeground}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}