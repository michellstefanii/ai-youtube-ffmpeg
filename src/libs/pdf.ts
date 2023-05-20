import fs from "fs";
import PDFDocument from "pdfkit";
import { pdfPath, summaryFinalSegmentPath, summaryPath, summarySegmentPath } from "../utils/const";
import { joinTextFiles, saveTextToFile } from "./file";

export const createPDFFromTXT = async (): Promise<void> => {
  const doc = new PDFDocument();

  const txtContent = await joinTextFiles(summaryFinalSegmentPath);
  const lines = txtContent.split("\n");

  doc.pipe(fs.createWriteStream(pdfPath));

  let pageNumber = 1;
  let linesPerPage = 40;
  let currentLine = 0;

  while (currentLine < lines.length) {
    doc.addPage();
    doc.font("Helvetica").fontSize(12);

    for (let i = 0; i < linesPerPage && currentLine < lines.length; i++) {
      doc.text(lines[currentLine], {
        align: "left",
        columns: 1,
        width: 400,
        lineGap: 10,
      });
      currentLine++;
    }

    doc.text(`Página ${pageNumber}`, {
      align: "center",
      width: 400,
      lineGap: 10,
    });

    pageNumber++;
  }

  doc.end();

  console.log(`PDF file created at ${pdfPath}`);
};
