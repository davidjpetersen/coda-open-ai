import * as coda from "@codahq/packs-sdk";
import { AudioTranscriptionSchema, TextToSpeechSchema } from "../schemas";
import { OPENAI_API_BASE_URL, fetchFromOpenAI } from "../helpers";

export function getAudioFormulas(pack: coda.PackDefinitionBuilder) {
  // Audio Transcription
  pack.addFormula({
    name: "TranscribeAudio",
    description: "Transcribe audio to text using Whisper.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "audioUrl",
        description: "URL to the audio file to transcribe.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "language",
        description: "The language of the audio file.",
        optional: true,
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: AudioTranscriptionSchema,
    execute: async function ([audioUrl, language], context) {
      const response = await context.fetcher.fetch({
        method: "POST",
        url: `${OPENAI_API_BASE_URL}/audio/transcriptions`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        form: {
          file: audioUrl,
          model: "whisper-1",
          language,
        },
      });
      return response.body;
    },
  });

  // Text to Speech
  pack.addFormula({
    name: "TextToSpeech",
    description: "Convert text to natural-sounding speech using OpenAI's TTS models.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "text",
        description: "The text to convert to speech.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "voice",
        description: "The voice to use for the audio.",
        autocomplete: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
        suggestedValue: "alloy",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "model",
        description: "The model to use for text-to-speech.",
        autocomplete: ["tts-1", "tts-1-hd"],
        suggestedValue: "tts-1",
        optional: true,
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: TextToSpeechSchema,
    execute: async function ([text, voice, model], context) {
      const response = await fetchFromOpenAI(context, "/audio/speech", "POST", {
        input: text,
        voice,
        model,
        response_format: "mp3",
      });
      return {
        audioUrl: response.audio_url,
        duration: response.duration,
      };
    },
  });

  // Audio Translation
  pack.addFormula({
    name: "TranslateAudio",
    description: "Translate audio into English using Whisper.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "audioUrl",
        description: "URL of the audio file to translate.",
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "prompt",
        description: "Optional prompt to guide the translation.",
        optional: true,
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: AudioTranscriptionSchema,
    execute: async function ([audioUrl, prompt], context) {
      const response = await context.fetcher.fetch({
        method: "POST",
        url: `${OPENAI_API_BASE_URL}/audio/translations`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        form: {
          file: audioUrl,
          model: "whisper-1",
          prompt: prompt,
        },
      });
      return response.body;
    },
  });
}