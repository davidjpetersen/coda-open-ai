import * as coda from "@codahq/packs-sdk";
import { AssistantSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getAssistantFormulas(pack: coda.PackDefinitionBuilder) {
  // Assistants Management
  pack.addSyncTable({
    name: "Assistants",
    description: "List and manage OpenAI assistants.",
    identityName: "Assistant",
    schema: AssistantSchema,
    formula: {
      name: "AssistantsSync",
      description: "Sync assistants with OpenAI.",
      parameters: [],
      execute: async function ([], context: coda.ExecutionContext) {
        const data = await fetchFromOpenAI(context, "/assistants", "GET", undefined, true);
        return { result: data.data };
      },
      executeUpdate: async function (args, updates, context) {
        let jobs = updates.map(async update => {
          let { newValue } = update;
          let assistantId = newValue.id;
          const body = {
            name: newValue.name,
            description: newValue.description,
            model: newValue.model,
            instructions: newValue.instructions,
            tools: newValue.tools,
            metadata: newValue.metadata ? JSON.stringify(newValue.metadata) : {},
          };
          const data = await fetchFromOpenAI(context, `/assistants/${assistantId}`, "POST", body, true);
          return data;
        });
        let results = await Promise.all(jobs);
        return { result: results };
      },
    }
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
    execute: async function ([model, name, instructions, tools]: [string, string, string, string[]], context: coda.ExecutionContext) {
      const body = {
        model,
        name,
        instructions,
        tools: tools?.map(tool => ({ type: tool })),
      };
      return await fetchFromOpenAI(context, "/assistants", "POST", body, true);
    },
  });

  pack.addFormula({
    name: "DeleteAssistant",
    description: "Delete an assistant.",
    isAction: true,
    schema: AssistantSchema,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "assistantId",
        description: "The ID of the assistant to delete.",
      }),
    ],
    resultType: coda.ValueType.Object,
    execute: async function ([assistantId]: [string], context: coda.ExecutionContext) {
      const data = await fetchFromOpenAI(context, `/assistants/${assistantId}`, "DELETE", undefined, true);
      return data;
    },
  });
}