import { splitAudioAndTranscribe } from "./libs/audio";
import { joinTextFiles, saveTextToFile } from "./libs/file";
import { createDirectoryIfNotExists, deleteFolderIfExists } from "./libs/folder";
import { createSummary, createSummaryFromSummary } from "./libs/openai";
import { createPDFFromTXT } from "./libs/pdf";
import { downloadYouTubeVideoAsMP3 } from "./libs/youtube";
import {
  segmentsPath,
  summaryFinalPath,
  summaryFinalSegmentPath,
  summaryPath,
  summarySegmentPath,
  textSegmentPath,
} from "./utils/const";
import { calculateTime } from "./utils/misc";

const main = async () => {
  try {
    const start = new Date();

    deleteFolderIfExists("source");

    createDirectoryIfNotExists(textSegmentPath);
    createDirectoryIfNotExists(summarySegmentPath);
    createDirectoryIfNotExists(summaryFinalSegmentPath);
    createDirectoryIfNotExists(segmentsPath);

    await downloadYouTubeVideoAsMP3(async () => {
      await splitAudioAndTranscribe(async () => {
        await createSummary(textSegmentPath, async () => {
          const txtContent = await joinTextFiles(summarySegmentPath);
          saveTextToFile(txtContent, summaryPath);
          await createSummaryFromSummary(summaryPath, async () => {
            const finalContent = await joinTextFiles(summaryFinalSegmentPath);
            saveTextToFile(finalContent, summaryFinalPath);
            await createPDFFromTXT(() => {
              const end = new Date();
              console.log(`Time spent: ${calculateTime(start, end)}`);
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Ocorreu um erro:", err);
  }
};

main();
