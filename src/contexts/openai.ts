import { splitAudioAndTranscribe } from "../libs/audio";
import { joinTextFiles, saveTextToFile } from "../libs/file";
import {
  createDirectoryIfNotExists,
  deleteFolderIfExists,
} from "../libs/folder";
import { createSummary } from "../libs/openai";
import { createPDFFromTXT } from "../libs/pdf";
import { downloadYouTubeVideoAsMP3 } from "../libs/youtube";
import {
  segmentsPath,
  summaryFinalSegmentPath,
  summaryPath,
  summarySegmentPath,
  textSegmentPath,
} from "../utils/const";
import { calculateTime, delay } from "../utils/misc";

export const OpenAiContext = () => {
  let startDate = new Date();

  function startTime() {
    startDate = new Date();
  }

  function closeTime() {
    const end = new Date();
    console.log(`Time spent: ${calculateTime(startDate, end)}`);
  }

  function resetStructure() {
    deleteFolderIfExists("source");
    createDirectoryIfNotExists(textSegmentPath);
    createDirectoryIfNotExists(summarySegmentPath);
    createDirectoryIfNotExists(summaryFinalSegmentPath);
    createDirectoryIfNotExists(segmentsPath);
  }

  async function transcribeVideo() {
    await downloadYouTubeVideoAsMP3();
    await splitAudioAndTranscribe();
  }

  async function getSummary() {
    await createSummary(textSegmentPath);
    const txtContent = await joinTextFiles(summarySegmentPath);
    saveTextToFile(txtContent, summaryPath);
    await delay(1000);

    // await createSummaryFromSummary(summaryPath);
    // const finalContent = await joinTextFiles(summaryFinalSegmentPath);
    // saveTextToFile(finalContent, summaryFinalPath);
  }

  async function createPDF() {
    await createPDFFromTXT(summaryPath);
  }

  async function init() {
    startTime();
    resetStructure();
    await transcribeVideo();
    await getSummary();
    await createPDF();
    closeTime();
  }

  return { init };
};
