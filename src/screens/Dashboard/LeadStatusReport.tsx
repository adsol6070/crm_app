import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeadStatusReport = () => {
    const data = {
        labels: ['Lead A', 'Lead B', 'Lead C', 'Lead D', 'Lead E'], 
        datasets: [
            {
                data: [20, 45, 28, 80, 99], 
            },
        ],
    };

    return (
            <View style={styles.container}>
                <Text style={styles.title}>Lead Status Report</Text>
                <BarChart
                    data={data}
                    width={Dimensions.get('window').width - 32}
                    height={220}
                    fromZero={true}
                    showBarTops={true}
                    chartConfig={{
                        backgroundColor: '#e67e22',
                        backgroundGradientFrom: '#e67e22',
                        backgroundGradientTo: '#e67e22',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForBackgroundLines: {
                            strokeWidth: 0,
                            stroke: "#e3e3e3",
                        },
                    }}
                    yAxisLabel="$" 
                    yAxisSuffix=""
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default LeadStatusReport;
