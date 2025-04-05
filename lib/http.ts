import { api } from "./api";

export const createResource = (formData: unknown) =>
  api.post("/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

export const getResource = (resourceId: string) =>
  api.get(`/resource/${resourceId}`, {
    withCredentials: true,
  });
export const getResources = (queryString: string) =>
  api.get(`/resources?${queryString}`, {
    withCredentials: true,
  });

export const getCategories = () =>
  api.get("/categories", {
    withCredentials: true,
  });
export const getTags = () =>
  api.get("/tags", {
    withCredentials: true,
  });
export const getUserResources = () =>
  api.get("/user/resources", {
    withCredentials: true,
  });

export const updateResource = (formData: unknown, resourceId: string) =>
  api.patch(`/resource/${resourceId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
