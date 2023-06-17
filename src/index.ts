import { AssemblyAIContext } from "./contexts/assemblyai";
import { DeepgramContext } from "./contexts/deepgram";
import { OpenAiContext } from "./contexts/openai";

import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  try {
    // const context = OpenAiContext();
    // context.init();

    // const context = DeepgramContext()
    // context.init();

    // const context = AssemblyAIContext()
    // context.init();
    
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
