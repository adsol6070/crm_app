import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

const Spinner = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={theme.COLORS.primary} />
      <Text style={styles.loaderText}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.COLORS.primary,
  },
});

export default Spinner