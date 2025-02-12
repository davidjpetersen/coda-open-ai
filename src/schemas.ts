import * as coda from "@codahq/packs-sdk";

// Batch-related schemas
export const BatchSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
  },
  displayProperty: "id",
  idProperty: "id"
});

// Re-export all schemas from their domain files
export * from './schemas/base';
export * from './schemas/image';
export * from './schemas/audio';
export * from './schemas/assistants';
export * from './schemas/analysis';
export * from './schemas/files';
