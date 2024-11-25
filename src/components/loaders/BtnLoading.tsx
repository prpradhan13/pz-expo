import React, { useEffect, useRef } from "react";
import Svg, { Circle } from "react-native-svg";
import { Animated, Easing } from "react-native";

const BtnLoading = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
  }, [rotation]);

  const spinInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spinInterpolation }] }}>
      <Svg viewBox="25 25 50 50" width={32} height={32}>
        <Circle
          r="20"
          cy="50"
          cx="50"
          fill="none"
          stroke="#4A90E2" // Use your desired color
          strokeWidth="4"
          strokeDasharray="1, 200"
          strokeDashoffset="0"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

export default BtnLoading;
