import * as coda from "@codahq/packs-sdk";

export const BatchSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
  },
  displayProperty: "id",
  idProperty: "id"
});

export const ModelSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    owned_by: { type: coda.ValueType.String },
    created: { type: coda.ValueType.Number },
    object: { type: coda.ValueType.String },
    permissions: { 
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          id: { type: coda.ValueType.String },
          object: { type: coda.ValueType.String },
          created: { type: coda.ValueType.Number },
          allow_create_engine: { type: coda.ValueType.Boolean },
          allow_sampling: { type: coda.ValueType.Boolean },
          allow_logprobs: { type: coda.ValueType.Boolean },
          allow_view: { type: coda.ValueType.Boolean },
          is_blocking: { type: coda.ValueType.Boolean },
        }
      }
    }
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["owned_by", "created"],
});