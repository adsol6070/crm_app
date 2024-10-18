import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { theme } from "../constants/theme";

const SkeletonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [
      -Dimensions.get("window").width,
      Dimensions.get("window").width,
    ],
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonProfileImage}>
        <Animated.View
          style={[
            styles.shimmerEffect,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <View style={styles.skeletonProfileText}>
        <Animated.View
          style={[
            styles.shimmerEffect,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <View style={styles.skeletonProfileTextSmall}>
        <Animated.View
          style={[
            styles.shimmerEffect,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  skeletonProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    marginBottom: 12,
  },
  skeletonProfileText: {
    width: 120,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    marginBottom: 6,
  },
  skeletonProfileTextSmall: {
    width: 80,
    height: 15,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff80",
    opacity: 0.5,
  },
});

export default SkeletonLoader;
