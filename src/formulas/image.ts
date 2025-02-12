import * as coda from "@codahq/packs-sdk";
import { ImageSchema } from "../schemas";
import { OPENAI_API_BASE_URL, fetchFromOpenAI } from "../helpers";

export function getImageFormulas(pack: coda.PackDefinitionBuilder) {
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
          n: n.toString(),
        },
      });
      return response.body.data;
    },
  });
}