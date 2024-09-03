// SkeletonLoader.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const BlogListSkeletonLoader: React.FC = () => {
  const animatedValue = new Animated.Value(0);

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

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f5f5f5'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, { backgroundColor }]} />
      <View style={styles.textContainer}>
        <Animated.View style={[styles.title, { backgroundColor }]} />
        <Animated.View style={[styles.date, { backgroundColor }]} />
        <Animated.View style={[styles.description, { backgroundColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 16,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  textContainer: {
    marginTop: 12,
  },
  title: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  date: {
    width: '40%',
    height: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  description: {
    width: '80%',
    height: 16,
    borderRadius: 4,
  },
});

export default BlogListSkeletonLoader;
