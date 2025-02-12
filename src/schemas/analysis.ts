import * as coda from "@codahq/packs-sdk";

export const EmbeddingSchema = coda.makeObjectSchema({
  properties: {
    embedding: { 
      type: coda.ValueType.Array, 
      items: { type: coda.ValueType.Number },
      required: true 
    },
    index: { type: coda.ValueType.Number, required: true },
    object: { type: coda.ValueType.String, required: true },
    model: { type: coda.ValueType.String, required: true },
    usage: {
      type: coda.ValueType.Object,
      required: true,
      properties: {
        prompt_tokens: { type: coda.ValueType.Number, required: true },
        total_tokens: { type: coda.ValueType.Number, required: true }
      }
    }
  },
  displayProperty: "index"
});

export const ModerationSchema = coda.makeObjectSchema({
  properties: {
    flagged: { type: coda.ValueType.Boolean, required: true },
    categories: {
      type: coda.ValueType.Object,
      required: true,
      properties: {
        harassment: { type: coda.ValueType.Boolean, required: true },
        "harassment/threatening": { type: coda.ValueType.Boolean, required: true },
        hate: { type: coda.ValueType.Boolean, required: true },
        "hate/threatening": { type: coda.ValueType.Boolean, required: true },
        "self-harm": { type: coda.ValueType.Boolean, required: true },
        "self-harm/intent": { type: coda.ValueType.Boolean, required: true },
        "self-harm/instructions": { type: coda.ValueType.Boolean, required: true },
        sexual: { type: coda.ValueType.Boolean, required: true },
        "sexual/minors": { type: coda.ValueType.Boolean, required: true },
        violence: { type: coda.ValueType.Boolean, required: true },
        "violence/graphic": { type: coda.ValueType.Boolean, required: true }
      }
    },
    category_scores: {
      type: coda.ValueType.Object,
      required: true,
      properties: {
        harassment: { type: coda.ValueType.Number, required: true },
        "harassment/threatening": { type: coda.ValueType.Number, required: true },
        hate: { type: coda.ValueType.Number, required: true },
        "hate/threatening": { type: coda.ValueType.Number, required: true },
        "self-harm": { type: coda.ValueType.Number, required: true },
        "self-harm/intent": { type: coda.ValueType.Number, required: true },
        "self-harm/instructions": { type: coda.ValueType.Number, required: true },
        sexual: { type: coda.ValueType.Number, required: true },
        "sexual/minors": { type: coda.ValueType.Number, required: true },
        violence: { type: coda.ValueType.Number, required: true },
        "violence/graphic": { type: coda.ValueType.Number, required: true }
      }
    }
  },
  displayProperty: "flagged"
});

export const FineTuneSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String, required: true },
    model: { type: coda.ValueType.String, required: true },
    created_at: { type: coda.ValueType.Number, required: true },
    finished_at: { type: coda.ValueType.Number },
    fine_tuned_model: { type: coda.ValueType.String },
    organization_id: { type: coda.ValueType.String, required: true },
    result_files: { 
      type: coda.ValueType.Array, 
      items: { type: coda.ValueType.String },
      required: true 
    },
    status: { type: coda.ValueType.String, required: true },
    validation_file: { type: coda.ValueType.String },
    training_file: { type: coda.ValueType.String, required: true },
    hyperparameters: {
      type: coda.ValueType.Object,
      required: true,
      properties: {
        n_epochs: { type: coda.ValueType.Number, required: true },
        batch_size: { type: coda.ValueType.Number },
        learning_rate_multiplier: { type: coda.ValueType.Number }
      }
    },
    trained_tokens: { type: coda.ValueType.Number },
    error: { 
      type: coda.ValueType.Object,
      properties: {
        code: { type: coda.ValueType.String, required: true },
        param: { type: coda.ValueType.String },
        message: { type: coda.ValueType.String, required: true }
      }
    }
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["status", "model", "fine_tuned_model"]
});