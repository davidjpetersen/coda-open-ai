import * as coda from "@codahq/packs-sdk";
import { ThreadSchema, MessageSchema, RunSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getThreadsFormulas(pack: coda.PackDefinitionBuilder) {
  // Threads Management
  pack.addFormula({
    name: "CreateThread",
    description: "Create a new conversation thread.",
    isAction: true,
    parameters: [],
    resultType: coda.ValueType.Object,
    schema: ThreadSchema,
    execute: async function ([], context) {
      return await fetchFromOpenAI(context, "/threads", "POST", {}, true);
    },
  });

  // Messages Management
  pack.addFormula({
    name: "CreateMessage",
    description: "Create a new message in a thread.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "threadId",
        description: "The ID of the thread to add the message to.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "content",
        description: "The content of the message.",
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: MessageSchema,
    execute: async function ([threadId, content], context) {
      const body = {
        role: "user",
        content,
      };
      return await fetchFromOpenAI(context, `/threads/${threadId}/messages`, "POST", body, true);
    },
  });

  pack.addFormula({
    name: "ListMessages",
    description: "List all messages in a thread.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "threadId",
        description: "The ID of the thread to list messages from.",
      }),
    ],
    resultType: coda.ValueType.Array,
    items: MessageSchema,
    execute: async function ([threadId], context) {
      const data = await fetchFromOpenAI(context, `/threads/${threadId}/messages`, "GET", undefined, true);
      return data.data;
    },
  });

  // Runs Management
  pack.addFormula({
    name: "CreateRun",
    description: "Start a new assistant run on a thread.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "threadId",
        description: "The ID of the thread.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "assistantId",
        description: "The ID of the assistant to use.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "instructions",
        description: "Override the assistant's instructions for this run.",
        optional: true,
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: RunSchema,
    execute: async function ([threadId, assistantId, instructions], context) {
      const body = {
        assistant_id: assistantId,
        instructions,
      };
      return await fetchFromOpenAI(context, `/threads/${threadId}/runs`, "POST", body, true);
    },
  });

  pack.addFormula({
    name: "GetRun",
    description: "Get the status of a run.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "threadId",
        description: "The ID of the thread.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "runId",
        description: "The ID of the run to check.",
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: RunSchema,
    execute: async function ([threadId, runId], context) {
      return await fetchFromOpenAI(context, `/threads/${threadId}/runs/${runId}`, "GET", undefined, true);
    },
  });
}