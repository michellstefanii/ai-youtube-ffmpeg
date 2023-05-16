import * as fs from "fs";

export const createDirectoryIfNotExists = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log("Folder created:", directoryPath);
  } else {
    console.log("Folder already exists:", directoryPath);
  }
};

export const deleteFolderIfExists = (folderPath: string): void => {
  if (fs.existsSync(folderPath)) {
    fs.rmdirSync(folderPath, { recursive: true });
    console.log(`Pasta '${folderPath}' excluída.`);
  } else {
    console.log(`Pasta '${folderPath}' não existe.`);
  }
};

export const getFileNames = async (folderPath: string) => {
  try {
    const fileNames = await fs.promises.readdir(folderPath);
    return fileNames;
  } catch (error) {
    console.error("An error occurred while reading files:", error);
    throw error;
  }
};
