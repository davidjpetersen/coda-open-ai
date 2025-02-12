import * as coda from "@codahq/packs-sdk";

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

export const ImageSchema = coda.makeObjectSchema({
  properties: {
    url: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
    revised_prompt: { type: coda.ValueType.String },
    b64_json: { type: coda.ValueType.String, optional: true },
    model: { type: coda.ValueType.String },
    created: { type: coda.ValueType.Number }
  },
  displayProperty: "url",
});

export const AudioTranscriptionSchema = coda.makeObjectSchema({
  properties: {
    text: { type: coda.ValueType.String },
    task: { type: coda.ValueType.String },
    language: { type: coda.ValueType.String },
    duration: { type: coda.ValueType.Number },
    segments: {
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          id: { type: coda.ValueType.Number },
          start: { type: coda.ValueType.Number },
          end: { type: coda.ValueType.Number },
          text: { type: coda.ValueType.String }
        }
      }
    }
  },
  displayProperty: "text",
});

export const EmbeddingSchema = coda.makeObjectSchema({
  properties: {
    embedding: { type: coda.ValueType.Array, items: { type: coda.ValueType.Number } },
    index: { type: coda.ValueType.Number },
    object: { type: coda.ValueType.String },
    model: { type: coda.ValueType.String },
    usage: {
      type: coda.ValueType.Object,
      properties: {
        prompt_tokens: { type: coda.ValueType.Number },
        total_tokens: { type: coda.ValueType.Number }
      }
    }
  },
  displayProperty: "index"
});

export const FileSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    bytes: { type: coda.ValueType.Number },
    created_at: { type: coda.ValueType.Number },
    filename: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    purpose: { type: coda.ValueType.String },
    status: { type: coda.ValueType.String },
    status_details: { type: coda.ValueType.String, optional: true }
  },
  displayProperty: "filename",
  idProperty: "id",
  featuredProperties: ["purpose", "created_at", "bytes", "status"],
});

export const ModerationSchema = coda.makeObjectSchema({
  properties: {
    flagged: { type: coda.ValueType.Boolean },
    categories: {
      type: coda.ValueType.Object,
      properties: {
        harassment: { type: coda.ValueType.Boolean },
        "harassment/threatening": { type: coda.ValueType.Boolean },
        hate: { type: coda.ValueType.Boolean },
        "hate/threatening": { type: coda.ValueType.Boolean },
        "self-harm": { type: coda.ValueType.Boolean },
        "self-harm/intent": { type: coda.ValueType.Boolean },
        "self-harm/instructions": { type: coda.ValueType.Boolean },
        sexual: { type: coda.ValueType.Boolean },
        "sexual/minors": { type: coda.ValueType.Boolean },
        violence: { type: coda.ValueType.Boolean },
        "violence/graphic": { type: coda.ValueType.Boolean }
      }
    },
    category_scores: {
      type: coda.ValueType.Object,
      properties: {
        harassment: { type: coda.ValueType.Number },
        "harassment/threatening": { type: coda.ValueType.Number },
        hate: { type: coda.ValueType.Number },
        "hate/threatening": { type: coda.ValueType.Number },
        "self-harm": { type: coda.ValueType.Number },
        "self-harm/intent": { type: coda.ValueType.Number },
        "self-harm/instructions": { type: coda.ValueType.Number },
        sexual: { type: coda.ValueType.Number },
        "sexual/minors": { type: coda.ValueType.Number },
        violence: { type: coda.ValueType.Number },
        "violence/graphic": { type: coda.ValueType.Number }
      }
    }
  },
  displayProperty: "flagged"
});

export const TextToSpeechSchema = coda.makeObjectSchema({
  properties: {
    audioUrl: { type: coda.ValueType.String },
    duration: { type: coda.ValueType.Number, description: "Duration of the audio in seconds" },
    model: { type: coda.ValueType.String },
    response_format: { type: coda.ValueType.String }
  },
  displayProperty: "audioUrl",
});

export const VisionAnalysisSchema = coda.makeObjectSchema({
  properties: {
    analysis: { type: coda.ValueType.String },
    modelUsed: { type: coda.ValueType.String },
    usage: {
      type: coda.ValueType.Object,
      properties: {
        prompt_tokens: { type: coda.ValueType.Number },
        completion_tokens: { type: coda.ValueType.Number },
        total_tokens: { type: coda.ValueType.Number }
      }
    },
    system_fingerprint: { type: coda.ValueType.String, optional: true }
  },
  displayProperty: "analysis",
});

export const FineTuneSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    model: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
    finished_at: { type: coda.ValueType.Number, optional: true },
    fine_tuned_model: { type: coda.ValueType.String, optional: true },
    organization_id: { type: coda.ValueType.String },
    result_files: { type: coda.ValueType.Array, items: { type: coda.ValueType.String } },
    status: { type: coda.ValueType.String },
    validation_file: { type: coda.ValueType.String, optional: true },
    training_file: { type: coda.ValueType.String },
    hyperparameters: {
      type: coda.ValueType.Object,
      properties: {
        n_epochs: { type: coda.ValueType.Number },
        batch_size: { type: coda.ValueType.Number, optional: true },
        learning_rate_multiplier: { type: coda.ValueType.Number, optional: true }
      }
    },
    trained_tokens: { type: coda.ValueType.Number, optional: true },
    error: {
      type: coda.ValueType.Object,
      optional: true,
      properties: {
        code: { type: coda.ValueType.String },
        message: { type: coda.ValueType.String },
        param: { type: coda.ValueType.String, optional: true }
      }
    }
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["model", "status", "fine_tuned_model"]
});

export const AssistantSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
    name: { type: coda.ValueType.String, optional: true },
    description: { type: coda.ValueType.String, optional: true },
    model: { type: coda.ValueType.String },
    instructions: { type: coda.ValueType.String, optional: true },
    tools: { 
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          type: { type: coda.ValueType.String }
        }
      }
    },
    metadata: { type: coda.ValueType.Object, properties: {}, optional: true }
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["model", "instructions", "tools"]
});

export const ThreadSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
    metadata: { type: coda.ValueType.Object, properties: {}, optional: true }
  },
  displayProperty: "id",
  idProperty: "id"
});

export const MessageSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
    thread_id: { type: coda.ValueType.String },
    role: { type: coda.ValueType.String },
    content: { type: coda.ValueType.Array, items: {
      type: coda.ValueType.Object,
      properties: {
        type: { type: coda.ValueType.String },
        text: { 
          type: coda.ValueType.Object,
          properties: {
            value: { type: coda.ValueType.String },
            annotations: { type: coda.ValueType.Array, items: { type: coda.ValueType.Object, properties: {} } }
          }
        }
      }
    }},
    metadata: { type: coda.ValueType.Object, properties: {}, optional: true }
  },
  displayProperty: "content",
  idProperty: "id"
});

export const RunSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    object: { type: coda.ValueType.String },
    created_at: { type: coda.ValueType.Number },
    thread_id: { type: coda.ValueType.String },
    assistant_id: { type: coda.ValueType.String },
    status: { type: coda.ValueType.String },
    started_at: { type: coda.ValueType.Number, optional: true },
    expires_at: { type: coda.ValueType.Number, optional: true },
    completed_at: { type: coda.ValueType.Number, optional: true },
    model: { type: coda.ValueType.String },
    instructions: { type: coda.ValueType.String, optional: true },
    tools: { 
      type: coda.ValueType.Array,
      items: {
        type: coda.ValueType.Object,
        properties: {
          type: { type: coda.ValueType.String }
        }
      }
    },
    metadata: { type: coda.ValueType.Object, properties: {}, optional: true }
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["status", "model", "assistant_id"]
});
