import { createChatCompletion, transcribeAudio } from "./libs/openai";
import { downloadYouTubeVideoAsMP3 } from "./libs/youtube";

const main = async () => {
  try {
    await downloadYouTubeVideoAsMP3();
    await transcribeAudio();
    await createChatCompletion();
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
