import * as coda from "@codahq/packs-sdk";

export const AudioTranscriptionSchema = coda.makeObjectSchema({
  properties: {
    text: { type: coda.ValueType.String, required: true },
    task: { type: coda.ValueType.String, required: true },
    language: { type: coda.ValueType.String, required: true },
    duration: { type: coda.ValueType.Number, required: true },
    segments: {
      type: coda.ValueType.Array,
      required: true,
      items: {
        type: coda.ValueType.Object,
        properties: {
          id: { type: coda.ValueType.Number, required: true },
          start: { type: coda.ValueType.Number, required: true },
          end: { type: coda.ValueType.Number, required: true },
          text: { type: coda.ValueType.String, required: true }
        }
      }
    }
  },
  displayProperty: "text",
});

export const TextToSpeechSchema = coda.makeObjectSchema({
  properties: {
    audioUrl: { type: coda.ValueType.String, required: true },
    duration: { type: coda.ValueType.Number, description: "Duration of the audio in seconds", required: true },
    model: { type: coda.ValueType.String, required: true },
    response_format: { type: coda.ValueType.String, required: true }
  },
  displayProperty: "audioUrl",
});