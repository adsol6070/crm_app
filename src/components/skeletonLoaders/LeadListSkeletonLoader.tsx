import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const LeadListSkeletonLoader = () => {
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
    outputRange: ["#e0e0e0", "#f5f5f5"],
  });

  return (
    <View style={styles.skeletonContainer}>
      {/* Skeleton for the Visa Filter and Delete All button */}
      <View style={styles.skeletonFilterContainer}>
        <Animated.View style={[styles.skeletonVisaFilter, { backgroundColor }]} />
        <Animated.View style={[styles.skeletonDeleteButton, { backgroundColor }]} />
      </View>

      <View style={styles.skeletonLeadCountContainer}>
        <Animated.View style={[styles.skeletonLeadCount, { backgroundColor }]} />
      </View>

      {/* Skeleton items for the leads */}
      {[...Array(8)].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <Animated.View style={[styles.skeletonLeadName, { backgroundColor }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  skeletonFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  skeletonLeadCount: {
    width: 100,
    height: 30,
    borderRadius: 20,
  },
  skeletonLeadCountContainer: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: "center",
    marginBottom: 15,
  },
  skeletonVisaFilter: {
    width: "67%",
    height: 45,
    borderRadius: 20,
  },
  skeletonDeleteButton: {
    width: 90,
    height: 40,
    borderRadius: 20,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonLeadName: {
    width: "100%",
    height: 30,
    borderRadius: 4,
  },
  
});

export default LeadListSkeletonLoader;
