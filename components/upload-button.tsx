import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { env } from "@/env";

export const UploadButton = generateUploadButton({
  url: `${env.NEXT_PUBLIC_API_URL}/api/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone({
  url: `${env.NEXT_PUBLIC_API_URL}/api/uploadthing`,
});
