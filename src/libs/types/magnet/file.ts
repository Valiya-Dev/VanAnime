export interface MagnetFile {
  name: string;
  length: number;
}

export interface MagnetFileDetails {
  filesList: MagnetFile[];
  torrentName: string;
}
