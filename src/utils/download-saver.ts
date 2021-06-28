import FileSaver from "file-saver";

export const downloadFile = (blob: Blob, filename: string) => {
  FileSaver.saveAs(blob, filename);
};
