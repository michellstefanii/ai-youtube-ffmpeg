import ffmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import { createDirectoryIfNotExists } from "./folder";
import { mp3Path } from "../utils/const";
import { delay } from "../utils/misc";

export const downloadYouTubeVideoAsMP3 = async (onDone: () => void): Promise<void> => {
  try {
    const videoUrl = process.argv[2];

    const videoInfo = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestaudio",
    });
    
    ffmpeg()
      .input(ytdl(videoUrl, { format: audioFormat }))
      .audioCodec("libmp3lame")
      .audioBitrate("20k")
      .save(mp3Path)
      .on("end", async () => {
        console.log("Download and conversion to MP3 completed");
        console.log(`Waiting 20 seconds for the next action`);
        await delay(2000);
        onDone()
      })
      .on("error", (err) => {
        console.error("An error occurred during download and conversion:", err);
      });
  } catch (error) {
    console.error("An error occurred while getting video information:", error);
  }
};
