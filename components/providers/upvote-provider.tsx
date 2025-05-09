"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { env } from "@/env";

// Type definitions
type UpvoteCounts = {
  [resourceId: string]: number;
};

type UpvoteEvent = {
  type?: "connected";
  connectionId?: string;
  resourceId?: string;
  count?: number;
  action?: "added" | "removed";
  timestamp?: number;
};

type UpvoteContextType = {
  upvoteCounts: UpvoteCounts;
  isConnected: boolean;
};

// Create context
const UpvoteContext = createContext<UpvoteContextType>({
  upvoteCounts: {},
  isConnected: false,
});

// Custom hook to use upvote data
export function useUpvoteCounts() {
  return useContext(UpvoteContext);
}

// Provider component
export function UpvoteProvider({ children }: { children: ReactNode }) {
  const [upvoteCounts, setUpvoteCounts] = useState<UpvoteCounts>({});
  const [isConnected, setIsConnected] = useState(false);
  const [, setConnectionId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up SSE connection");
    const eventSource = new EventSource(`${env.NEXT_PUBLIC_API_URL}/stream`);

    eventSource.onopen = () => {
      // console.log("SSE connection established");
      setIsConnected(true);
    };

    eventSource.onmessage = (e) => {
      try {
        // Skip keep-alive messages
        if (e.data.startsWith(":")) return;

        const data = JSON.parse(e.data) as UpvoteEvent;
        // console.log("SSE event received:", data);

        // Handle connection event
        if (data.type === "connected" && data.connectionId) {
          setConnectionId(data.connectionId);
          // console.log("Connected with ID:", data.connectionId);
          return;
        }

        // Handle upvote events
        if (data.resourceId && typeof data.count === "number") {
          // console.log(`Updating resource ${data.resourceId} count to ${data.count}`);

          setUpvoteCounts((prev) => ({
            ...prev,
            [data.resourceId as string]: data.count as number,
          }));
        }
      } catch (error) {
        console.error("Failed to parse SSE message", error);
      }
    };

    eventSource.onerror = () => {
      // console.log("SSE connection error");
      setIsConnected(false);

      // Simple reconnection logic
      setTimeout(() => {
        // console.log("Attempting to reconnect SSE");
        eventSource.close();
        // The effect will run again and create a new connection
      }, 3000);
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  // console.log("Current upvote counts:", upvoteCounts);

  return (
    <UpvoteContext.Provider value={{ upvoteCounts, isConnected }}>
      {children}
    </UpvoteContext.Provider>
  );
}
