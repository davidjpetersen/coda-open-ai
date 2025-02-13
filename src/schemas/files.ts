import * as coda from "@codahq/packs-sdk";

export const FileSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    object: { type: coda.ValueType.String, required: true },
    bytes: { type: coda.ValueType.Number, required: true },
    created_at: { type: coda.ValueType.Number, required: true, codaType: coda.ValueHintType.DateTime },
    filename: { type: coda.ValueType.String, required: true },
    purpose: { type: coda.ValueType.String, required: true },
    status: { type: coda.ValueType.String, required: true },
    status_details: { type: coda.ValueType.String }
  },
  displayProperty: "filename",
  idProperty: "id",
  featuredProperties: ["purpose", "bytes", "created_at"]
});