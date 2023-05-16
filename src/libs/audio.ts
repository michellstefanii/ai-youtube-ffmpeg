import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { mp3Path, segmentsPath } from "../utils/const";
import { createDirectoryIfNotExists } from "./folder";
import { transcribeBySegment } from "./openai";
import { delay } from "../utils/misc";

export const splitAudioAndTranscribe = async (onDone: () => void) => {
  const segmentDuration = 5; // Duração de cada segmento em minutos

  createDirectoryIfNotExists(segmentsPath);

  try {
    const audioPath = fs.realpathSync(mp3Path);

    const audioInfo = (await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(audioPath, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info.format.duration);
        }
      });
    })) as any;

    const audioDurationInSeconds = parseFloat(audioInfo);
    const audioDurationInMinutes = Math.ceil(audioDurationInSeconds / 60);

    const numSegments = Math.ceil(audioDurationInMinutes / segmentDuration);

    for (let i = 0; i < numSegments; i++) {
      const start = i * segmentDuration;

      const segmentOutputPath = `${segmentsPath}/segment_${i + 1}.mp3`;

      await new Promise<void>((resolve, reject) => {
        ffmpeg(audioPath)
          .setStartTime(start * 60)
          .setDuration(segmentDuration * 60)
          .on("end", async () => {
            console.log(`Segment ${i + 1} of ${numSegments} cut successfully.`);
            await transcribeBySegment(segmentOutputPath, i + 1);
            resolve();
          })
          .on("error", (err) => {
            console.error(`Error saving segment ${i + 1}:`, err.message);
            reject(err);
          })
          .save(segmentOutputPath);
      });
    }

    console.log("Cutting and saving of successfully completed segments.");
    console.log(`Waiting 10 seconds for the next action`);
    await delay(1000);
    onDone();
  } catch (error: any) {
    console.error(
      "[splitAudioAndTranscribe] - An error occurred while cutting and saving segments:",
      error.message
    );
  }
};
