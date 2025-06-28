// hooks/useErrorMessage.ts
import { useState, useEffect } from "react";
import { Animated, Keyboard, Vibration } from "react-native";

export interface ErrorMessage {
  id: string;
  message: string;
  timestamp: number;
}

export default function useErrorMessage() {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [slideAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      if (errorMessage) {
        dismissError();
      }
    });

    return () => keyboardDidShow.remove();
  }, [errorMessage]);

  const showError = (message: string) => {
    if(message?.length===0){
        return
    }
    const newError: ErrorMessage = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
    };

    // Prevent duplicate error messages
    if (errorMessage?.message === message) {
      Vibration.vibrate(100);
      return;
    }

    // Dismiss existing error first
    if (errorMessage) {
      dismissError();
    }

    setErrorMessage(newError);
    slideAnim.setValue(100);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      dismissError();
    }, 3000);

    Vibration.vibrate(100);
  };

  const dismissError = () => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setErrorMessage(null));
  };

  return {
    errorMessage,
    showError,
    dismissError,
    slideAnim,
  };
}
