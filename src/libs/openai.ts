import axios from "axios";
import FormData from "form-data";
import { readFile, readTextFile, saveTextToFile } from "./file";
import { mp3Path, summaryPath, textPath } from "../utils/const";

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

    console.log("Transcrissão concluída com sucesso.");
    saveTextToFile(response.data.text, textPath);
  } catch (error: any) {
    console.error(
      "Ocorreu um erro durante a transcrição:",
      error.response.data
    );
  }
};

export const createChatCompletion = async () => {
  try {
    const outputText = readTextFile(textPath);
    const outputParts = outputText.match(new RegExp(`.{1,${4096}}`, "gs"));
    const messages = [
      {
        role: "user",
        content: `O texto abaixo é uma transcrição de um video sobre: ${process.argv[3]}`,
      },
      {
        role: "user",
        content: "Se comporte como alguem especialista no assunto, sem fugir do tema ou do que foi expressado na transcrição do vídeo",
      },
      {
        role: "user",
        content:
          "O resumo deve ser retornado de forma organizada em tópicos com markdown.",
      },
    ];

    let summary = "";

    if (outputParts) {
      for (const part of outputParts) {
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

        summary += response.data.choices[0].message?.content;
      }
    } else {
      console.error("No output parts found.");
    }

    console.log("Summary saved successfully.");
    saveTextToFile(summary, summaryPath);
  } catch (error: any) {
    console.error("An error occurred:", error);
  }
};
