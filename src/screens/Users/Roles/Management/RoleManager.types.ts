export interface Permission {
  name: string;
  dependsOn?: string;
}

export interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

export type PermissionState = {
  [moduleId: string]: {
    [permissionName: string]: boolean;
  };
};

export interface RoleFormData {
  role: string;
  permissions?: PermissionState;
}
