import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import StepIndicator from 'react-native-step-indicator';
import { components } from '../../components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

const labels = ["Personal Details", "Academic Details", "Immigration Details", "Final Details", "View Lead Details"];

const AddLead = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [step, setStep] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string | null>(null);
    const [selectedNationality, setSelectedNationality] = useState<string | null>(null);
    const [selectedVisaCategory, setSelectedVisaCategory] = useState<string | null>(null);
    const [selectedCountryOfInterest, setSelectedCountryOfInterest] = useState<string | null>(null);
    const [selectedCountry, setSlectedCountry] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const stepSchemas = [
        yup
            .object({
                firstname: yup.string().required('Please enter your First Name').trim(),
                lastname: yup.string().required('Please enter your Last Name').trim(),
                email: yup.string().required('Please enter your Email').email('Please enter a valid Email'),
                phone: yup.string().required('Please enter your Phone Number').matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').trim(),
                dob: yup.date().required('Please select your Date of Birth'),
                gender: yup.string().required('Please select your Gender'),
                nationality: yup.string().required('Please enter your Nationality'),
                maritalStatus: yup.string().required('Please select your Marital Status'),
                country: yup.string().required('Please enter your Country'),
                state: yup.string().required('Please enter your State'),
                district: yup.string().required('Please enter your District'),
                city: yup.string().required('Please enter your City'),
                pincode: yup.string().required('Please enter your Pincode').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').trim(),
                currentAddress: yup.string().required('Please enter your Current Address').trim(),
                permanentAddress: yup.string().required('Please enter your Permanent Address').trim(),
            })
            .required(),
        yup
            .object({
                highestQualification: yup.string().required('Please enter your Highest Qualification').trim(),
                fieldOfStudy: yup.string().required('Please enter your field of study').trim(),
                institutionName: yup.string().required('Please enter your Institution Name'),
                // phone: yup.string().required('Please enter your Phone Number').matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').trim(),
                // dob: yup.date().required('Please select your Date of Birth'),
                // gender: yup.string().required('Please select your Gender'),
                // nationality: yup.string().required('Please enter your Nationality'),
                // maritalStatus: yup.string().required('Please select your Marital Status'),
                // country: yup.string().required('Please enter your Country'),
                // state: yup.string().required('Please enter your State'),
                // district: yup.string().required('Please enter your District'),
                // city: yup.string().required('Please enter your City'),
                // pincode: yup.string().required('Please enter your Pincode').matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').trim(),
                // currentAddress: yup.string().required('Please enter your Current Address').trim(),
                // permanentAddress: yup.string().required('Please enter your Permanent Address').trim(),
            })
            .required(),
    ];

    const currentSchema: yup.ObjectSchema<any> = stepSchemas[step - 1] || yup.object().shape({});
    const { control, handleSubmit, formState: { errors }, reset, trigger } = useForm({
        resolver: yupResolver(currentSchema),
        mode: 'onTouched',
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        reset();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    const handleSelectGender = (value: string) => {
        setSelectedGender(value);
    };
    const handleSelectMaritalStatus = (value: string) => {
        setSelectedMaritalStatus(value);
    };
    const handleSelectNationality = (value: string) => {
        setSelectedNationality(value);
    };
    const handleSelectCountryOfInterest = (value: string) => {
        setSelectedCountryOfInterest(value);
    };
    const handleSelectVisaCategory = (value: string) => {
        setSelectedVisaCategory(value);
    };
    const handleSelectCountry = (value: string) => {
        setSlectedCountry(value);
    };
    const handleSelectState = (value: string) => {
        setSelectedState(value);
    };
    const handleSelectDistrict = (value: string) => {
        setSelectedDistrict(value);
    };
    const handleSelectCity = (value: string) => {
        setSelectedCity(value);
    };

    const handleNextStep = async () => {
        const isValid = await trigger();
        console.log(isValid)

        // if (isValid) {
        if (currentStep < labels.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        // }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

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
                                    customBackgroundColor="#f5f5f5"
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
                        <components.DatepickerField
                            title="DOB"
                            placeholder="11-11-1990"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        />
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Male', 'Female', 'Other']}
                                    selectedValue={selectedGender}
                                    onSelect={(value: string) => {
                                        handleSelectGender(value);
                                        onChange(value);
                                    }}
                                    error={errors.gender?.message}
                                    placeholder="Select an option"
                                    label="Gender"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="nationality"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Indian', 'Other']}
                                    selectedValue={selectedNationality}
                                    onSelect={(value: string) => {
                                        handleSelectNationality(value);
                                        onChange(value);
                                    }}
                                    error={errors.nationality?.message}
                                    placeholder="Select an option"
                                    label="Nationality"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="maritalStatus"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Single', 'Married', 'Divorced', 'Widowed', 'Separated', ]}
                                    selectedValue={selectedMaritalStatus}
                                    onSelect={(value: string) => {
                                        handleSelectMaritalStatus(value);
                                        onChange(value);
                                    }}
                                    error={errors.maritalStatus?.message}
                                    placeholder="Select an option"
                                    label="Marital Status"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="country"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Option 1', 'Option 2', 'Option 3']}
                                    selectedValue={selectedCountry}
                                    onSelect={(value: string) => {
                                        handleSelectCountry(value);
                                        onChange(value);
                                    }}
                                    error={errors.country?.message}
                                    placeholder="Select an option"
                                    label="Country"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="state"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Option 1', 'Option 2', 'Option 3']}
                                    selectedValue={selectedState}
                                    onSelect={(value: string) => {
                                        handleSelectState(value);
                                        onChange(value);
                                    }}
                                    error={errors.state?.message}
                                    placeholder="Select an option"
                                    label="State"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="district"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Option 1', 'Option 2', 'Option 3']}
                                    selectedValue={selectedDistrict}
                                    onSelect={(value: string) => {
                                        handleSelectDistrict(value);
                                        onChange(value);
                                    }}
                                    error={errors.district?.message}
                                    placeholder="Select an option"
                                    label="District"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange } }) => (
                                <components.Dropdown
                                    options={['Option 1', 'Option 2', 'Option 3']}
                                    selectedValue={selectedCity}
                                    onSelect={(value: string) => {
                                        handleSelectCity(value);
                                        onChange(value);
                                    }}
                                    error={errors.city?.message}
                                    placeholder="Select an option"
                                    label="City"
                                />
                            )}
                        />
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
                        <components.InputField
                            title="Institution Name"
                            placeholder="Enter Institution Name"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Graduation Year"
                            placeholder="Enter Graduation Year"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Grade/Percentage/CGPA"
                            placeholder="Enter Grade/Percentage/CGPA"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Test Type"
                            placeholder="Enter Test Type"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Test Score"
                            placeholder="Enter Test Score"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
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
                        <components.InputField
                            title="Passport Number"
                            placeholder="A12345678"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.DatepickerField
                            title="Passport Expiry Date"
                            placeholder="11-11-1990"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        />
                        <components.Dropdown
                            options={['Option 1', 'Option 2', 'Option 3']}
                            selectedValue={selectedVisaCategory}
                            onSelect={(value: string) => {
                                handleSelectVisaCategory(value);
                                // onChange(value);
                            }}
                            // error={errors.category?.message}
                            placeholder="Select an option"
                            label="Choose Visa Category"
                        />
                        <components.Dropdown
                            options={['Option 1', 'Option 2', 'Option 3']}
                            selectedValue={selectedCountryOfInterest}
                            onSelect={(value: string) => {
                                handleSelectCountryOfInterest(value);
                                // onChange(value);
                            }}
                            // error={errors.category?.message}
                            placeholder="Select an option"
                            label="Country of Interest"
                        />
                        <components.InputField
                            title="Course of Interest"
                            placeholder="Enter Course of Interest"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Desired Field of Study"
                            placeholder="Enter Desired Field of Study"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Preferred Institutions"
                            placeholder="Enter Preferred Institutions"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Intake Session"
                            placeholder="Enter Intake Session"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Reason for Immigration"
                            placeholder="Enter Reason for Immigration"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Financial Support"
                            placeholder="Enter Financial Support"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Sponsor Details"
                            placeholder="Enter Sponsor Details"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Scholarships/Grants"
                            placeholder="Enter Scholarships/Grants"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
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
                        <components.InputField
                            title="Preferred Mode of Communication"
                            placeholder="Write Here"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Preferred Time for Contact"
                            placeholder="Write Here"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Source of Lead"
                            placeholder="Enter DSource of Lead"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.InputField
                            title="Referral Name/Contact"
                            placeholder="Enter Referral Name/Contact"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
                        />
                        <components.DatepickerField
                            title="FollowUp Dates"
                            placeholder="11-11-1990"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        />
                        <components.InputField
                            title="Lead Rating"
                            placeholder="Enter Lead Rating"
                            customBorderColor="#ddd"
                            customBackgroundColor="#f5f5f5"
                        // onChangeText={onChange}
                        // onBlur={onBlur}
                        // value={value}
                        // error={errors.title?.message}
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
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>First Name:</Text>
                                    <Text style={styles.tableValue}>firstName</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Last Name:</Text>
                                    <Text style={styles.tableValue}>lastName</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Email:</Text>
                                    <Text style={styles.tableValue}>email</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Phone:</Text>
                                    <Text style={styles.tableValue}>phone</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>DOB:</Text>
                                    <Text style={styles.tableValue}>dob</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Gender:</Text>
                                    <Text style={styles.tableValue}>gender</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Nationality:</Text>
                                    <Text style={styles.tableValue}>nationality</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Marital Status:</Text>
                                    <Text style={styles.tableValue}>maritalStatus</Text>
                                </View>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Country:</Text>
                                    <Text style={styles.tableValue}>country</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Previous" onPress={handlePreviousStep} color="black" />
                            <Button title="Submit" onPress={() => alert('Form Submitted!')} color="black" />
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                {renderHeader()}
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
        backgroundColor: '#f8f8f8',
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
