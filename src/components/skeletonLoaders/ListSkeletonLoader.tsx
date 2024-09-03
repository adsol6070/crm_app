import React from "react";
import { View, Animated, StyleSheet } from "react-native";

const ListSkeletonLoader = ({
  showHeading = false, 
  itemCount = 8,      // Number of skeleton items
  itemHeight = 30,    // Height of the list items
}) => {
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
      {showHeading && (
        <View>
          <Animated.View
            style={[styles.skeletonHeadingFirstLine, { backgroundColor }]}
          />
          <Animated.View
            style={[styles.skeletonHeadingSecondLine, { backgroundColor }]}
          />
        </View>
      )}

      {[...Array(itemCount)].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <Animated.View
            style={[
              styles.skeletonDocumentList,
              { backgroundColor, height: itemHeight },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: 22,
  },
  skeletonHeadingFirstLine: {
    width: "100%",
    height: 30,
    marginBottom: 10,
  },
  skeletonHeadingSecondLine: {
    width: "50%",
    height: 30,
    marginBottom: 30,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonDocumentList: {
    width: "100%",
    borderRadius: 4,
  },
});

export default ListSkeletonLoader;
