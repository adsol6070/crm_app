import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const LeadDetailSkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e0e0e0", "#d3d3d3"],
  });

  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonStatusContainer}>
        <Animated.View style={[styles.skeletonStatus, { backgroundColor }]} />
      </View>

      {[...Array(4)].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <Animated.View
            style={[styles.skeletonDetailBox, { backgroundColor }]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: 5,
  },
  skeletonStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  skeletonStatus: {
    width: "100%",
    height: 40,
    borderRadius: 10,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonDetailBox: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default LeadDetailSkeletonLoader;
