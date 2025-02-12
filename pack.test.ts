import { expect } from "chai";
import sinon from "sinon";
import { pack } from "./pack";

// Language: typescript

// Helper to retrieve the formula by its name.
// Assumes that pack formulas are stored in an array under "formulas".
function getFormulaByName(name: string): any {
    const formulas = (pack as any).formulas;
    const formula = formulas.find((f: any) => f.name === name);
    if (!formula) {
        throw new Error(`Cannot find formula "${name}"`);
    }
    return formula;
}

describe("Pack Formulas", () => {
    let context: any;

    beforeEach(() => {
        // Create a fake context with a stubbed fetcher.
        context = {
            fetcher: {
                fetch: sinon.stub(),
            },
        };
    });

    it("ListModels formula should fetch models", async () => {
        // Arrange
        const mockResponse = { data: [{ id: "model-1" }, { id: "model-2" }] };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("ListModels");

        // Act
        const result = await formula.execute([], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse.data);
    });

    it("GetModel formula should fetch model details", async () => {
        // Arrange
        const modelId = "model-123";
        const mockModel = { id: modelId, name: "Test Model" };
        context.fetcher.fetch.resolves({ body: mockModel });
        const formula = getFormulaByName("GetModel");

        // Act
        const result = await formula.execute([modelId], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockModel);
    });

    it("ChatCompletion formula should return chat response", async () => {
        // Arrange
        const model = "gpt-3.5-turbo";
        const messages = ["Hello", "How are you?"];
        const responseContent = "Chat response content";
        const mockResponse = {
            choices: [{ message: { content: responseContent } }],
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("ChatCompletion");

        // Act
        const result = await formula.execute([model, messages], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.equal(responseContent);
    });

    it("ChatCompletion model parameter autocomplete returns model IDs", async () => {
        // Arrange
        const mockResponse = { data: [{ id: "model-1" }, { id: "model-2" }] };
        context.fetcher.fetch.resolves({ body: mockResponse });

        // Retrieve the ChatCompletion formula and its first parameter (for model)
        const chatFormula = getFormulaByName("ChatCompletion");
        const modelParam = chatFormula.parameters[0];

        // Act
        const result = await modelParam.autocomplete(context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(["model-1", "model-2"]);
    });

    it("AvailableModels sync table formula should fetch available models", async () => {
        // Arrange
        const mockResponse = { data: [{ id: "model-1" }, { id: "model-2" }] };
        context.fetcher.fetch.resolves({ body: mockResponse });

        // Retrieve the sync table using pack.syncTables.
        const syncTable = (pack as any).syncTables.find((t: any) => t.name === "AvailableModels");
        if (!syncTable) {
            throw new Error('Cannot find sync table "AvailableModels"');
        }
        const formula = syncTable.formula;

        // Act
        const result = await formula.execute([], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result.result).to.deep.equal(mockResponse.data);
    });

    it("GenerateImage formula should generate an image", async () => {
        // Arrange
        const prompt = "A cute dog";
        const model = "dall-e-3";
        const size = "1024x1024";
        const mockResponse = {
            data: [{ url: "https://example.com/image.png" }]
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("GenerateImage");

        // Act
        const result = await formula.execute([prompt, model, size], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse.data);
    });

    it("TranscribeAudio formula should transcribe audio", async () => {
        // Arrange
        const audioUrl = "https://example.com/audio.mp3";
        const language = "en";
        const mockResponse = {
            text: "Hello world",
            duration: 1.5
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("TranscribeAudio");

        // Act
        const result = await formula.execute([audioUrl, language], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse);
    });

    it("CreateEmbedding formula should create embeddings", async () => {
        // Arrange
        const input = "Test text";
        const model = "text-embedding-ada-002";
        const mockResponse = {
            data: [{ embedding: [0.1, 0.2, 0.3] }]
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("CreateEmbedding");

        // Act
        const result = await formula.execute([input, model], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse.data);
    });

    it("ModerateContent formula should check content", async () => {
        // Arrange
        const input = "Test content";
        const mockResponse = {
            results: [{
                flagged: false,
                categories: { hate: false, threatening: false }
            }]
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("ModerateContent");

        // Act
        const result = await formula.execute([input], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse.results[0]);
    });

    it("TextToSpeech formula should convert text to speech", async () => {
        // Arrange
        const text = "Hello world";
        const voice = "alloy";
        const model = "tts-1";
        const mockResponse = {
            audio_url: "https://example.com/speech.mp3",
            duration: 1.5
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("TextToSpeech");

        // Act
        const result = await formula.execute([text, voice, model], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal({
            audioUrl: mockResponse.audio_url,
            duration: mockResponse.duration
        });
    });

    it("AnalyzeImage formula should analyze images", async () => {
        // Arrange
        const imageUrl = "https://example.com/image.jpg";
        const prompt = "Describe this image";
        const mockResponse = {
            choices: [{
                message: {
                    content: "An image description"
                }
            }],
            model: "gpt-4-vision-preview"
        };
        context.fetcher.fetch.resolves({ body: mockResponse });
        const formula = getFormulaByName("AnalyzeImage");

        // Act
        const result = await formula.execute([imageUrl, prompt], context);

        // Assert
        expect(context.fetcher.fetch.calledOnce).to.be.true;
        expect(result).to.deep.equal({
            analysis: mockResponse.choices[0].message.content,
            modelUsed: mockResponse.model
        });
    });

    describe("Files Management", () => {
        it("Files sync table should list files", async () => {
            // Arrange
            const mockResponse = {
                data: [
                    { id: "file-1", filename: "test1.jsonl", purpose: "fine-tune" },
                    { id: "file-2", filename: "test2.jsonl", purpose: "fine-tune" }
                ]
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const syncTable = (pack as any).syncTables.find((t: any) => t.name === "Files");
            const formula = syncTable.formula;

            // Act
            const result = await formula.execute([], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(result.result).to.deep.equal(mockResponse.data);
        });

        it("UploadFile formula should upload a file", async () => {
            // Arrange
            const fileUrl = "https://example.com/training.jsonl";
            const purpose = "fine-tune";
            const mockResponse = {
                id: "file-123",
                filename: "training.jsonl",
                purpose: "fine-tune"
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const formula = getFormulaByName("UploadFile");

            // Act
            const result = await formula.execute([fileUrl, purpose], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(result).to.deep.equal(mockResponse);
        });
    });

    describe("Fine-tuning", () => {
        it("GetFineTune formula should retrieve fine-tune details", async () => {
            // Arrange
            const fineTuneId = "ft-123";
            const mockResponse = {
                id: fineTuneId,
                model: "gpt-3.5-turbo",
                created_at: 1677649420,
                updated_at: 1677649440,
                fine_tuned_model: "ft-model-123",
                status: "succeeded"
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const formula = getFormulaByName("GetFineTune");

            // Act
            const result = await formula.execute([fineTuneId], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                ...mockResponse,
                createdAt: mockResponse.created_at,
                updatedAt: mockResponse.updated_at,
                fineTunedModel: mockResponse.fine_tuned_model
            });
        });

        it("CancelFineTune formula should cancel a fine-tune job", async () => {
            // Arrange
            const fineTuneId = "ft-123";
            const mockResponse = {
                id: fineTuneId,
                model: "gpt-3.5-turbo",
                created_at: 1677649420,
                updated_at: 1677649440,
                fine_tuned_model: null,
                status: "cancelled"
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const formula = getFormulaByName("CancelFineTune");

            // Act
            const result = await formula.execute([fineTuneId], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                ...mockResponse,
                createdAt: mockResponse.created_at,
                updatedAt: mockResponse.updated_at,
                fineTunedModel: mockResponse.fine_tuned_model
            });
        });

        it("ListFineTuneEvents formula should list events", async () => {
            // Arrange
            const fineTuneId = "ft-123";
            const mockResponse = {
                data: [
                    {
                        object: "fine-tune-event",
                        created_at: 1677649420,
                        level: "info",
                        message: "Fine-tune started"
                    },
                    {
                        object: "fine-tune-event",
                        created_at: 1677649440,
                        level: "info",
                        message: "Completed epoch 1/4"
                    }
                ]
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const formula = getFormulaByName("ListFineTuneEvents");

            // Act
            const result = await formula.execute([fineTuneId], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(result).to.deep.equal(mockResponse.data.map(event => ({
                object: event.object,
                createdAt: event.created_at,
                level: event.level,
                message: event.message
            })));
        });

        it("CreateFineTuneAdvanced formula should create job with advanced options", async () => {
            // Arrange
            const trainingFileId = "file-123";
            const model = "gpt-3.5-turbo";
            const validationFileId = "file-456";
            const nEpochs = 4;
            const batchSize = 4;
            const learningRateMultiplier = 0.1;
            const suffix = "custom-model";

            const mockResponse = {
                id: "ft-789",
                model,
                created_at: 1677649420,
                updated_at: 1677649440,
                fine_tuned_model: null,
                status: "pending"
            };
            context.fetcher.fetch.resolves({ body: mockResponse });
            const formula = getFormulaByName("CreateFineTuneAdvanced");

            // Act
            const result = await formula.execute([
                trainingFileId,
                model,
                validationFileId,
                nEpochs,
                batchSize,
                learningRateMultiplier,
                suffix
            ], context);

            // Assert
            expect(context.fetcher.fetch.calledOnce).to.be.true;
            expect(context.fetcher.fetch.firstCall.args[2]).to.equal("POST");
            expect(JSON.parse(context.fetcher.fetch.firstCall.args[3])).to.deep.equal({
                training_file: trainingFileId,
                model,
                validation_file: validationFileId,
                n_epochs: nEpochs,
                batch_size: batchSize,
                learning_rate_multiplier: learningRateMultiplier,
                suffix
            });
            expect(result).to.deep.equal({
                ...mockResponse,
                createdAt: mockResponse.created_at,
                updatedAt: mockResponse.updated_at,
                fineTunedModel: mockResponse.fine_tuned_model
            });
        });
    });
});
