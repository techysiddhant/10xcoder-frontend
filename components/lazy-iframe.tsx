import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";

import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LazyIFrameProps {
  url: string;
  title: string;
}

export const LazyIFrame = ({ url, title }: LazyIFrameProps) => {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px", // Load iframe when it's within 200px of viewport
  });

  useEffect(() => {
    if (inView && !loaded) {
      setLoaded(true);
    }
  }, [inView, loaded]);

  // Function to extract YouTube video ID and create embed URL
  const getYoutubeEmbedUrl = (url: string): string | null => {
    // Handle various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?rel=0`
      : null;
  };

  return (
    <div className="aspect-video w-full" ref={ref}>
      <AspectRatio ratio={16 / 9}>
        {inView || loaded ? (
          <iframe
            className="h-full w-full rounded-md"
            src={getYoutubeEmbedUrl(url)!}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)}
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-12 w-12 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Loading video...
              </span>
            </div>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};
