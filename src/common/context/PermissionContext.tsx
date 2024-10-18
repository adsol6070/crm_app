import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { permissionService } from "../../api/permissions";
import { useAuth } from "./AuthContext";

// Permissions type
interface Permissions {
  [category: string]: {
    [action: string]: boolean;
  };
}

// Permissions context type
interface PermissionsContextType {
  permissions: Permissions;
  isSuperAdmin: boolean;
  refreshPermissions: () => void;
}

// Creating the Permissions context
const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

// Hook to use Permissions context
export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

// PermissionsProvider component
export const PermissionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<Permissions>({});
  console.log("Permissions of current role:", permissions);
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const fetchPermissions = async (role: string) => {
    try {
      if (role === "super_admin") {
        setPermissions({
          "*": { "*": true },
        });
      } else {
        const data: any = await permissionService.getPermissionsByRole({
          role,
        });
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return {};
    }
  };

  const refreshPermissions = () => {
    if (user?.role) {
      fetchPermissions(user.role);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchPermissions(user?.role);
    }
  }, [user?.role]);

  return (
    <PermissionsContext.Provider
      value={{ permissions, isSuperAdmin, refreshPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
