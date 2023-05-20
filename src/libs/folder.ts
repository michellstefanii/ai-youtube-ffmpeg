import * as fs from "fs";

export const createDirectoryIfNotExists = (directoryPath: string, disableRemove?: boolean): void => {
  const folders = directoryPath.split("/");
  !disableRemove && folders.pop();
  const folderPath = folders.join("/");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Folder created:", folderPath);
  } else {
    console.log("Folder already exists:", folderPath);
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
