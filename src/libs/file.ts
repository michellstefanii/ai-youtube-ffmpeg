import * as fs from "fs";
import * as path from "path";
import { createDirectoryIfNotExists } from "./folder";

export const removeFile = (filePath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Arquivo removido:", filePath);
        resolve();
      }
    });
  });
};

export const readTextFile = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf8");
};

export const getFilePath = (
  folderPath: string,
  fileName: string
): Promise<Buffer> => {
  const filePath = path.join(folderPath, fileName);
  return fs.promises.readFile(filePath);
};

export const saveTextToFile = (text: string, filePath: string): void => {
  createDirectoryIfNotExists(filePath.split("/")[0]);
  fs.writeFileSync(filePath, text, "utf8");
  console.log(`Texto salvo em ${filePath}`);
};

export const breakTextAfterPeriod = (text: string): string => {
  return text.split(".").map((line) => line.trim() + ".").join('\n');
};
