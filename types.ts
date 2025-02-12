import * as coda from "@codahq/packs-sdk";

export type OpenAIMethod = "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | "HEAD";

export interface OpenAIFetchOptions {
    method: OpenAIMethod;
    url: string;
    headers?: Record<string, string>;
    body?: any;
}

export type OpenAIFetchFunction = (
    context: coda.ExecutionContext, 
    endpoint: string, 
    method?: OpenAIMethod, 
    body?: any
) => Promise<any>;