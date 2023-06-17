import { mp3Path } from "../utils/const";
import { readFile } from "./file";

export async function uploadFile(): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    const data = readFile(mp3Path);
    const url = "https://api.assemblyai.com/v2/upload";

    try {
      // Send a POST request to the API to upload the file, passing in the headers and the file data
      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: process.env.ASSEMBLY_AI_KEY ?? "",
        },
      });

      // If the response is successful, return the upload URL
      if (response.status === 200) {
        const responseData = await response.json();
        return resolve(responseData["upload_url"]);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return reject();
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      return reject();
    }
  });
}

export async function transcribeAudio(audio_url: string) {
  return new Promise(async (resolve, reject) => {
    console.log("Transcribing audio... This might take a moment.", audio_url);

    const headers = {
      authorization: process.env.ASSEMBLY_AI_KEY ?? "",
      "content-type": "application/json",
    };

    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      body: JSON.stringify({ audio_url, language_code: 'pt-BR' }),
      headers,
    });

    const responseData = await response.json();
    const transcriptId = responseData.id;

    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    while (true) {
      const pollingResponse = await fetch(pollingEndpoint, { headers });
      const transcriptionResult = await pollingResponse.json();

      if (transcriptionResult.status === "completed") {
        console.log('Transcription completed')
        return resolve(transcriptionResult);
      } else if (transcriptionResult.status === "error") {
        console.log('Transcription failed')
        reject(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        console.log('Wait to validate again')
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  });
}
