import * as coda from "@codahq/packs-sdk";
import { VisionAnalysisSchema } from "../schemas";
import { fetchFromOpenAI } from "../helpers";

export function getChatAndVisionFormulas(pack: coda.PackDefinitionBuilder) {
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
        model_used: data.model,
        usage: data.usage,
        system_fingerprint: data.system_fingerprint
      };
    },
  });
}