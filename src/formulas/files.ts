import * as coda from "@codahq/packs-sdk";
import { FileSchema } from "../schemas";
import { fetchFromOpenAI, OPENAI_API_BASE_URL } from "../helpers";

export function getFileFormulas(pack: coda.PackDefinitionBuilder) {
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
}