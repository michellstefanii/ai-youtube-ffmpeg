import { promisify } from "util";

export const delay = promisify(setTimeout);

export const compareNumeric = (a: string, b: string) => {
  const numA = parseInt(a.split("_")[1].split(".")[0]);
  const numB = parseInt(b.split("_")[1].split(".")[0]);

  return numA - numB;
};

export const calculateTime = (start: Date, end: Date) => {
  const executionTime = (end.getTime() - start.getTime()) / 1000;

  const minutes = Math.floor(executionTime / 60);
  const seconds = Math.floor(executionTime % 60);

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};
