import * as fs from 'fs';

export const createDirectoryIfNotExists = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log('Pasta criada:', directoryPath);
  } else {
    console.log('Pasta já existe:', directoryPath);
  }
};