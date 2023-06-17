import { transcribeAudio, uploadFile } from "../libs/assemblyai";
import { transcribe } from "../libs/deepgram";
import {
  createDirectoryIfNotExists,
  deleteFolderIfExists,
} from "../libs/folder";
import { downloadYouTubeVideoAsMP3 } from "../libs/youtube";
import {
  segmentsPath,
  summaryFinalSegmentPath,
  summarySegmentPath,
  textSegmentPath,
} from "../utils/const";
import { calculateTime } from "../utils/misc";

export const AssemblyAIContext = () => {
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

  async function getTranscribe() {
    const urlFile = await uploadFile();
    if (!urlFile) {
      console.error(new Error("Upload failed. Please try again."));
      return;
    }

    const transcript = await transcribeAudio(urlFile);
    console.log(transcript);
  }

  async function init() {
    startTime();
    resetStructure();
    await downloadYouTubeVideoAsMP3();
    await getTranscribe();
    closeTime();
  }

  return { init };
};
