import React from "react";
import { View, StyleSheet } from "react-native";

interface SkeletonLoaderProps {
  countOnly?: boolean;
  withImage?: boolean;
}

const SkeletonLoader = ({
  countOnly = false,
  withImage = false,
}: SkeletonLoaderProps) => {
  return (
    <View style={[styles.container, countOnly && styles.containerCountOnly]}>
      {countOnly ? (
        <View style={styles.skeletonCount} />
      ) : (
        <>
          {withImage && <View style={styles.skeletonImage} />}
          <View style={styles.skeletonText} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  containerCountOnly: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
  containerWithImage: {
    paddingVertical: 0,
  },
  skeletonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  skeletonText: {
    marginLeft: 15,
    flex: 1,
    height: 20,
    backgroundColor: "#e0e0e0",
  },
  skeletonCount: {
    width: 100,
    height: 20,
    backgroundColor: "#e0e0e0",
  },
});

export default SkeletonLoader;
