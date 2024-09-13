import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import RoleForm from "./Form";

type RoleManagerRouteParams = {
  params?: {
    roleName?: string;
  };
};

const RoleManager = () => {
  const route = useRoute<RouteProp<RoleManagerRouteParams, "params">>();
  const { roleName } = route.params || {};
  const isEditMode = !!roleName;

  return <RoleForm isEditMode={isEditMode} roleName={roleName} />;
};

export default RoleManager;
