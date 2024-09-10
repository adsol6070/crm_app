import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../../constants/theme';
import { skeletonLoader } from '../../../components/skeletonLoaders';
import useLeadData from '../useLeadDetail';
import Header1 from '../../../components/Header1';

const LeadDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { leadId }: any = route.params;
    const { leadDetail, loading } = useLeadData(leadId);
    const renderHeader = () => (
        <Header1
            title="Lead Detail"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
        />
    );

    type LeadStatus = 'pending' | 'inprogress' | 'completed' | 'New';

    const statusColors = {
        'pending': '#E2B263',
        'inprogress': '#007BFF',
        'completed': '#28A745',
        'New': '#757373',
    };

    const Badge = ({ status }: { status: LeadStatus }) => {
        const badgeColor = statusColors[status] || '#6c757d';
        return (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{status}</Text>
            </View>
        );
    };

    const renderContent = () => {
        if (!leadDetail || Object.keys(leadDetail).length === 0) return null;

        const { id, tenantID, leadStatus, created_at, updated_at, userID, ...otherDetails } = leadDetail;

        const formatValue = (value: any) => {
            if (value == null || value === '') return 'N/A';
            if (typeof value === 'string' && value.includes('T')) {
                return new Date(value).toLocaleDateString();
            }
            return value;
        };

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Badge status={leadDetail.leadStatus == null ?'New':leadStatus} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System Information</Text>
                    {['id', 'tenantID', 'created_at', 'updated_at', 'userID'].map(key => (
                        <View style={styles.infoRow} key={key}>
                            <Text style={styles.infoLabel}>{formatLabel(key)}:</Text>
                            <Text style={styles.infoValue}>{formatValue(leadDetail[key])}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.section}>       
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    {['firstname', 'lastname', 'email', 'phone', 'gender', 'dob', 'nationality', 'maritalStatus', 'currentAddress', 'permanentAddress'].map(key => (
                        <View style={styles.infoRow} key={key}>
                            <Text style={styles.infoLabel}>{formatLabel(key)}:</Text>
                            <Text style={styles.infoValue}>{formatValue(leadDetail[key])}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Immigration Information</Text>
                    {['followUpDates', 'visaCategory', 'countryOfInterest', 'passportNumber', 'passportExpiry', 'visaExpiryDate', 'courseOfInterest', 'desiredFieldOfStudy', 'preferredInstitutions', 'intakeSession', 'reasonForImmigration', 'financialSupport', 'sponsorDetails'].map(key => (
                        <View style={styles.infoRow} key={key}>
                            <Text style={styles.infoLabel}>{formatLabel(key)}:</Text>
                            <Text style={styles.infoValue}>{formatValue(leadDetail[key])}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Academic Information</Text>
                    {['highestQualification', 'scholarships', 'fieldOfStudy', 'institutionName', 'graduationYear', 'grade', 'testType', 'testScore'].map(key => (
                        <View style={styles.infoRow} key={key}>
                            <Text style={styles.infoLabel}>{formatLabel(key)}:</Text>
                            <Text style={styles.infoValue}>{formatValue(leadDetail[key])}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const formatLabel = (key: string) => {
        const labels: { [key: string]: string } = {
            firstname: 'First Name',
            lastname: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            gender: 'Gender',
            dob: 'Date of Birth',
            nationality: 'Nationality',
            maritalStatus: 'Marital Status',
            currentAddress: 'Current Address',
            permanentAddress: 'Permanent Address',
            followUpDates: 'Follow Up Dates',
            visaCategory: 'Visa Category',
            countryOfInterest: 'Country of Interest',
            passportNumber: 'Passport Number',
            passportExpiry: 'Passport Expiry',
            visaExpiryDate: 'Visa Expiry Date',
            courseOfInterest: 'Course of Interest',
            desiredFieldOfStudy: 'Desired Field of Study',
            preferredInstitutions: 'Preferred Institutions',
            intakeSession: 'Intake Session',
            reasonForImmigration: 'Reason for Immigration',
            financialSupport: 'Financial Support',
            sponsorDetails: 'Sponsor Details',
            highestQualification: 'Highest Qualification',
            scholarships: 'Scholarships',
            fieldOfStudy: 'Field of Study',
            institutionName: 'Institution Name',
            graduationYear: 'Graduation Year',
            marks: 'Marks',
            certificationDetails: 'Certification Details',
            id: 'ID',
            tenantID: 'Tenant ID',
            created_at: 'Created At',
            updated_at: 'Updated At',
            userID: 'User ID'
        };
        return labels[key] || key;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderHeader()}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {loading ? (
                    <skeletonLoader.LeadDetailSkeletonLoader />
                ) : (
                    renderContent()
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.COLORS.secondaryWhite,
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    container: {
        flex: 1,
        padding: 10,
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    section: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        borderColor: theme.COLORS.black,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 20,
        color: theme.COLORS.black,
        borderBottomWidth: 1,
        paddingBottom: 10,
        ...theme.FONTS.Mulish_700Bold
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        color: theme.COLORS.black,
        width: '40%',
        ...theme.FONTS.Mulish_700Bold
    },
    infoValue: {
        color: theme.COLORS.black,
        width: '60%',
        ...theme.FONTS.Mulish_400Regular
    },
    badge: {
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LeadDetail;
