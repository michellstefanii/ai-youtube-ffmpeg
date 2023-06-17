import { Deepgram } from "@deepgram/sdk";
import { readFile } from "./file";
import { mp3Path } from "../utils/const";

export const transcribe = async () => {
  return new Promise(async (resolve, reject) => {
    const deepgram = new Deepgram(process.env.DEEPGRAM_KEY ?? "");

    const audio = readFile(mp3Path);
    const mimetype = "audio/mp3";

    const source = {
      buffer: audio,
      mimetype: mimetype,
    };

    deepgram.transcription
      .preRecorded(source, {
        smart_format: true,
        model: "general",
        language: "pt-BR",
      })
      .then((response) => {
        // Write the response to the console
        console.dir(response, { depth: null });
        resolve(null);
        // Write only the transcript to the console
        //console.dir(response.results.channels[0].alternatives[0].transcript, { depth: null });
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
};
