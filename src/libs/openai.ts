import axios from "axios";
import FormData from "form-data";
import { joinTextFiles, readFile, readTextFile, saveTextToFile } from "./file";
import {
  mp3Path,
  summaryPath,
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
          Authorization: `Bearer ${process.argv[4]}`,
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
          Authorization: `Bearer ${process.argv[4]}`,
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

export const createChatCompletion = async (onDone: () => void) => {
  try {
    const text = await joinTextFiles(textSegmentPath);
    saveTextToFile(text, textPath);

    const outputParts = text.match(new RegExp(`.{1,${4096}}`, "gs"));
    const messages = [
      {
        role: "user",
        content: `O texto abaixo é uma transcrição de um video sobre: ${process.argv[3]}`,
      },
      {
        role: "user",
        content:
          "Não de sua opinião sobre o resumo, apenas organize o que já foi transcrito, mantendo sempre o mais próximo do que foi falado",
      },
      {
        role: "user",
        content:
          "O resumo deve ser retornado de forma organizada, separado por linhas e de clara compreenssão",
      },
    ];

    let summary = "";

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
              Authorization: `Bearer ${process.argv[4]}`,
            },
          }
        );

        console.log(`Output part ${index + 1} of ${outputParts.length} received successfully.`);
        summary += response.data.choices[0].message?.content;
      }
    } else {
      console.error("No output parts found.");
    }

    console.log("Summary saved successfully.");
    saveTextToFile(summary, summaryPath);
    onDone()
  } catch (error: any) {
    console.error("An error occurred:", error);
  }
};
