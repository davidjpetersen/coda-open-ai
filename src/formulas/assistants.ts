import * as coda from "@codahq/packs-sdk";
import { AssistantSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getAssistantFormulas(pack: coda.PackDefinitionBuilder) {
  // Assistants Management
  pack.addSyncTable({
    name: "Assistants",
    description: "List and manage OpenAI assistants.",
    identityName: "assistant",
    schema: AssistantSchema,
    formula: {
      name: "ListAssistants",
      description: "List all assistants.",
      parameters: [],
      execute: async function ([], context) {
        const data = await fetchFromOpenAI(context, "/assistants", "GET", undefined, true);
        return { result: data.data };
      },
    },
  });

  pack.addFormula({
    name: "CreateAssistant",
    description: "Create a new assistant.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "model",
        description: "The model to use (e.g., gpt-4-turbo).",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "name",
        description: "The name of the assistant.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "instructions",
        description: "Instructions for the assistant's behavior.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.StringArray,
        name: "tools",
        description: "Tools the assistant can use (code_interpreter, retrieval, function).",
        optional: true,
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: AssistantSchema,
    execute: async function ([model, name, instructions, tools], context) {
      const body = {
        model,
        name,
        instructions,
        tools: tools?.map(tool => ({ type: tool })),
      };
      return await fetchFromOpenAI(context, "/assistants", "POST", body, true);
    },
  });
}