import * as coda from "@codahq/packs-sdk";
import { OpenAIFetchFunction } from "./types";

export const OPENAI_API_BASE_URL = "https://api.openai.com/v1";

// Helper function to fetch data from OpenAI API 
export const fetchFromOpenAI: OpenAIFetchFunction = async (context, endpoint, method = "GET", body?, isAssistantApi = false) => {
    try {
        const headers: Record<string, string> = {};
        if (body) {
            headers["Content-Type"] = "application/json";
        }
        if (isAssistantApi) {
            headers["OpenAI-Beta"] = "assistants=v2";
        }

        const response = await context.fetcher.fetch({
            method,
            url: `${OPENAI_API_BASE_URL}${endpoint}`,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        if (!response.status) {
            throw new Error(`Error fetching from OpenAI: ${response.status}`);
        }
        return response.body;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch data from OpenAI.");
    }
}

// Utility function to convert Unix timestamp to Coda date format
export function unixTimestampToCodaDate(timestamp: number): Date {
  if (!timestamp) {
    return new Date(Date.now());
  }
  
  // Ensure timestamp is a number
  const numericTimestamp = Number(timestamp);
  if (isNaN(numericTimestamp)) {
    throw new Error('Invalid timestamp provided');
  }

  // Check if timestamp is in milliseconds or seconds
  // Most Unix timestamps are in seconds, but some APIs might provide milliseconds
  const timestampMs = numericTimestamp < 1e12 
    ? numericTimestamp * 1000  // Convert seconds to milliseconds
    : numericTimestamp;        // Already in milliseconds
    
  return new Date(timestampMs);
}