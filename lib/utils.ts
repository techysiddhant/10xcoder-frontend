import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    let videoId: string | null = null;

    // Case 1: Shortened URL like https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    // Case 2: Standard YouTube watch URL like https://www.youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.searchParams.has("v")
    ) {
      videoId = parsedUrl.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}
