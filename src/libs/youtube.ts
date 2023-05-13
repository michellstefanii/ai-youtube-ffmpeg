import ffmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import { createDirectoryIfNotExists } from "./folder";
import { mp3Path } from "../utils/const";

export const downloadYouTubeVideoAsMP3 = async (): Promise<void> => {
  try {
    const videoUrl = process.argv[2];

    const videoInfo = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestaudio",
    });
    createDirectoryIfNotExists(mp3Path.split("/")[0]);
    ffmpeg()
      .input(ytdl(videoUrl, { format: audioFormat }))
      .audioCodec("libmp3lame")
      .audioBitrate("20k")
      .save(mp3Path)
      .on("end", () => {
        console.log("Download e conversão para MP3 concluídos");
      })
      .on("error", (err) => {
        console.error("Ocorreu um erro durante o download e conversão:", err);
      });
  } catch (error) {
    console.error("Ocorreu um erro ao obter informações do vídeo:", error);
  }
};
