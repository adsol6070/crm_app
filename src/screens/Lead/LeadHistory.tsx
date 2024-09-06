import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { components } from '../../components';
import { theme } from '../../constants/theme';
import { leadService } from '../../api/lead';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { skeletonLoader } from '../../components/skeletonLoaders';
import Header1 from '../../components/Header1';

const getStatusColor = (status: any) => {
    switch (status) {
        case 'new':
            return 'gray';
        case 'inprogress':
            return '#ff8a05';
        case 'pending':
            return '#e3a00e';
        case 'completed':
            return '#2596be';
        default:
            return theme.COLORS.black;
    }
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};

const transformLeadHistory = (leadHistory: any[]) => {
    return leadHistory.map((entry) => {
        let action = ''
        let details = entry.details

        if (entry.details.updatedBy) {
            action = `Updated by ${entry.details.updatedBy.firstname} ${entry.details.updatedBy.lastname}`
        } else if (entry.details.createdBy) {
            action = `Created by ${entry.details.createdBy.firstname} ${entry.details.createdBy.lastname}`
        } else if (entry.details.statusUpdatedBy) {
            action = `Status Updated by ${entry.details.statusUpdatedBy.firstname} ${entry.details.statusUpdatedBy.lastname}`
        } else {
            action = entry.action
        }

        return {
            action,
            timestamp: entry.timestamp,
            details,
        }
    })
}

const LeadHistory = () => {
    const [leadHistory, setLeadHistory] = useState(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { leadId }: any = route.params;

    const getHistoryData = async () => {
        setLoading(true);
        try {
            const response = await leadService.getHistory(leadId);
            const { fullLeadHistory }: any = response;
            const formatted: any = transformLeadHistory(fullLeadHistory);
            setLeadHistory(formatted);
        } catch (error) {
            console.error("Error fetching lead history:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getHistoryData();
    }, [])


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await leadService.getHistory(leadId);
            const { fullLeadHistory }: any = response;
            const formatted: any = transformLeadHistory(fullLeadHistory);
            setLeadHistory(formatted);
        } catch (error) {
            console.error("Error fetching lead history:", error);
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const renderHeader = () => (
        <Header1
            title="Lead History"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
        />
    );

    const renderItem = ({ item, index }: any) => {
        let icon;
        switch (item.action) {
            case "Created":
                icon = <MaterialIcons name="create" size={20} color={theme.COLORS.black} />;
                break;
            case "Status Updated":
                icon = <MaterialIcons name="update" size={20} color={theme.COLORS.black} />;
                break;
            case "Updated":
                icon = <MaterialIcons name="edit" size={20} color={theme.COLORS.black} />;
                break;
            case "Lead assigned successfully":
                icon = <MaterialIcons name="person-add" size={20} color={theme.COLORS.black} />;
                break;
            default:
                icon = <MaterialIcons name="info" size={20} color={theme.COLORS.black} />;
        }

        return (
            <View style={styles.itemContainer}>
                <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                        {icon}
                        <Text style={styles.action}>{item.action}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        {(item.details.previousStatus == null ? 'new' : item.details.previousStatus) && item.details.upcomingStatus && (
                            <View style={styles.progressLineContainer}>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.details.previousStatus == null ? 'new' : item.details.previousStatus) }]}>
                                    <Text style={styles.badgeText}>{item.details.previousStatus == null ? 'new' : item.details.previousStatus}</Text>
                                </View>
                                <View style={styles.progressLine}>
                                    <View style={[styles.progressSegment, { backgroundColor: getStatusColor(item.details.upcomingStatus == null ? 'new' : item.details.upcomingStatus) }]} />
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.details.upcomingStatus == null ? 'new' : item.details.upcomingStatus) }]}>
                                    <Text style={styles.badgeText}>{item.details.upcomingStatus}</Text>
                                </View>
                            </View>
                        )}
                        {item.details.statusUpdatedBy && (
                            <Text style={styles.details}>
                                Status updated by {item.details.statusUpdatedBy.firstname} {item.details.statusUpdatedBy.lastname}
                            </Text>
                        )}
                        {item.details.updatedBy && (
                            <Text style={styles.details}>
                                Updated by {item.details.updatedBy.firstname} {item.details.updatedBy.lastname}
                            </Text>
                        )}
                        {item.details.assignedAgents && item.details.assignedAgents.length > 0 && (
                            <Text style={styles.details}>
                                Assigned to {item.details.assignedAgents.map((agent: any) => `${agent.firstname} ${agent.lastname}`).join(', ')}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {loading ? (
                <skeletonLoader.ListSkeletonLoader
                    itemCount={4}
                    itemHeight={100}
                />
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={leadHistory}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        position: 'relative',
    },
    stepNumberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 10,
    },
    stepNumber: {
        color: theme.COLORS.white,
        fontSize: 16,
        ...theme.FONTS.Mulish_400Regular
    },
    itemContent: {
        flex: 1,
        marginLeft: 40,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    action: {
        fontSize: 16,
        marginLeft: 10,
        ...theme.FONTS.Mulish_700Bold
    },
    detailsContainer: {
        marginVertical: 8,
    },
    details: {
        fontSize: 14,
        color: 'gray',
        ...theme.FONTS.Mulish_400Regular
    },
    timestamp: {
        fontSize: 12,
        color: theme.COLORS.gray1,
        marginTop: 4,
        ...theme.FONTS.Mulish_400Regular
    },
    progressLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    progressLine: {
        flex: 1,
        height: 2,
        backgroundColor: 'lightgray',
        borderRadius: 1,
        marginHorizontal: 10,
        position: 'relative',
    },
    progressSegment: {
        height: 2,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    statusBadge: {
        backgroundColor: theme.COLORS.primary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 5,
    },
    badgeText: {
        color: theme.COLORS.white,
        fontSize: 14,
    },
});

export default LeadHistory;
