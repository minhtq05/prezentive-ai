import * as fs from "node:fs";

export function getFilesizeInBytes(filename: string): number {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
