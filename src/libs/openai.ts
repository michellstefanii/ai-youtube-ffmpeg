import axios from "axios";
import FormData from "form-data";
import { readTextFile, saveTextToFile } from "./file";

export const transcribeAudio = async (
  audioPath: string,
  token: string
): Promise<string> => {
  try {
    const audioData = readTextFile(audioPath);
    const audioBuffer = Buffer.from(audioData);

    const formData = new FormData();
    formData.append("file", audioBuffer, "audio.mp3");
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
      }
    );
    console.log(response);
    return response.data.text;
  } catch (error: any) {
    console.error(
      "Ocorreu um erro durante a transcrição:",
      error.response.data
    );
    return "";
  }
};

export const createChatCompletion = async (
  textPath: string,
  subject: string,
  token: string
) => {
  try {
    const outputText = readTextFile(textPath);
    const outputParts = outputText.match(new RegExp(`.{1,${4096}}`, "gs"));
    const messages = [
      {
        role: "user",
        content: `O texto abaixo é uma transcrição de um video sobre: ${subject}`,
      },
      {
        role: "user",
        content: "Se comporte como um pastor e resuma o texto",
      },
      { role: "user", content: "O resumo deve ser retornado em markdown." },
      {
        role: "user",
        content:
          "Inclua sempre que possível as passagems bíblicas na versão NAA",
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        summary += response.data.choices[0].message?.content;
      }
    } else {
      console.error("No output parts found.");
    }

    saveTextToFile(summary, "source/summary.txt");
    console.log("Summary saved successfully.");
  } catch (error: any) {
    console.error("An error occurred:", error);
  }
};
