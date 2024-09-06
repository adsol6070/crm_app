import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const RoleDetailSkeletonLoader = ({ isLoading }) => {
  const shimmerAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.subTitle} />
        <View style={styles.moduleContainer} />
        <View style={styles.moduleContainer} />
        <View style={styles.moduleContainer} />
      </View>

      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    position: "relative",
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
    marginTop: 75,
  },
  description: {
    height: 20,
    marginBottom: 20,
    backgroundColor: "#E0E0E0",
    width: "100%",
  },
  subTitle: {
    height: 20,
    backgroundColor: "#E0E0E0",
    width: 110,
    marginBottom: 10,
  },
  moduleContainer: {
    height: 120,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "200%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
});

export default RoleDetailSkeletonLoader;
