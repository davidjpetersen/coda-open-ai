import * as coda from "@codahq/packs-sdk";
import { ModelSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getModelFormulas(pack: coda.PackDefinitionBuilder) {
  // Function to list models
  pack.addFormula({
    name: "ListModels",
    description: "Retrieve a list of available models from OpenAI.",
    parameters: [],
    resultType: coda.ValueType.Array,
    items: ModelSchema,
    execute: async function ([], context: coda.ExecutionContext) {
      const data = await fetchFromOpenAI(context, "/models");
      return data.data;
    },
  });

  // Sync table to list available models
  pack.addSyncTable({
    name: "AvailableModels",
    description: "Sync table to list available models from OpenAI.",
    identityName: "availableModels",
    schema: ModelSchema,
    formula: {
      name: "AvailableModels",
      description: "Retrieve a list of available models from OpenAI.",
      parameters: [],
      execute: async function ([], context) {
        const data = await fetchFromOpenAI(context, "/models");
        return { result: data.data };
      },
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
      return await fetchFromOpenAI(context, `/models/${modelId}`);
    },
  });
}