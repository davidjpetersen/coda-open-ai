import * as coda from "@codahq/packs-sdk";

export const ModelSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    owned_by: { type: coda.ValueType.String },
    created: { type: coda.ValueType.Number },
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["owned_by", "created"],
});

export const ImageSchema = coda.makeObjectSchema({
  properties: {
    url: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
    revised_prompt: { type: coda.ValueType.String },
  },
  displayProperty: "url",
});

export const AudioTranscriptionSchema = coda.makeObjectSchema({
  properties: {
    text: { type: coda.ValueType.String },
  },
  displayProperty: "text",
});

export const EmbeddingSchema = coda.makeObjectSchema({
  properties: {
    embedding: { type: coda.ValueType.Array, items: { type: coda.ValueType.Number } },
    index: { type: coda.ValueType.Number },
  },
  displayProperty: "index",
});

export const FileSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    bytes: { type: coda.ValueType.Number },
    created_at: { type: coda.ValueType.Number },
    filename: { type: coda.ValueType.String },
    purpose: { type: coda.ValueType.String },
  },
  displayProperty: "filename",
  idProperty: "id",
  featuredProperties: ["purpose", "created_at", "bytes"],
});

export const ModerationSchema = coda.makeObjectSchema({
  properties: {
    flagged: { type: coda.ValueType.Boolean },
    categories: {
      type: coda.ValueType.Object,
      properties: {
        hate: { type: coda.ValueType.Boolean },
        "hate/threatening": { type: coda.ValueType.Boolean },
        "self-harm": { type: coda.ValueType.Boolean },
        sexual: { type: coda.ValueType.Boolean },
        "sexual/minors": { type: coda.ValueType.Boolean },
        violence: { type: coda.ValueType.Boolean },
        "violence/graphic": { type: coda.ValueType.Boolean },
      },
    },
    category_scores: {
      type: coda.ValueType.Object,
      properties: {
        hate: { type: coda.ValueType.Number },
        "hate/threatening": { type: coda.ValueType.Number },
        "self-harm": { type: coda.ValueType.Number },
        sexual: { type: coda.ValueType.Number },
        "sexual/minors": { type: coda.ValueType.Number },
        violence: { type: coda.ValueType.Number },
        "violence/graphic": { type: coda.ValueType.Number },
      },
    },
  },
  displayProperty: "flagged",
});

export const TextToSpeechSchema = coda.makeObjectSchema({
  properties: {
    audioUrl: { type: coda.ValueType.String },
    duration: { type: coda.ValueType.Number, description: "Duration of the audio in seconds" },
  },
  displayProperty: "audioUrl",
});

export const VisionAnalysisSchema = coda.makeObjectSchema({
  properties: {
    analysis: { type: coda.ValueType.String },
    modelUsed: { type: coda.ValueType.String },
  },
  displayProperty: "analysis",
});

export const FineTuneSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    model: { type: coda.ValueType.String },
    status: { type: coda.ValueType.String },
    fineTunedModel: { type: coda.ValueType.String },
    organization: { type: coda.ValueType.String },
    createdAt: { type: coda.ValueType.Number },
    updatedAt: { type: coda.ValueType.Number },
  },
  displayProperty: "id",
  idProperty: "id",
  featuredProperties: ["model", "status", "fineTunedModel"],
});
