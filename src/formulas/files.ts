import * as coda from "@codahq/packs-sdk";
import { FileSchema } from "../schemas";
import { fetchFromOpenAI, OPENAI_API_BASE_URL } from "../helpers";

function getFilename(contentDisposition: string): string | undefined {
  const match = contentDisposition.match(/filename="(.+?)"/);
  return match ? match[1] : undefined;
}

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
      // Fetch the file contents.
      let response = await context.fetcher.fetch({
        method: "GET",
        url: fileUrl,
        isBinaryResponse: true,
        disableAuthentication: true,
      });
      let buffer = response.body;
      let contentType = response.headers["content-type"] as string;
      let contentDisposition = response.headers["content-disposition"] as string;

      // Determine file name.
      let name: string | undefined;
      if (contentDisposition) {
        name = getFilename(contentDisposition);
      }
      if (!name) {
        // Fallback to last segment of the URL.
        name = fileUrl.split("/").pop() || "upload.dat";
      }
  
      // Upload the file using multipart form upload.
      const openAIResponse = await context.fetcher.fetch({
        method: "POST",
        url: `${OPENAI_API_BASE_URL}/files`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        form: {
          file: buffer,
          purpose: purpose,
        },
      });
      // Refresh the Files table
      console.log(context);
      return openAIResponse.body;
    },
  });

  // Delete File
  pack.addFormula({
    name: "DeleteFile",
    description: "Delete a file from OpenAI.",
    isAction: true,
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "fileId",
        description: "ID of the file to delete.",
      }),
    ],
    resultType: coda.ValueType.Object,
    schema: FileSchema,
    execute: async function ([fileId], context) {
      const openAIResponse = await context.fetcher.fetch({
        method: "DELETE",
        url: `${OPENAI_API_BASE_URL}/files/${fileId}`,
      });
      // Refresh the Files table
      console.log(context);
      return openAIResponse.body;
    },
  });
}