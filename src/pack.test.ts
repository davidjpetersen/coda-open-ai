import * as coda from "@codahq/packs-sdk";
import { pack } from "./pack";
import { fetchFromOpenAI, unixTimestampToCodaDate } from "./helpers";
import { assert } from "chai";
import { describe, it } from "mocha";
import { executeFormulaFromPackDef, newMockExecutionContext, newJsonFetchResponse } from "@codahq/packs-sdk/dist/development";
import sinon from "sinon";

// Mock context for testing
const mockContext = newMockExecutionContext();

// Mock fetcher response
const fakeResponse = newJsonFetchResponse({
  data: [],
});
sinon.stub(mockContext.fetcher, "fetch").returns(Promise.resolve(fakeResponse));

describe("Coda Pack Tests", () => {
  it("should fetch data from OpenAI API", async () => {
    const result = await fetchFromOpenAI(mockContext, "/test-endpoint");
    assert.isNotNull(result);
  });

  it("should convert Unix timestamp to Coda date format", () => {
    const timestamp = 1633072800; // Example timestamp
    const date = unixTimestampToCodaDate(timestamp);
    assert.instanceOf(date, Date);
  });

  it("should have all formulas added to the pack", () => {
    const formulas = pack.formulas;
    assert.isNotEmpty(formulas);
  });

  // Add more tests for specific formulas
  it("should create a new thread", async () => {
    const result = await executeFormulaFromPackDef(pack, "CreateThread", [], mockContext);
    assert.isNotNull(result);
  });

  it("should list models", async () => {
    const result = await executeFormulaFromPackDef(pack, "ListModels", [], mockContext);
    assert.isArray(result);
  });

  // Add more tests for other formulas as needed
});
