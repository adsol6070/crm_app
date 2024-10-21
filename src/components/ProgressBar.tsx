import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  totalDocuments: any;
  uploadedDocuments: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalDocuments, uploadedDocuments }) => {
  const progressPercentage = totalDocuments ? (uploadedDocuments / totalDocuments) * 100 : 0;

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        <View style={styles.progressBarLabel}>
          <Text style={styles.progressText}>
            {`${uploadedDocuments} of ${totalDocuments}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',
    borderRadius: 5,
  },
  progressBarBackground: {
    backgroundColor: '#b5b5b5',
    height: 20,
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#4caf50',
    height: '100%',
    borderRadius: 5,
  },
  progressBarLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressBar;
