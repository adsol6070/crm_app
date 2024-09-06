import React from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

const DetailSkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      {/* Profile Image Skeleton */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageSkeleton} />
      </View>

      {/* User Info Skeleton */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userNameSkeleton} />
        <View style={styles.userRoleSkeleton} />
      </View>

      {/* Details Skeleton */}
      <View style={styles.detailsContainer}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.detailItemSkeleton} />
        ))}
      </View>

      {/* Button Skeleton */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeleton} />
      </View>

      {/* Animated Shimmer Effect */}
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
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  profileImageSkeleton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userNameSkeleton: {
    width: 200,
    height: 24,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
  },
  userRoleSkeleton: {
    width: 100,
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItemSkeleton: {
    height: 90,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSkeleton: {
    width: 60,
    height: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
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

export default DetailSkeletonLoader;
