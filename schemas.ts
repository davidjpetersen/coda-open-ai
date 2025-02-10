import * as coda from "@codahq/packs-sdk";


// Define schema for model data
export const ModelSchema = coda.makeObjectSchema({
    properties: {
        id: { type: coda.ValueType.String },
        object: { type: coda.ValueType.String },
        created: { type: coda.ValueType.Number },
        owned_by: { type: coda.ValueType.String },
    },
    displayProperty: "id",
    idProperty: "id",
    featuredProperties: ["object", "created", "owned_by"],
});
