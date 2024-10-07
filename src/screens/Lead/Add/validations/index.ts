import * as Yup from "yup";

export const VALIDATION_SCHEMAS = {
  personalInfoSchema: Yup.object().shape({
    firstname: Yup.string().required("Please enter your First Name").trim(),
    lastname: Yup.string().required("Please enter your Last Name").trim(),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Please enter your Phone Number")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .trim(),
    dob: Yup.date(),
    gender: Yup.string().required("Please select your Gender"),
    nationality: Yup.string().required("Please enter your Nationality"),
    maritalStatus: Yup.string().required("Please select your Marital Status"),
    pincode: Yup.string()
      .required("Please enter your Pincode")
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
      .trim(),
    currentAddress: Yup.string()
      .required("Please enter your Current Address")
      .trim(),
    permanentAddress: Yup.string()
      .required("Please enter your Permanent Address")
      .trim(),
  }),
  academicInfoSchema: Yup.object().shape({
    highestQualification: Yup.string()
      .required("Please enter your Highest Qualification")
      .trim(),
    fieldOfStudy: Yup.string().nullable(),
    institutionName: Yup.string().nullable(),
    graduationYear: Yup.string().nullable(),
    grade: Yup.string().nullable(),
    testType: Yup.string().nullable(),
    testScore: Yup.string().nullable(),
  }),
  immigrationInfoSchema: Yup.object().shape({
    passportNumber: Yup.string()
      .nullable()
      .matches(
        /(^$)|(^[A-PR-WYa-pr-wy][0-9]\d\s?\d{4}[0-9]$)/,
        "Passport number must be exactly 8 characters"
      )
      .trim(),
    passportExpiry: Yup.date(),
    visaCategory: Yup.string().required("Please select your Visa Category"),
    courseOfInterest: Yup.string().nullable(),
    desiredFieldOfStudy: Yup.string().nullable(),
    preferredInstitutions: Yup.string().nullable(),
    intakeSession: Yup.string().nullable(),
    reasonForImmigration: Yup.string().nullable(),
    financialSupport: Yup.string().nullable(),
    sponsorDetails: Yup.string().nullable(),
    scholarships: Yup.string().nullable(),
  }),
  finalDetailsSchema: Yup.object().shape({
    communicationMode: Yup.string().nullable(),
    preferredContactTime: Yup.string().nullable(),
    leadSource: Yup.string().required("Please enter source of lead"),
    referralContact: Yup.string().nullable(),
    followUpDates: Yup.date(),
    leadRating: Yup.string().nullable(),
  }),
};
