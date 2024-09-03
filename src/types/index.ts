export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainLayout: undefined;
  ForgotPassword: undefined;
  ForgotPasswordSentEmail: undefined;
  Profile: undefined;
  Main: undefined;
};

export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  online: boolean;
  profileImage: string;
  profileImageUrl: string;
  role: string;
  tenantID: string;
  address?: string | null;
  city?: string | null;
}

export interface IUserProfile
  extends Pick<IUser, "firstname" | "lastname" | "profileImageUrl" | "role"> {}
