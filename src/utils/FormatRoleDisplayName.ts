export const formatRoleDisplayName = (role: string) => {
  return role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
