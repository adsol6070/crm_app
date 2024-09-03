import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import StepIndicator from 'react-native-step-indicator';
import { components } from '../../components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { genderOptions, maritalStatusOptions, nationalityOptions } from '../../utils/options';
import { leadService } from '../../api/lead';
import { useAuth } from '../../common/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { theme } from '../../constants/theme';

interface CollectedData {
    [key: string]: any;
}

const labels = ["Personal Details", "Academic Details", "Immigration Details", "Final Details", "View Lead Details"];

const stepSchemas = [
    yup
        .object({
            firstname: yup.string().required('Please enter your First Name').trim(),
            lastname: yup.string().required('Please enter your Last Name').trim(),
            email: yup.string().required('Please enter your Email').email('Please enter a valid Email'),
            phone: yup.string().required('Please enter your Phone Number').matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').trim(),
            dob: yup.date(),
            gender: yup.string().required('Please select your Gender'),
            nationality: yup.string().required('Please enter your Nationality'),
            maritalStatus: yup.string().required('Please select your Marital Status'),
            pincode: yup.string().required('Please enter your Pincode').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').trim(),
            currentAddress: yup.string().required('Please enter your Current Address').trim(),
            permanentAddress: yup.string().required('Please enter your Permanent Address').trim(),
        })
        .required(),
    yup
        .object({
            highestQualification: yup.string().required('Please enter your Highest Qualification').trim(),
            fieldOfStudy: yup.string().nullable(),
            institutionName: yup.string().nullable(),
            graduationYear: yup.string().nullable(),
            grade: yup.string().nullable(),
            testType: yup.string().nullable(),
            testScore: yup.string().nullable(),
        })
        .required(),
    yup
        .object({
            passportNumber: yup.string().nullable().matches(/(^$)|(^[A-PR-WYa-pr-wy][0-9]\d\s?\d{4}[0-9]$)/, 'Passport number must be exactly 8 characters').trim(),
            passportExpiry: yup.date(),
            visaCategory: yup.string().required('Please select your Visa Category'),
            courseOfInterest: yup.string().nullable(),
            desiredFieldOfStudy: yup.string().nullable(),
            preferredInstitutions: yup.string().nullable(),
            intakeSession: yup.string().nullable(),
            reasonForImmigration: yup.string().nullable(),
            financialSupport: yup.string().nullable(),
            sponsorDetails: yup.string().nullable(),
            scholarships: yup.string().nullable(),
        })
        .required(),
    yup
        .object({
            communicationMode: yup.string().nullable(),
            preferredContactTime: yup.string().nullable(),
            leadSource: yup.string().required("Please enter source of lead"),
            followUpDates: yup.date().required("Please choose the followup dates"),
            referralContact: yup.string().nullable(),
            leadRating: yup.string().nullable(),
        })
        .required(),
];

const AddLead = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [step, setStep] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [collectedData, setCollectedData] = useState<CollectedData>({});

    console.log("CollectedData:", collectedData);

    const [visaCategories, setVisaCategories] = useState<any[]>([]);

    const [dob, setDob] = useState<Date | undefined>(undefined);
    const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);
    const [passportExpiryDate, setPassportExpiryDate] = useState<Date | undefined>(undefined);

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
        getCategories();
    }, [])

    const currentSchema: yup.ObjectSchema<any> = stepSchemas[step - 1] || yup.object().shape({});
    const { control, handleSubmit, formState: { errors }, reset, trigger, getValues } = useForm({
        resolver: yupResolver(currentSchema),
        mode: 'onTouched'
    });

    // useEffect(() => {
    //     if (currentStep < labels.length) {
    //         reset(collectedData);
    //     } else if (currentStep === labels.length) {
    //         console.log("hello ")
    //         reset();
    //     }
    // }, [step, currentStep]);

    // useFocusEffect(() => {
    //     useCallback(() => {
    //         if (currentStep < labels.length) {
    //             reset(collectedData);
    //         } else if (currentStep === labels.length) {
    //             console.log("hello ")
    //             reset();
    //         }
    //     }, [step, currentStep])
    // })

    // useFocusEffect(
    //     useCallback(() => {
    //         if (currentStep < labels.length) {
    //             reset(collectedData);
    //         } else if (currentStep === labels.length) {
    //             console.log("hello ");
    //             reset();
    //         }
    //     }, [currentStep, labels.length, collectedData, reset])
    // );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        reset();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const handleNextStep = async () => {
        const isValid = await trigger();

        // if (isValid) {
        const currentValues = getValues();
        // const updatedCollectedData = {
        //     ...collectedData,
        //     ...currentValues,
        // };

        // setCollectedData(updatedCollectedData);

        setCollectedData((prevData) => ({
            ...prevData,
            ...currentValues
        }))
        console.log("Collected data ", collectedData)

        // try {
        //     await AsyncStorage.setItem('formData', JSON.stringify(updatedCollectedData));
        // } catch (e) {
        //     console.error('Failed to save the data to AsyncStorage');
        // }

        if (currentStep < labels.length - 1) {
            setCurrentStep(currentStep + 1);
            reset({
                
            });
        }
        // }
    };

    const handlePreviousStep = async () => {
        const currentValues = getValues();

        setCollectedData((prevData) => ({
            ...prevData,
            ...currentValues
        }))

        try {
            await AsyncStorage.setItem('formData', JSON.stringify(updatedCollectedData));
        } catch (e) {
            console.error('Failed to save the data to AsyncStorage');
        }

        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            reset();
        }
    };

    const formatLabel = (key: any) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: any) => str.toUpperCase());
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);

        return `${day}-${month}-${year}`;
    };

    const onSubmit = async (data: any) => {
        console.log("Submit get called.");
        const fullData = {
            ...data,
            userID: user?.sub,
            tenantID: user?.tenantID
        }
        try {
            // const response = await leadService.createLead(fullData)
            // console.log(response)
            setCurrentStep(0)
            reset({
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                currentAddress: "",
                permanentAddress: "",
                dob: "",
                gender: "",
                country: "",
                district: "",
                state: "",
                city: "",
                pincode: "",
                nationality: "",
                maritalStatus: "",
                passportNumber: "",
                passportExpiry: "",
                visaCategory: "",
                highestQualification: "",
                fieldOfStudy: "",
                institutionName: "",
                graduationYear: "",
                grade: "",
                testType: "",
                testScore: "",
                intakeSession: "",
                reasonForImmigration: "",
                financialSupport: "",
                sponsorDetails: "",
                courseOfInterest: "",
                countryOfInterest: "",
                desiredFieldOfStudy: "",
                scholarships: "",
                communicationMode: "",
                preferredContactTime: "",
                preferredInstitutions: "",
                leadSource: "",
                referralContact: "",
                followUpDates: "",
                leadRating: "",
            });
            setCollectedData({})
            Alert.alert("Lead created")
        } catch (error) {
            Alert.alert("Error creating lead")
            console.log("Error creating lead ", error)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Personal Information</Text>
                        <Controller
                            control={control}
                            name="firstname"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="First Name"
                                    placeholder="John"
                                    customBorderColor="#ddd"
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
                                    placeholder="Doe"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="example@gmail.com"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="99999-99999"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.phone?.message}
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
                                    onDateChange={(date) => setDob(date)}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.dob?.message}
                                    datePicker={true}
                                    disableFutureDates={true}
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
                                    error={errors.maritalStatus?.message}
                                />
                            )}
                        />
                        {/* <Controller
                            control={control}
                            name="country"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Country"
                                    placeholder="Select country"
                                    containerStyle={{ marginBottom: 20 }}
                                    dropdown={true}
                                    items={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "Other", value: "other" },
                                    ]}
                                    selectedValue={value}
                                    onValueChange={(val) => onChange(val)}
                                    onBlur={onBlur}
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="Select state"
                                    containerStyle={{ marginBottom: 20 }}
                                    dropdown={true}
                                    items={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "Other", value: "other" },
                                    ]}
                                    selectedValue={value}
                                    onValueChange={(val) => onChange(val)}
                                    onBlur={onBlur}
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="Select district"
                                    containerStyle={{ marginBottom: 20 }}
                                    dropdown={true}
                                    items={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "Other", value: "other" },
                                    ]}
                                    selectedValue={value}
                                    onValueChange={(val) => onChange(val)}
                                    onBlur={onBlur}
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="Select city"
                                    containerStyle={{ marginBottom: 20 }}
                                    dropdown={true}
                                    items={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "Other", value: "other" },
                                    ]}
                                    selectedValue={value}
                                    onValueChange={(val) => onChange(val)}
                                    onBlur={onBlur}
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    error={errors.city?.message}
                                />
                            )}
                        /> */}
                        <Controller
                            control={control}
                            name="pincode"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Pincode"
                                    placeholder="000000"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.pincode?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="currentAddress"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Current Address"
                                    placeholder="Enter Current Address"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    placeholder="Enter Permanent Address"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.permanentAddress?.message}
                                />
                            )}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Next" onPress={handleNextStep} color="black" />
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Academic Information</Text>
                        <Controller
                            control={control}
                            name="highestQualification"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Highest Qualification"
                                    placeholder="Enter Highest Qualification"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.institutionName?.message}
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.testType?.message}
                                />
                            )}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Previous" onPress={handlePreviousStep} color="black" />
                            <Button title="Next" onPress={handleNextStep} color="black" />
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Immigration Information</Text>
                        <Controller
                            control={control}
                            name="passportNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Passport Number"
                                    placeholder="A12345678"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
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
                                    placeholder="Select Passport Expiry"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onDateChange={(date) => setPassportExpiryDate(date)}
                                    onBlur={onBlur}
                                    value={value}
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
                                    customBackgroundColor="#f5f5f5"
                                    error={errors.visaCategory?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="countryOfInterest"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Country of Interest"
                                    placeholder="Enter Country of Interest"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.countryOfInterest?.message}
                                />
                            )}
                        />
                        {/* <Controller
                            control={control}
                            name="countryOfInterest"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Country of interest"
                                    placeholder="Select country of interest"
                                    containerStyle={{ marginBottom: 20 }}
                                    dropdown={true}
                                    items={[
                                        { label: "India", value: "india" },
                                        { label: "Canada", value: "canada" },
                                    ]}
                                    selectedValue={value}
                                    onValueChange={(val) => onChange(val)}
                                    onBlur={onBlur}
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    error={errors.countryOfInterest?.message}
                                />
                            )}
                        /> */}
                        <Controller
                            control={control}
                            name="courseOfInterest"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Course of Interest"
                                    placeholder="Enter Course of Interest"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.courseOfInterest?.message}
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.scholarships?.message}
                                />
                            )}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Previous" onPress={handlePreviousStep} color="black" />
                            <Button title="Next" onPress={handleNextStep} color="black" />
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Final Details</Text>
                        <Controller
                            control={control}
                            name="communicationMode"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <components.InputField
                                    title="Preferred Mode of Communication"
                                    placeholder="Write Here"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    customBackgroundColor="#f5f5f5"
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
                                    title="FollowUp Dates"
                                    placeholder="Select FollowUp Dates"
                                    customBorderColor="#ddd"
                                    customBackgroundColor="#f5f5f5"
                                    onDateChange={(date) => setFollowUpDate(date)}
                                    onBlur={onBlur}
                                    value={value}
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
                                    customBackgroundColor="#f5f5f5"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.leadRating?.message}
                                />
                            )}
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Previous" onPress={handlePreviousStep} color="black" />
                            <Button title="Next" onPress={handleNextStep} color="black" />
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>View Lead Details</Text>
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewTitle}>Lead Preview</Text>
                            <View style={styles.table}>
                                {Object.entries(collectedData).map(([key, value]) => (
                                    <View style={styles.tableRow} key={key}>
                                        <Text style={styles.tableLabel}>{formatLabel(key)}:</Text>
                                        <Text style={styles.tableValue}>
                                            {(key === 'dob' || key === 'passportExpiry' || key === 'followUpDates') ? formatDate(String(value)) : value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Previous" onPress={handlePreviousStep} color="black" />
                            <Button title="Submit" onPress={handleSubmit(onSubmit)} color="black" />
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <StepIndicator
                    stepCount={labels.length}
                    currentPosition={currentStep}
                    labels={labels}
                    customStyles={customStyles}
                />
                {renderStepContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const renderHeader = () => {
    return (
        <components.Header
            title="Add Lead"
            goBack={true}
        />
    );
};

const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#32cd32',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#32cd32',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#32cd32',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#32cd32',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#32cd32',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    stepContainer: {
        padding: 20,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    previewContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    tableLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    tableValue: {
        fontSize: 16,
        color: '#333',
    },
});

export default AddLead;
