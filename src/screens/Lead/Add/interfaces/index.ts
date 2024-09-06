// Interface for Personal Info Step
export interface PersonalInfoData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  nationality: string;
  maritalStatus: string;
  country: string;
  state: string;
  district: string;
  pincode: string;
  currentAddress: string;
  permanentAddress: string;
}

// Interface for Academic Info Step
export interface AcademicInfoData {
  highestQualification: string;
  fieldOfStudy?: string;
  institutionName?: string;
  graduationYear?: string;
  grade?: string;
  testType?: string;
  testScore?: string;
}

// Interface for Immigration Info Step
export interface ImmigrationInfoData {
  passportNumber?: string;
  passportExpiry?: Date;
  visaCategory: string;
  courseOfInterest?: string;
  desiredFieldOfStudy?: string;
  preferredInstitutions?: string;
  intakeSession?: string;
  reasonForImmigration?: string;
  financialSupport?: string;
  sponsorDetails?: string;
  scholarships?: string;
}

// Interface for Final Details Step
export interface FinalDetailsData {
  communicationMode?: string;
  preferredContactTime?: string;
  leadSource: string;
  referralContact?: string;
  followUpDates?: Date;
  leadRating?: string;
}

// Combined Interface for All Steps
export interface LeadData
  extends PersonalInfoData,
    AcademicInfoData,
    ImmigrationInfoData,
    FinalDetailsData {
  [key: string]: string | undefined;
}
