import * as coda from "@codahq/packs-sdk";
import { FineTuneSchema } from "../schemas";
import { fetchFromOpenAI, unixTimestampToCodaDate } from "../helpers";

export function getFineTuneFormulas(pack: coda.PackDefinitionBuilder) {
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
            createdAt: unixTimestampToCodaDate(job.created_at),
            updatedAt: unixTimestampToCodaDate(job.updated_at),
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
        createdAt: unixTimestampToCodaDate(data.created_at),
        updatedAt: unixTimestampToCodaDate(data.updated_at),
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
        createdAt: unixTimestampToCodaDate(data.created_at),
        updatedAt: unixTimestampToCodaDate(data.updated_at),
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
        createdAt: unixTimestampToCodaDate(data.created_at),
        updatedAt: unixTimestampToCodaDate(data.updated_at),
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
        createdAt: { type: coda.ValueType.String },
        level: { type: coda.ValueType.String },
        message: { type: coda.ValueType.String },
      },
    },
    execute: async function ([fineTuneId], context) {
      const data = await fetchFromOpenAI(context, `/fine_tuning/jobs/${fineTuneId}/events`);
      return data.data.map(event => ({
        object: event.object,
        createdAt: unixTimestampToCodaDate(event.created_at),
        level: event.level,
        message: event.message,
      }));
    },
  });

  // Advanced Fine-tune Creation
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
        createdAt: unixTimestampToCodaDate(data.created_at),
        updatedAt: unixTimestampToCodaDate(data.updated_at),
        fineTunedModel: data.fine_tuned_model,
      };
    },
  });
}