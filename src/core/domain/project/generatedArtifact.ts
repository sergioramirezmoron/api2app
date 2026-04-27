export type GeneratedFile = {
  content: string;
  kind: "file";
  path: string;
};

export type GeneratedDirectory = {
  kind: "directory";
  path: string;
};

export type GeneratedArtifact = GeneratedDirectory | GeneratedFile;

export function createDirectory(path: string): GeneratedDirectory {
  return {
    kind: "directory",
    path
  };
}

export function createFile(path: string, content: string): GeneratedFile {
  return {
    content,
    kind: "file",
    path
  };
}
