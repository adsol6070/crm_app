import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const ReadBlogSkeletonLoader = ({ width, height, style }: any) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e0e0e0', '#f5f5f5'],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, backgroundColor },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginVertical: 8,
    },
});

export default ReadBlogSkeletonLoader;
