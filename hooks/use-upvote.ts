import { useEffect, useState } from "react";

import { env } from "@/env";

// Hook to manage upvote data for all resources
export function useUpvote() {
  const [upvotes, setUpvotes] = useState<{ [key: string]: number }>({}); // Store upvote counts for all resources

  useEffect(() => {
    const eventSource = new EventSource(`${env.NEXT_PUBLIC_API_URL}/stream`);

    // Handle incoming SSE messages
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data); // { resourceId: string, count: number }
        setUpvotes((prevUpvotes) => ({
          ...prevUpvotes,
          [data.resourceId]: data.count, // Update the count for the specific resource
        }));
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    return () => eventSource.close();
  }, []);

  return upvotes; // Return upvotes object, which maps resourceId to count
}
