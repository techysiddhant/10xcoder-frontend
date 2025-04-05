import { api } from "./api";

export const createResource = (formData: unknown) =>
  api.post("/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

export const getResource = (resourceId: string) =>
  api.get(`/resources/${resourceId}`, {
    withCredentials: true,
  });
