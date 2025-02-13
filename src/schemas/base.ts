import * as coda from "@codahq/packs-sdk";

export const BatchSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, description: "The unique identifier for the batch." },
    object: { type: coda.ValueType.String, description: "The object type, which is always 'batch'." },
    created_at: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Date, description: "The timestamp of when the batch was created." },
  },
  displayProperty: "id",
  idProperty: "id"
});

export const ModelSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, description: "The unique identifier for the model." },
    owned_by: { type: coda.ValueType.String, description: "The organization that owns the model." },
    created: { type: coda.ValueType.Number, codaType: coda.ValueHintType.DateTime, description: "The timestamp of when the model was created." },
    object: { type: coda.ValueType.String, description: "The object type, which is always 'model'." },
  },
  displayProperty: "id",
  idProperty: "id"
});