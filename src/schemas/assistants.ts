import * as coda from "@codahq/packs-sdk";

export const AssistantSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    object: { type: coda.ValueType.String, required: true },
    created_at: { type: coda.ValueType.Number, required: true },
    name: { type: coda.ValueType.String, mutable: true },
    description: { type: coda.ValueType.String, mutable: true },
    model: { type: coda.ValueType.String, required: true, mutable: true },
    instructions: { type: coda.ValueType.String, mutable: true },
    tools: {
      type: coda.ValueType.Array,
      required: true,
      mutable: true,
      items: {
        type: coda.ValueType.Object,
        properties: {
          type: { type: coda.ValueType.String, required: true }
        }
      }
    },
    tool_resources: {
      type: coda.ValueType.Object,
      mutable: true,
      properties: {
        code_interpreter: {
          type: coda.ValueType.Object,
          properties: {
            file_ids: {
              type: coda.ValueType.Array,
              items: { type: coda.ValueType.String },
              required: true,
            },
          },
        },
        file_search: {
          type: coda.ValueType.Object,
          properties: {
            vector_store_ids: {
              type: coda.ValueType.Array,
              items: { type: coda.ValueType.String },
              required: true,
            },
          },
        },
      },
    },
    metadata: {
      type: coda.ValueType.Array,
      mutable: true,
      items: {
        type: coda.ValueType.Object,
        properties: {
          key: { type: coda.ValueType.String, required: true },
          value: { type: coda.ValueType.String, required: true },
        },
      },
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["model", "instructions", "tools"],
});


export const ThreadSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    object: { type: coda.ValueType.String, required: true },
    created_at: { type: coda.ValueType.Number, required: true, codaType: coda.ValueHintType.DateTime },
    metadata: { type: coda.ValueType.Object, properties: {} }
  },
  displayProperty: "id",
  idProperty: "id"
});

export const MessageSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    object: { type: coda.ValueType.String, required: true },
    created_at: { type: coda.ValueType.Number, required: true, codaType: coda.ValueHintType.DateTime },
    thread_id: { type: coda.ValueType.String, required: true },
    role: { type: coda.ValueType.String, required: true },
    content: {
      type: coda.ValueType.Array,
      required: true,
      items: {
        type: coda.ValueType.Object,
        properties: {
          type: { type: coda.ValueType.String, required: true },
          text: {
            type: coda.ValueType.Object,
            required: true,
            properties: {
              value: { type: coda.ValueType.String, required: true },
              annotations: {
                type: coda.ValueType.Array,
                required: true,
                items: {
                  type: coda.ValueType.Object,
                  properties: {}
                }
              }
            }
          }
        }
      }
    },
    metadata: { type: coda.ValueType.Object, properties: {} }
  },
  displayProperty: "content",
  idProperty: "id"
});

export const RunSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    object: { type: coda.ValueType.String, required: true },
    created_at: { type: coda.ValueType.Number, required: true },
    thread_id: { type: coda.ValueType.String, required: true },
    assistant_id: { type: coda.ValueType.String, required: true },
    status: { type: coda.ValueType.String, required: true },
    started_at: { type: coda.ValueType.Number },
    expires_at: { type: coda.ValueType.Number },
    completed_at: { type: coda.ValueType.Number },
    model: { type: coda.ValueType.String, required: true },
    instructions: { type: coda.ValueType.String },
    tools: {
      type: coda.ValueType.Array,
      required: true,
      items: {
        type: coda.ValueType.Object,
        properties: {
          type: { type: coda.ValueType.String, required: true }
        }
      }
    },
    metadata: { type: coda.ValueType.Object, mutable: true, properties: {} }
  },
  displayProperty: "status",
  idProperty: "id",
  featuredProperties: ["model", "assistant_id", "thread_id"]
});