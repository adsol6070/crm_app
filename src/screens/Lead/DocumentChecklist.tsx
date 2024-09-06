import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../../constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';
import { components } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native";
import { leadService } from '../../api/lead';
import { skeletonLoader } from '../../components/skeletonLoaders';
import Header1 from '../../components/Header1';

type RootStackParamList = {
    DocumentUpload: { leadId: string, documentName: string };
};

const DocumentChecklist = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { leadId, visaType }: any = route.params;
    const [checklist, setChecklist] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const getChecklist = async (leadId: string) => {
        setLoading(true);
        try {
            const response: any = await leadService.getLeadById(leadId);
            const visaCategory = response.visaCategory;
            const checklist: any = await leadService.getChecklistByVisaType(visaCategory);
            const documentList = checklist.checklists.checklist;

            const uploadedDocsResponse: any = await leadService.getUploadedDocuments(leadId);
            const uploadedDocNames = uploadedDocsResponse.documents.map((doc: any) => doc.name);

            const updatedChecklist = documentList.map((item: any) => ({
                ...item,
                uploaded: uploadedDocNames.includes(item.name),
            }));

            setChecklist(updatedChecklist);
        } catch (error) {
            console.error("Error fetching document checklist", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getChecklist(leadId);
    }, [leadId]);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getChecklist(leadId);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const renderHeader = () => {
        return (
            <Header1
                title="Document Checklist"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <SafeAreaView style={styles.container}>
                    <skeletonLoader.ListSkeletonLoader
                        showHeading={true}
                        itemCount={5}
                        itemHeight={40}
                    />
                </SafeAreaView>
            );
        }

        if (checklist.length === 0) {
            return <Text style={styles.noDataText}>No documents available</Text>;
        }

        return (
            <View>
                <View style={styles.headingContainer}>
                    <Text style={styles.title}>Select the type of document you want to upload</Text>
                </View>
                <View style={styles.listContainer}>
                    {checklist.map((item: any, index: any) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate("DocumentUpload", { leadId: leadId, documentName: item.name })}
                        >
                            <View style={styles.listItem}>
                                <Text>{item.name}</Text>
                                <View style={styles.iconContainer}>
                                    {item.uploaded ? (
                                        <Ionicons name="checkmark-circle" size={20} color="green" />
                                    ) :
                                        <Ionicons name="arrow-forward" size={20} color={theme.COLORS.black} />
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {renderHeader()}
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    headingContainer: {
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 5,
        marginRight: 30,
    },
    title: {
        fontSize: 20,
        ...theme.FONTS.Mulish_600SemiBold
    },
    listContainer: {
        margin: 20,
    },
    listItem: {
        fontSize: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingEnd: 10,
        paddingStart: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#afafaf',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        ...theme.FONTS.Mulish_400Regular
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'grey',
    }
});

export default DocumentChecklist