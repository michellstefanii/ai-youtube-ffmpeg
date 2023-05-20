import { splitAudioAndTranscribe } from "./libs/audio";
import { joinTextFiles, saveTextToFile } from "./libs/file";
import { deleteFolderIfExists } from "./libs/folder";
import { createSummary, createSummaryFromSummary } from "./libs/openai";
import { createPDFFromTXT } from "./libs/pdf";
import { downloadYouTubeVideoAsMP3 } from "./libs/youtube";
import {
  summaryFinalPath,
  summaryFinalSegmentPath,
  summaryPath,
  textSegmentPath,
} from "./utils/const";
import { calculateTime } from "./utils/misc";

const main = async () => {
  try {
    const start = new Date();

    deleteFolderIfExists('source')

    await downloadYouTubeVideoAsMP3()
    await splitAudioAndTranscribe()
    await createSummary(textSegmentPath)

    const txtContent = await joinTextFiles(summaryFinalSegmentPath);
    saveTextToFile(txtContent, summaryPath);

    await createSummaryFromSummary(summaryPath);

    const finalContent = await joinTextFiles(summaryFinalSegmentPath);
    saveTextToFile(finalContent, summaryFinalPath);

    await createPDFFromTXT();

    const end = new Date();
    console.log(`Time spent: ${calculateTime(start, end)}`);
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
