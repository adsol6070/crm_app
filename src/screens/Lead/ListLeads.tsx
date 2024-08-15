import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { components } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const ListLeads = () => {
    
    const renderHeader = () => {
        return (
            <components.Header
                title="List Leads"
                goBack={true}
            />
        );
    };

    const renderContent = () => {
        return (
            <View>
                <Text>ListLeads</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {renderHeader()}
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
});

export default ListLeads