import { createChatCompletion, transcribeAudio } from "./libs/openai";
import {
  breakTextAfterPeriod,
  readTextFile,
  removeFile,
  saveTextToFile,
} from "./libs/file";
import { downloadYouTubeVideoAsMP3 } from "./libs/youtube";

const main = async () => {
  try {
    const videoUrl = process.argv[2];
    const subject = process.argv[3];
    const tokenAPI = process.argv[4];
    const mp3OutputPath = "source/audio.mp3";
    const textOutputPath = "source/text.txt";
    const summaryOutputPath = "source/summary.txt";

    await downloadYouTubeVideoAsMP3(videoUrl, mp3OutputPath);
    const text = await transcribeAudio(mp3OutputPath, tokenAPI);
    saveTextToFile(text, textOutputPath);
    await createChatCompletion(textOutputPath, subject, tokenAPI);
    await removeFile(mp3OutputPath);

    const outputText = readTextFile(summaryOutputPath);
    const newText = breakTextAfterPeriod(outputText);
    saveTextToFile(newText, summaryOutputPath);
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
