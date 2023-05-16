import { splitAudioAndTranscribe } from "./libs/audio";
import { deleteFolderIfExists } from "./libs/folder";
import { createChatCompletion } from "./libs/openai";
import { createPDFFromTXT } from "./libs/pdf";
import { downloadYouTubeVideoAsMP3 } from "./libs/youtube";
import { calculateTime } from "./utils/misc";

const main = async () => {
  try {
    const start = new Date();

    deleteFolderIfExists('source')

    await downloadYouTubeVideoAsMP3(async () => {
      await splitAudioAndTranscribe(async () => {
        await createChatCompletion(() => {
          createPDFFromTXT();
          const end = new Date();
          console.log(`Time spent: ${calculateTime(start, end)}`);
        });
      });
    });
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
