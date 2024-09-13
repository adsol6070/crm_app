import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigation from "./DrawerNavigation";
import PersonalChat from "../screens/Chat/PersonalChat";
import UserManager from "../screens/Users/Managment";
import UserList from "../screens/Users/List";
import UserDetail from "../screens/Users/Detail";
import AddBlog from "../screens/Blog/AddBlog";
import ListBlogs from "../screens/Blog/ListBlogs";
import ReadBlog from "../screens/Blog/ReadBlog";
import ListLeads from "../screens/Lead/ListLeads";
import RoleList from "../screens/Users/Roles/List";
import RoleDetail from "../screens/Users/Roles/Detail";
import AddLead from "../screens/Lead/Add";
import LeadDetail from "../screens/Lead/LeadDetail";
import LeadHistory from "../screens/Lead/LeadHistory";
import DocumentChecklist from "../screens/Lead/DocumentChecklist";
import DocumentUpload from "../screens/Lead/DocumentUpload";
import EditBlog from "../screens/Blog/EditBlog";
import EditLead from "../screens/Lead/EditLead";
import LeadActions from "../screens/Lead/LeadActions";
import RoleManager from "../screens/Users/Roles/Management";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={DrawerNavigation} />
      <Stack.Screen name="PersonalChat" component={PersonalChat} />
      <Stack.Screen name="UserManager" component={UserManager} />
      <Stack.Screen name="ViewUsers" component={UserList} />
      <Stack.Screen name="RoleManager" component={RoleManager} />
      <Stack.Screen name="ViewRoles" component={RoleList} />
      <Stack.Screen name="RoleDetail" component={RoleDetail} />
      <Stack.Screen name="UserDetail" component={UserDetail} />
      <Stack.Screen name="AddBlog" component={AddBlog} />
      <Stack.Screen name="ListBlogs" component={ListBlogs} />
      <Stack.Screen name="ReadBlog" component={ReadBlog} />
      <Stack.Screen name="EditBlog" component={EditBlog} />
      <Stack.Screen name="AddLead" component={AddLead} />
      <Stack.Screen name="EditLead" component={EditLead} />
      <Stack.Screen name="ListLeads" component={ListLeads} />
      <Stack.Screen name="LeadActions" component={LeadActions} />
      <Stack.Screen name="LeadDetail" component={LeadDetail} />
      <Stack.Screen name="LeadHistory" component={LeadHistory} />
      <Stack.Screen name="DocumentChecklist" component={DocumentChecklist} />
      <Stack.Screen name="DocumentUpload" component={DocumentUpload} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
