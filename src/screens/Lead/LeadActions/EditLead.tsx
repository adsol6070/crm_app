import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { components } from '../../../components';
import { leadService } from '../../../api/lead';
import { useAuth } from '../../../common/context/AuthContext';
import { genderOptions, maritalStatusOptions, nationalityOptions } from '../../../utils/options';
import { theme } from '../../../constants/theme';
import { skeletonLoader } from '../../../components/skeletonLoaders';
import { capitalizeFirstLetter } from '../../../utils/CapitalizeFirstLetter';

const EditLead = () => {
    const route = useRoute();
    const { leadId }: any = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const navigation = useNavigation();
    const [visaCategories, setVisaCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [countryCode, setCountryCode] = useState<string>("+91");

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
        country: yup.string().nullable(),
        state: yup.string().nullable(),
        district: yup.string().nullable(),
        city: yup.string().nullable(),
        pincode: yup.string().required("Pincode is required"),
        nationality: yup.string().required("Nationality is required"),
        maritalStatus: yup.string().required("Marital Status is required"),
        highestQualification: yup.string().required('Please enter your Highest Qualification').trim(),
        fieldOfStudy: yup.string().nullable(),
        institutionName: yup.string().nullable(),
        graduationYear: yup.string().nullable(),
        grade: yup.string().nullable(),
        testType: yup.string().nullable(),
        testScore: yup.string().nullable(),
        passportNumber: yup.string().nullable().matches(/(^$)|(^[A-PR-WYa-pr-wy][0-9]\d\s?\d{4}[0-9]$)/, 'Passport number must be exactly 8 characters').trim(),
        passportExpiry: yup.date().nullable(),
        courseOfInterest: yup.string().nullable(),
        countryOfInterest: yup.string().nullable(),
        desiredFieldOfStudy: yup.string().nullable(),
        preferredInstitutions: yup.string().nullable(),
        intakeSession: yup.string().nullable(),
        reasonForImmigration: yup.string().nullable(),
        financialSupport: yup.string().nullable(),
        sponsorDetails: yup.string().nullable(),
        scholarships: yup.string().nullable(),
        communicationMode: yup.string().nullable(),
        preferredContactTime: yup.string().nullable(),
        leadSource: yup.string().nullable(),
        referralContact: yup.string().nullable(),
        followUpDates: yup.date().nullable(),
        leadRating: yup.string().nullable(),
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

    const splitCountryCode = (inputString: string) => {
        const [countryCode, number] = inputString.split(' ');
        return {
            countryCode: number ? countryCode : '+91',
            number: number || countryCode
        };
    };

    const getLeadDetails = async () => {
        setLoading(true)
        try {
            const response: any = await leadService.getLeadById(leadId);
            const phone = splitCountryCode(response.phone)
            setCountryCode(phone.countryCode)
            reset({
                firstname: response.firstname,
                lastname: response.lastname,
                email: response.email,
                phone: phone.number,
                currentAddress: response.currentAddress,
                permanentAddress: response.permanentAddress,
                dob: new Date(response.dob),
                gender: response.gender,
                country: response.country,
                district: response.district,
                state: response.state,
                city: response.city,
                pincode: response.pincode,
                nationality: response.nationality,
                maritalStatus: response.maritalStatus,
                passportNumber: response.passportNumber,
                passportExpiry: new Date(response.passportExpiry),
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
                followUpDates: new Date(response.followUpDates),
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
            const newCategories = response.map((category: any) =>{
                return {
                  value: category.category,
                  label: capitalizeFirstLetter(category.category),
                }
              }
              );
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
                ...data, tenantID: user?.tenantID, userID: user?.sub,
                phone: `${countryCode} ${data.phone}`
            };
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
                        keyboardType="phone-pad"
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
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
                render={({ field: { onChange, value } }) => (
                    <components.Dropdown
                        options={genderOptions}
                        selectedValue={value}
                        onSelect={(value: string) => {
                            onChange(value);
                        }}
                        placeholder="Select a gender"
                        label="Gender"
                        error={errors.gender?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="dob"
                render={({ field: { onChange, onBlur, value } }) => (
                    <components.InputField
                        title="Date of Birth"
                        placeholder="DD/MM/YYYY"
                        datePicker
                        disableFutureDates
                        date={value ? value : undefined}
                        onDateChange={(date) => {
                            onChange(date);
                        }}
                        error={errors.dob?.message}
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
                render={({ field: { onChange, value } }) => (
                    <components.Dropdown
                        options={nationalityOptions}
                        selectedValue={value}
                        onSelect={(value: string) => {
                            onChange(value);
                        }}
                        placeholder="Select a Nationality"
                        label="Nationality"
                        error={errors.nationality?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="maritalStatus"
                render={({ field: { onChange, value } }) => (
                    <components.Dropdown
                        options={maritalStatusOptions}
                        selectedValue={value}
                        onSelect={(value: string) => {
                            onChange(value);
                        }}
                        placeholder="Select a Marital Status"
                        label="Marital Status"
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
                        title="Passport Expiry"
                        placeholder="DD/MM/YYYY"
                        datePicker
                        date={value ? value : undefined}
                        onDateChange={(date) => {
                            onChange(date);
                        }}
                        error={errors.passportExpiry?.message}
                    />
                )}
            />
            <Controller
                control={control}
                name="visaCategory"
                render={({ field: { onChange, value } }) => (
                    <components.Dropdown
                        options={visaCategories}
                        selectedValue={value}
                        onSelect={(value: string) => {
                            onChange(value);
                        }}
                        placeholder="Select a category"
                        label="Visa Category"
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
                        title="FollowUp Dates"
                        placeholder="DD/MM/YYYY"
                        datePicker
                        date={value ? value : undefined}
                        onDateChange={(date) => {
                            onChange(date);
                        }}
                        error={errors.followUpDates?.message}
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
