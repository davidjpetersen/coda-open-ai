import * as coda from "@codahq/packs-sdk";
import { EmbeddingSchema, ModerationSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getAnalysisFormulas(pack: coda.PackDefinitionBuilder) {
  // Text Embeddings
  pack.addFormula({
    name: "CreateEmbedding",
    description: "Create an embedding vector representing the input text.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "input",
        description: "The text to embed.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "model",
        description: "The model to use for embeddings.",
        optional: true,
        suggestedValue: "text-embedding-ada-002",
      }),
    ],
    resultType: coda.ValueType.Array,
    items: EmbeddingSchema,
    execute: async function ([input, model], context) {
      const data = await fetchFromOpenAI(context, "/embeddings", "POST", {
        input,
        model,
      });
      return data.data;
    },
  });

  // Content Moderation
  pack.addFormula({
    name: "ModerateContent",
    description: "Check if text violates OpenAI's content policy.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "input",
        description: "The text to analyze.",
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: ModerationSchema,
    execute: async function ([input], context) {
      const data = await fetchFromOpenAI(context, "/moderations", "POST", {
        input,
      });
      return data.results[0];
    },
  });
}