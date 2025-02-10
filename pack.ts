import * as coda from "@codahq/packs-sdk";
import { ModelSchema } from "./schemas";

export const pack = coda.newPack();

pack.addNetworkDomain("openai.com");

// Set up system-wide authentication
pack.setSystemAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
});

// Function to list models
pack.addFormula({
  name: "ListModels",
  description: "Retrieve a list of available models from OpenAI.",
  parameters: [],
  resultType: coda.ValueType.Array,
  items: ModelSchema,
  execute: async function ([], context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.openai.com/v1/models",
    });
    return response.body.data;
  },
});

// Function to retrieve a specific model
pack.addFormula({
  name: "GetModel",
  description: "Retrieve details about a specific OpenAI model.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "modelId",
      description: "The ID of the model to retrieve.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ModelSchema,
  execute: async function ([modelId], context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://api.openai.com/v1/models/${modelId}`,
    });
    return response.body;
  },
});

// Function to complete a chat request
pack.addFormula({
  name: "ChatCompletion",
  description: "Generate a response from OpenAI's chat models.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "model",
      description: "The model to use (e.g., gpt-3.5-turbo).",
    }),
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "messages",
      description: "An array of messages in the chat conversation.",
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function ([model, messages], context) {
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages.map((msg) => ({ role: "user", content: msg })),
      }),
    });
    return response.body.choices[0].message.content;
  },
});
