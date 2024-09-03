import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { components } from '../../components';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { leadService } from '../../api/lead';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../common/context/AuthContext';
import { genderOptions, maritalStatusOptions, nationalityOptions } from '../../utils/options';
import { theme } from '../../constants/theme';
import { skeletonLoader } from '../../components/skeletonLoaders';

const EditLead = () => {
    const route = useRoute();
    const { leadId }: any = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const navigation = useNavigation();
    const [visaCategories, setVisaCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dob, setDob] = useState<Date | undefined>(undefined);
    const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
    const [passportExpiryDate, setPassportExpiryDate] = useState<Date | undefined>(undefined);

    // Define validation schema
    const schema = yup.object().shape({
        firstname: yup.string().required("First name is required"),
        lastname: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        phone: yup.string().required("Phone number is required"),
        currentAddress: yup.string().required("Current address is required"),
        permanentAddress: yup.string().required("Permanent address is required"),
        gender: yup.string().required("Gender is required"),
        dob: yup.date().required("Date of birth is required"),
        visaCategory: yup.string().required("Visa category is required"),
        country: yup.string().required("Country is required"),
        state: yup.string().required("State is required"),
        district: yup.string().required("District is required"),
        city: yup.string().required("City is required"),
        pincode: yup.string().required("Pincode is required"),
        nationality: yup.string().required("Nationality is required"),
        maritalStatus: yup.string().required("Marital Status is required"),
        highestQualification: yup.string().required('Please enter your Highest Qualification').trim(),
        fieldOfStudy: yup.string(),
        institutionName: yup.string(),
        graduationYear: yup.string(),
        grade: yup.string(),
        testType: yup.string(),
        testScore: yup.string(),
        passportNumber: yup.string().nullable().matches(/(^$)|(^[A-PR-WYa-pr-wy][0-9]\d\s?\d{4}[0-9]$)/, 'Passport number must be exactly 8 characters').trim(),
        passportExpiry: yup.date(),
        courseOfInterest: yup.string(),
        countryOfInterest: yup.string(),
        desiredFieldOfStudy: yup.string(),
        preferredInstitutions: yup.string(),
        intakeSession: yup.string(),
        reasonForImmigration: yup.string(),
        financialSupport: yup.string(),
        sponsorDetails: yup.string(),
        scholarships: yup.string(),
        communicationMode: yup.string(),
        preferredContactTime: yup.string(),
        leadSource: yup.string(),
        referralContact: yup.string(),
        followUpDates: yup.date(),
        leadRating: yup.string(),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getLeadDetails();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const getLeadDetails = async () => {
        setLoading(true)
        try {
            const response: any = await leadService.getLeadById(leadId);
            setDob(response.dob);
            setFollowUpDate(response.followUpDates)
            setPassportExpiryDate(response.passportExpiry);
            reset({
                firstname: response.firstname,
                lastname: response.lastname,
                email: response.email,
                phone: response.phone,
                currentAddress: response.currentAddress,
                permanentAddress: response.permanentAddress,
                dob: response.dob,
                gender: response.gender,
                country: response.country,
                district: response.district,
                state: response.state,
                city: response.city,
                pincode: response.pincode,
                nationality: response.nationality,
                maritalStatus: response.maritalStatus,
                passportNumber: response.passportNumber,
                passportExpiry: response.passportExpiry,
                visaCategory: response.visaCategory,
                highestQualification: response.highestQualification,
                fieldOfStudy: response.fieldOfStudy,
                institutionName: response.institutionName,
                graduationYear: response.graduationYear,
                grade: response.grade,
                testType: response.testType,
                testScore: response.testScore,
                intakeSession: response.intakeSession,
                reasonForImmigration: response.reasonForImmigration,
                financialSupport: response.financialSupport,
                sponsorDetails: response.sponsorDetails,
                courseOfInterest: response.courseOfInterest,
                countryOfInterest: response.countryOfInterest,
                desiredFieldOfStudy: response.desiredFieldOfStudy,
                scholarships: response.scholarships,
                communicationMode: response.communicationMode,
                preferredContactTime: response.preferredContactTime,
                preferredInstitutions: response.preferredInstitutions,
                leadSource: response.leadSource,
                referralContact: response.referralContact,
                followUpDates: response.followUpDates,
                leadRating: response.leadRating,
            });
        } catch (error) {
            console.error("Error fetching lead details", error);
        } finally {
            setLoading(false)
        }
    };

    const getCategories = async () => {
        try {
            const response: any = await leadService.getVisaCategory();
            const newCategories = response.map((category: any) => {
                return {
                    value: category.category,
                    label: category.category,
                }
            })
            setVisaCategories(newCategories);
        } catch (error) {
            console.error("Error fetching visa categories", error);
        }
    }

    useEffect(() => {
        getLeadDetails();
        getCategories();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const updatedLeadData = {
                ...data, tenantID: user?.tenantID, userID: user?.sub
            };
            console.log("updatedData ", updatedLeadData)
            await leadService.updateLeadById(leadId, updatedLeadData);
            Alert.alert('Lead Updated Successfully');
        } catch (error) {
            console.log("Error updating lead ", error);
        }
    };


    const renderHeader = () => (
        <components.Header1
            title="Edit Lead"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
            actionIcon='save'
            onActionPress={handleSubmit(onSubmit)}
        />
    );

    const renderContent = () => (
        <View style={styles.fieldContainer}>
            <Controller
                control={control}
                name="firstname"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="First Name"
                        placeholder="Enter first name"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.firstname?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="lastname"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Last Name"
                        placeholder="Enter last name"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.lastname?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Email"
                        placeholder="Enter email"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.email?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Phone"
                        placeholder="Enter phone number"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.phone?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="currentAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Current Address"
                        placeholder="Enter current address"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.currentAddress?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="permanentAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Permanent Address"
                        placeholder="Enter permanent address"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.permanentAddress?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Gender"
                        placeholder="Select gender"
                        containerStyle={{ marginBottom: 20 }}
                        dropdown={true}
                        items={genderOptions}
                        selectedValue={value}
                        onValueChange={(val) => onChange(val)}
                        onBlur={onBlur}
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        error={errors.gender?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        date={dob}
                        title="DOB"
                        placeholder="Select Date of Birth"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onDateChange={(date) => {
                            if (date) {
                                onChange(date.toDateString());
                            } else {
                                onChange('');
                            }
                        }}
                        onBlur={onBlur}
                        value={value ? new Date(value).toDateString() : ''}
                        error={errors.dob?.message}
                        datePicker={true}
                        disableFutureDates={true}
                    />
                )}
            />
            <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Country"
                        placeholder="Enter country"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.country?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="State"
                        placeholder="Enter state"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.state?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="district"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="District"
                        placeholder="Enter district"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.district?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="City"
                        placeholder="Enter city"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.city?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="pincode"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Pincode"
                        placeholder="Enter pincode"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.pincode?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="nationality"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Nationality"
                        placeholder="Select nationality"
                        containerStyle={{ marginBottom: 20 }}
                        dropdown={true}
                        items={nationalityOptions}
                        selectedValue={value}
                        onValueChange={(val) => onChange(val)}
                        onBlur={onBlur}
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        error={errors.nationality?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="maritalStatus"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Marital Status"
                        placeholder="Select Marital Status"
                        containerStyle={{ marginBottom: 20 }}
                        dropdown={true}
                        items={maritalStatusOptions}
                        selectedValue={value}
                        onValueChange={(val) => onChange(val)}
                        onBlur={onBlur}
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        error={errors.maritalStatus?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="passportNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Passport Number"
                        placeholder="Enter passport number"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value ?? ''}
                        error={errors.passportNumber?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="passportExpiry"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        date={passportExpiryDate}
                        title="Passport Expiry"
                        placeholder="Select passport expiry"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onDateChange={(date) => {
                            if (date) {
                                onChange(date.toISOString());
                            } else {
                                onChange('');
                            }
                        }}
                        onBlur={onBlur}
                        value={value ? new Date(value).toDateString() : ''}
                        error={errors.passportExpiry?.message}
                        datePicker={true}
                    />
                )}
            />
            <Controller
                control={control}
                name="visaCategory"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Visa Category"
                        placeholder="Select visa category"
                        containerStyle={{ marginBottom: 20 }}
                        dropdown={true}
                        items={visaCategories}
                        selectedValue={value}
                        onValueChange={(val) => onChange(val)}
                        onBlur={onBlur}
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        error={errors.visaCategory?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="highestQualification"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Highest Qualification"
                        placeholder="Enter Highest Qualification"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.highestQualification?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="fieldOfStudy"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Field of Study"
                        placeholder="Enter Field of Study"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.fieldOfStudy?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="institutionName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Institution Name"
                        placeholder="Enter Institution Name"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.institutionName?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="courseOfInterest"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Course of Interest"
                        placeholder="Enter Course of Interest"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.courseOfInterest?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="graduationYear"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Graduation Year"
                        placeholder="Enter Graduation Year"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.graduationYear?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="grade"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Grade/Percentage/CGPA"
                        placeholder="Enter Grade/Percentage/CGPA"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.grade?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="testType"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Test Type"
                        placeholder="Enter Test Type"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.grade?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="testScore"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Test Score"
                        placeholder="Enter Test Score"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.testType?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="countryOfInterest"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Country Of Interest"
                        placeholder="Enter countryOfInterest"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.countryOfInterest?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="desiredFieldOfStudy"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Desired Field of Study"
                        placeholder="Enter Desired Field of Study"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.desiredFieldOfStudy?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="preferredInstitutions"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Preferred Institutions"
                        placeholder="Enter Preferred Institutions"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.preferredInstitutions?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="intakeSession"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Intake Session"
                        placeholder="Enter Intake Session"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.intakeSession?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="reasonForImmigration"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Reason for Immigration"
                        placeholder="Enter Reason for Immigration"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.reasonForImmigration?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="financialSupport"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Financial Support"
                        placeholder="Enter Financial Support"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.financialSupport?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="sponsorDetails"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Sponsor Details"
                        placeholder="Enter Sponsor Details"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.sponsorDetails?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="scholarships"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Scholarships/Grants"
                        placeholder="Enter Scholarships/Grants"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.scholarships?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="communicationMode"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Preferred Mode of Communication"
                        placeholder="Write Here"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.communicationMode?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="preferredContactTime"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Preferred Time for Contact"
                        placeholder="Write Here"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.preferredContactTime?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="leadSource"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Source of Lead"
                        placeholder="Enter Source of Lead"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.leadSource?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="referralContact"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Referral Name/Contact"
                        placeholder="Enter Referral Name/Contact"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.referralContact?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="followUpDates"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        date={followUpDate}
                        title="Follow Up Dates"
                        placeholder="Select followUp dates"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onDateChange={(date) => {
                            if (date) {
                                onChange(date.toISOString());
                            } else {
                                onChange('');
                            }
                        }}
                        onBlur={onBlur}
                        value={value ? new Date(value).toDateString() : ''}
                        error={errors.followUpDates?.message}
                        datePicker={true}
                    />
                )}
            />
            <Controller
                control={control}
                name="leadRating"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Lead Rating"
                        placeholder="Enter Lead Rating"
                        customBorderColor="#ddd"
                        customBackgroundColor={theme.COLORS.white}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        error={errors.leadRating?.message}
                    />
                )}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (<View style={styles.loadingContainer}>
                    <skeletonLoader.ListSkeletonLoader
                    itemCount={10}
                    itemHeight={50}
                />
                </View>) : renderContent()}
            </ScrollView>
            {/* <View style={styles.btnContainerStyles}>
                <components.Button
                    title="Update Lead"
                    onPress={handleSubmit(onSubmit)}
                />
            </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    fieldContainer: {
        padding: 20,
    },
    btnContainerStyles: {
        marginLeft: 40,
        marginRight: 40,
        marginTop: 20,
        marginBottom: 5,
    },
    loadingContainer: {
        marginTop: 20
    }
});

export default EditLead;
