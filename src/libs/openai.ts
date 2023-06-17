import axios from "axios";
import FormData from "form-data";
import { joinTextFiles, readFile, readTextFile, saveTextToFile } from "./file";
import {
  mp3Path,
  summaryFinalSegmentPath,
  summaryPath,
  summarySegmentPath,
  textPath,
  textSegmentPath,
} from "../utils/const";
import { delay } from "../utils/misc";

export const transcribeBySegment = async (
  segmentPath: string,
  index: number
): Promise<void> => {
  try {
    const segmentData = readFile(segmentPath);
    const segmentBuffer = Buffer.from(segmentData);

    const formData = new FormData();
    formData.append("file", segmentBuffer, "audio.mp3");
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ''}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log(`Transcription by segment completed successfully.`);
    saveTextToFile(response.data.text, `${textSegmentPath}/text_${index}.txt`);

    console.log(`Waiting 3 seconds for the next segment.`);
    await delay(300);
  } catch (error: any) {
    console.error(
      `[transcribeBySegment] - An error occurred during transcription by segment`,
      error.response ? error.response.data : error
    );
  }
};

export const transcribeAudio = async (): Promise<void> => {
  try {
    const audioData = readFile(mp3Path);
    const audioBuffer = Buffer.from(audioData);

    const formData = new FormData();
    formData.append("file", audioBuffer, "audio.mp3");
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ''}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log("Transcription completed successfully.");
    saveTextToFile(response.data.text, textPath);
  } catch (error: any) {
    console.error(
      "An error occurred during transcription:",
      error.response.data
    );
  }
};

export const createSummary = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const text = await joinTextFiles(path);
      saveTextToFile(text, textPath);

      const size = 4096;
      const outputParts = [];

      for (let i = 0; i < text.length; i += size) {
        outputParts.push(text.slice(i, i + size));
      }

      const messages = [
        {
          role: "user",
          content: `O texto abaixo é uma transcrição de um video sobre: ${process.env.SUMMARY ?? ''}, faça um breve resumo, bem organizado em bullets de fácil compreenssão, sobre o que foi dito no video, junte todo o aprendizado de forma que o último seja um resumo de todos os anteriores juntos`,
        },
      ];

      if (outputParts) {
        for (const [index, part] of outputParts.entries()) {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [...messages, { role: "user", content: part }],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ''}`,
              },
            }
          );

          saveTextToFile(
            response.data.choices[0].message?.content,
            `${summarySegmentPath}/summary_${index + 1}.txt`
          );
          console.log(
            `Output part ${index + 1} of ${
              outputParts.length
            } received successfully.`
          );
        }
      } else {
        console.error("No output parts found.");
      }

      return resolve(null);
    } catch (error: any) {
      console.error("An error occurred:", error);
      return reject();
    }
  });
};

export const createSummaryFromSummary = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const text = readTextFile(path);
  
      const size = 4096;
      const outputParts = [];
  
      for (let i = 0; i < text.length; i += size) {
        outputParts.push(text.slice(i, i + size));
      }
  
      const messages = [
        {
          role: "user",
          content: `O texto abaixo é uma transcrição de um video sobre: ${process.env.SUMMARY ?? ''}, faça um breve resumo, bem organizado em bullets de fácil compreenssão, sobre o que foi dito no video, junte todo o aprendizado de forma que o último seja um resumo de todos os anteriores juntos`,
        },
      ];
  
      if (outputParts) {
        for (const [index, part] of outputParts.entries()) {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [...messages, { role: "user", content: part }],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPEN_AI_KEY ?? ''}`,
              },
            }
          );
  
          saveTextToFile(
            response.data.choices[0].message?.content,
            `${summaryFinalSegmentPath}/summary_${index + 1}.txt`
          );
          console.log(
            `Final -> Output part ${index + 1} of ${
              outputParts.length
            } received successfully.`
          );
        }
      } else {
        console.error("No output parts found.");
      }
  
      return resolve(null);
    } catch (error: any) {
      console.error("An error occurred:", error);
      return reject();
    }
  })

 
};
