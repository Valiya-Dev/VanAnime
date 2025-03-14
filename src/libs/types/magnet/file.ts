export interface MagnetFile {
  name: string;
  length: string;
}

export interface MagnetFileDetails {
  filesList: MagnetFile[];
  torrentName: string;
}
