import { api } from "./api";

export const createResource = (formData: unknown) =>
  api.post("/resources", formData, {
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
export const getUserResources = (queryString: string) =>
  api.get(`/user/resources?${queryString}`, {
    withCredentials: true,
  });

export const updateResource = (formData: unknown, resourceId: string) =>
  api.patch(`/resource/${resourceId}`, formData, {
    withCredentials: true,
  });

export const upvoteResource = (resourceId: string) =>
  api.patch(`/resource/upvote/${resourceId}`, {}, { withCredentials: true });

export const addOrRemoveBookmark = (resourceId: string) =>
  api.post(`/resource/${resourceId}/bookmark`, {}, { withCredentials: true });

export const getBookmarks = (queryString: string) =>
  api.get(`/user/bookmarks?${queryString}`, {
    withCredentials: true,
  });
