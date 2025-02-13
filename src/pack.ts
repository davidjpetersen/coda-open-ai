import * as coda from "@codahq/packs-sdk";

// Formula imports
import {
  getModelFormulas,
  getChatAndVisionFormulas,
  getImageFormulas,
  getAudioFormulas,
  getAnalysisFormulas,
  getFileFormulas,
  getFineTuneFormulas,
  getAssistantFormulas,
  getThreadsFormulas
} from "./formulas";


export const pack = coda.newPack();

pack.addNetworkDomain("openai.com");

// Set up system-wide authentication
pack.setUserAuthentication({
    type: coda.AuthenticationType.HeaderBearerToken,
});

// Initialize formulas from organized modules
getModelFormulas(pack);
getChatAndVisionFormulas(pack);
getImageFormulas(pack);
getAudioFormulas(pack);
getAnalysisFormulas(pack);
getFileFormulas(pack);
getFineTuneFormulas(pack);
getAssistantFormulas(pack);
getThreadsFormulas(pack);
