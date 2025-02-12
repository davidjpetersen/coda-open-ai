import * as coda from "@codahq/packs-sdk";
import { ModelSchema, ImageSchema, AudioTranscriptionSchema, EmbeddingSchema, FileSchema, ModerationSchema, TextToSpeechSchema, VisionAnalysisSchema, FineTuneSchema } from "./schemas";
import { fetchFromOpenAI, OPENAI_API_BASE_URL } from "./helpers";

export const pack = coda.newPack();

pack.addNetworkDomain("openai.com");

// Set up system-wide authentication
pack.setSystemAuthentication({
    type: coda.AuthenticationType.HeaderBearerToken,
});

// Function to list models
pack.addFormula({
    name: "ListModels",
    description: "Retrieve a list of available models from OpenAI.",
    parameters: [],
    resultType: coda.ValueType.Array,
    items: ModelSchema,
    execute: async function ([], context: coda.ExecutionContext) {
        const data = await fetchFromOpenAI(context, "/models");
        return data.data;
    },
});

// Sync table to list available models
pack.addSyncTable({
    name: "AvailableModels",
    description: "Sync table to list available models from OpenAI.",
    identityName: "availableModels",
    schema: ModelSchema,
    formula: {
        name: "AvailableModels",
        description: "Retrieve a list of available models from OpenAI.",
        parameters: [],
        execute: async function ([], context) {
            const data = await fetchFromOpenAI(context, "/models");
            return { result: data.data };
        },
    },
});

// Function to retrieve a specific model
pack.addFormula({
    name: "GetModel",
    description: "Retrieve details about a specific OpenAI model.",
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "modelId",
            description: "The ID of the model to retrieve.",
        }),
    ],
    resultType: coda.ValueType.Object,
    schema: ModelSchema,
    execute: async function ([modelId], context) {
        return await fetchFromOpenAI(context, `/models/${modelId}`);
    },
});

// Function to complete a chat request
pack.addFormula({
    name: "ChatCompletion",
    description: "Generate a response from OpenAI's chat models.",
    isAction: true,
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "model",
            description: "The model to use (e.g., gpt-3.5-turbo).",
            autocomplete: async function (context: coda.ExecutionContext) {
                const data = await fetchFromOpenAI(context, "/models", "GET");
                return data.data.map((model: { id: string }) => model.id);
            },
        }),
        coda.makeParameter({
            type: coda.ParameterType.StringArray,
            name: "messages",
            description: "An array of messages in the chat conversation.",
        }),
    ],
    resultType: coda.ValueType.String,
    execute: async function ([model, messages], context) {
        const body = {
            model,
            messages: messages.map((msg) => ({ role: "user", content: msg })),
        };
        const data = await fetchFromOpenAI(context, "/chat/completions", "POST", body);
        return data.choices[0].message.content;
    },
});

// Image Generation
pack.addFormula({
  name: "GenerateImage",
  description: "Generate an image using DALL-E.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "prompt",
      description: "A text description of the desired image.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "model",
      description: "The model to use for image generation.",
      optional: true,
      suggestedValue: "dall-e-3",
      autocomplete: ["dall-e-2", "dall-e-3"],
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "size",
      description: "The size of the generated image.",
      optional: true,
      suggestedValue: "1024x1024",
      autocomplete: ["256x256", "512x512", "1024x1024"],
    }),
  ],
  resultType: coda.ValueType.Array,
  items: ImageSchema,
  execute: async function ([prompt, model, size], context) {
    const data = await fetchFromOpenAI(context, "/images/generations", "POST", {
      prompt,
      model,
      size,
      n: 1,
    });
    return data.data;
  },
});

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

// Text Embeddings
pack.addFormula({
  name: "CreateEmbedding",
  description: "Create an embedding vector representing the input text.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "input",
      description: "The text to embed.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "model",
      description: "The model to use for embeddings.",
      optional: true,
      suggestedValue: "text-embedding-ada-002",
    }),
  ],
  resultType: coda.ValueType.Array,
  items: EmbeddingSchema,
  execute: async function ([input, model], context) {
    const data = await fetchFromOpenAI(context, "/embeddings", "POST", {
      input,
      model,
    });
    return data.data;
  },
});

// Files Management
pack.addSyncTable({
  name: "Files",
  description: "List and manage files uploaded to OpenAI.",
  identityName: "file",
  schema: FileSchema,
  formula: {
    name: "ListFiles",
    description: "List files that have been uploaded to OpenAI.",
    parameters: [],
    execute: async function ([], context) {
      const data = await fetchFromOpenAI(context, "/files");
      return { result: data.data };
    },
  },
});

// Upload File
pack.addFormula({
  name: "UploadFile",
  description: "Upload a file for use with OpenAI API features like fine-tuning.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fileUrl",
      description: "URL of the file to upload.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "purpose",
      description: "The intended purpose of the file.",
      autocomplete: ["fine-tune", "assistants"],
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FileSchema,
  execute: async function ([fileUrl, purpose], context) {
    const response = await context.fetcher.fetch({
      method: "POST",
      url: `${OPENAI_API_BASE_URL}/files`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      form: {
        file: fileUrl,
        purpose: purpose,
      },
    });
    return response.body;
  },
});

// Content Moderation
pack.addFormula({
  name: "ModerateContent",
  description: "Check if text violates OpenAI's content policy.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "input",
      description: "The text to analyze.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ModerationSchema,
  execute: async function ([input], context) {
    const data = await fetchFromOpenAI(context, "/moderations", "POST", {
      input,
    });
    return data.results[0];
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

// Vision Analysis
pack.addFormula({
  name: "AnalyzeImage",
  description: "Analyze images using GPT-4 Vision.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "imageUrl",
      description: "URL of the image to analyze.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "prompt",
      description: "What would you like to know about the image?",
      optional: true,
      suggestedValue: "Describe this image in detail.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: VisionAnalysisSchema,
  execute: async function ([imageUrl, prompt], context) {
    const data = await fetchFromOpenAI(context, "/chat/completions", "POST", {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: imageUrl },
          ],
        },
      ],
      max_tokens: 300,
    });
    return {
      analysis: data.choices[0].message.content,
      modelUsed: data.model,
    };
  },
});

// Fine-tunes Management
pack.addSyncTable({
  name: "FineTunes",
  description: "List and monitor fine-tuning jobs.",
  identityName: "fineTune",
  schema: FineTuneSchema,
  formula: {
    name: "ListFineTunes",
    description: "List all fine-tuning jobs.",
    parameters: [],
    execute: async function ([], context) {
      const data = await fetchFromOpenAI(context, "/fine_tuning/jobs");
      return {
        result: data.data.map(job => ({
          ...job,
          createdAt: job.created_at,
          updatedAt: job.updated_at,
          fineTunedModel: job.fine_tuned_model,
        })),
      };
    },
  },
});

// Create Fine-tune
pack.addFormula({
  name: "CreateFineTune",
  description: "Create a new fine-tuning job.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "trainingFileId",
      description: "The ID of the training data file (must be uploaded first using the Files API).",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "model",
      description: "The base model to fine-tune.",
      optional: true,
      suggestedValue: "gpt-3.5-turbo",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FineTuneSchema,
  execute: async function ([trainingFileId, model], context) {
    const data = await fetchFromOpenAI(context, "/fine_tuning/jobs", "POST", {
      training_file: trainingFileId,
      model,
    });
    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fineTunedModel: data.fine_tuned_model,
    };
  },
});

// Get Fine-tune Details
pack.addFormula({
  name: "GetFineTune",
  description: "Get details about a specific fine-tuning job.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fineTuneId",
      description: "The ID of the fine-tune job to retrieve.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FineTuneSchema,
  execute: async function ([fineTuneId], context) {
    const data = await fetchFromOpenAI(context, `/fine_tuning/jobs/${fineTuneId}`);
    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fineTunedModel: data.fine_tuned_model,
    };
  },
});

// Cancel Fine-tune Job
pack.addFormula({
  name: "CancelFineTune",
  description: "Cancel a fine-tuning job.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fineTuneId",
      description: "The ID of the fine-tune job to cancel.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FineTuneSchema,
  execute: async function ([fineTuneId], context) {
    const data = await fetchFromOpenAI(context, `/fine_tuning/jobs/${fineTuneId}/cancel`, "POST");
    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fineTunedModel: data.fine_tuned_model,
    };
  },
});

// List Fine-tune Events
pack.addFormula({
  name: "ListFineTuneEvents",
  description: "List the events for a fine-tuning job, including progress, errors, and status changes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fineTuneId",
      description: "The ID of the fine-tune job.",
    }),
  ],
  resultType: coda.ValueType.Array,
  items: {
    type: coda.ValueType.Object,
    properties: {
      object: { type: coda.ValueType.String },
      createdAt: { type: coda.ValueType.Number },
      level: { type: coda.ValueType.String },
      message: { type: coda.ValueType.String },
    },
  },
  execute: async function ([fineTuneId], context) {
    const data = await fetchFromOpenAI(context, `/fine_tuning/jobs/${fineTuneId}/events`);
    return data.data.map(event => ({
      object: event.object,
      createdAt: event.created_at,
      level: event.level,
      message: event.message,
    }));
  },
});

// Enhance existing CreateFineTune formula with more configuration options
pack.addFormula({
  name: "CreateFineTuneAdvanced",
  description: "Create a new fine-tuning job with advanced configuration options.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "trainingFileId",
      description: "The ID of the training data file.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "model",
      description: "The base model to fine-tune.",
      optional: true,
      suggestedValue: "gpt-3.5-turbo",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "validationFileId",
      description: "The ID of the validation data file.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "nEpochs",
      description: "Number of epochs to train for.",
      optional: true,
      suggestedValue: 4,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "batchSize",
      description: "Batch size for training.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "learningRateMultiplier",
      description: "Learning rate multiplier to use for training.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "suffix",
      description: "A suffix to append to the fine-tuned model name.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FineTuneSchema,
  execute: async function ([trainingFileId, model, validationFileId, nEpochs, batchSize, learningRateMultiplier, suffix], context) {
    const requestBody: any = {
      training_file: trainingFileId,
      model: model || "gpt-3.5-turbo",
    };

    if (validationFileId) requestBody.validation_file = validationFileId;
    if (nEpochs) requestBody.n_epochs = nEpochs;
    if (batchSize) requestBody.batch_size = batchSize;
    if (learningRateMultiplier) requestBody.learning_rate_multiplier = learningRateMultiplier;
    if (suffix) requestBody.suffix = suffix;

    const data = await fetchFromOpenAI(context, "/fine_tuning/jobs", "POST", requestBody);
    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      fineTunedModel: data.fine_tuned_model,
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

// Create Image Variation
pack.addFormula({
  name: "CreateImageVariation",
  description: "Create variations of an existing image.",
  isAction: true,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "imageUrl",
      description: "URL of the image to create variations of.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "size",
      description: "The size of the generated image.",
      optional: true,
      suggestedValue: "1024x1024",
      autocomplete: ["256x256", "512x512", "1024x1024"],
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "n",
      description: "Number of variations to generate.",
      optional: true,
      suggestedValue: 1,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: ImageSchema,
  execute: async function ([imageUrl, size, n], context) {
    const response = await context.fetcher.fetch({
      method: "POST",
      url: `${OPENAI_API_BASE_URL}/images/variations`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      form: {
        image: imageUrl,
        size: size,
        n: n.toString(), // Convert number to string for form data
      },
    });
    return response.body.data;
  },
});
