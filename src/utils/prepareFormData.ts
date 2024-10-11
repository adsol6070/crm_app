// Utility function to prepare form data
export const prepareFormData = (
  data: Record<string, any>,
  fileData: Record<string, any> = {},
  additionalData: Record<string, any> = {}
): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  Object.keys(additionalData).forEach((key) => {
    if (additionalData[key] !== undefined && additionalData[key] !== null) {
      formData.append(key, additionalData[key]);
    }
  });

  Object.keys(fileData).forEach((key) => {
    if (fileData[key]) {
      formData.append(key, fileData[key]);
    }
  });

  return formData;
};
