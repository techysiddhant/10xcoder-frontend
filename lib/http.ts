import { api } from "./api";

export const createResource = (formData: FormData) =>
  api.post("/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
