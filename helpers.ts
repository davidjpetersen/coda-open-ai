import * as coda from "@codahq/packs-sdk";
import { OpenAIFetchFunction } from "./types";

export const OPENAI_API_BASE_URL = "https://api.openai.com/v1";

// Helper function to fetch data from OpenAI API
export const fetchFromOpenAI: OpenAIFetchFunction = async (context, endpoint, method = "GET", body?) => {
    try {
        const response = await context.fetcher.fetch({
            method,
            url: `${OPENAI_API_BASE_URL}${endpoint}`,
            headers: body ? { "Content-Type": "application/json" } : undefined,
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