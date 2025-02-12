import * as coda from "@codahq/packs-sdk";

export const ImageSchema = coda.makeObjectSchema({
  properties: {
    url: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference, required: true },
    revised_prompt: { type: coda.ValueType.String, required: true },
    b64_json: { type: coda.ValueType.String },
    model: { type: coda.ValueType.String, required: true },
    created: { type: coda.ValueType.Number, required: true }
  },
  displayProperty: "url",
});

export const VisionAnalysisSchema = coda.makeObjectSchema({
  properties: {
    analysis: { type: coda.ValueType.String, required: true },
    model_used: { type: coda.ValueType.String, required: true },
    usage: {
      type: coda.ValueType.Object,
      required: true,
      properties: {
        prompt_tokens: { type: coda.ValueType.Number, required: true },
        completion_tokens: { type: coda.ValueType.Number, required: true },
        total_tokens: { type: coda.ValueType.Number, required: true }
      }
    },
    system_fingerprint: { type: coda.ValueType.String }
  },
  displayProperty: "analysis"
});