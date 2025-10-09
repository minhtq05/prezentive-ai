import * as fs from "node:fs";
// import path from "node:path";

export function getFilesizeInBytes(filename: string): number {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

// TODO: outdated local-server storage, might be useful later
// Secure file system operations limited to temp folder
// export class SecureTempFS {
//   private tempBasePath: string;

//   constructor(projectId: string) {
//     this.tempBasePath = path.resolve("temp", `temp-${projectId}`);
//   }

//   private validatePath(targetPath: string): string {
//     const resolvedPath = path.resolve(targetPath);
//     if (!resolvedPath.startsWith(this.tempBasePath)) {
//       throw new Error(
//         `Access denied: Path ${targetPath} is outside allowed temp folder`
//       );
//     }
//     return resolvedPath;
//   }

//   existsSync(targetPath: string): boolean {
//     try {
//       const validatedPath = this.validatePath(targetPath);
//       return fs.existsSync(validatedPath);
//     } catch {
//       return false;
//     }
//   }

//   mkdirSync(targetPath: string, options?: { recursive?: boolean }): void {
//     const validatedPath = this.validatePath(targetPath);
//     fs.mkdirSync(validatedPath, options);
//   }

//   createWriteStream(targetPath: string): fs.WriteStream {
//     const validatedPath = this.validatePath(targetPath);
//     return fs.createWriteStream(validatedPath);
//   }

//   rmSync(
//     targetPath: string,
//     options?: { recursive?: boolean; force?: boolean }
//   ): void {
//     const validatedPath = this.validatePath(targetPath);
//     fs.rmSync(validatedPath, options);
//   }

//   getTempBasePath(): string {
//     return this.tempBasePath;
//   }

//   // getProjectId(): string {
//   //   return path.basename(this.tempBasePath).replace('temp-', '');
//   // }

//   getFilePath(filename: string): string {
//     return path.join(this.tempBasePath, filename);
//   }
// }
